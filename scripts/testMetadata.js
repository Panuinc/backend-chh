import "dotenv/config";
import { getAccessToken } from "../lib/bcClient.js";

async function fetchMetadata(token) {
  const url = `https://api.businesscentral.dynamics.com/v2.0/${process.env.BC_TENANT_ID}/${process.env.BC_ENVIRONMENT}/api/v2.0/$metadata`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/xml" },
  });
  const xml = await res.text();
  const matches = [...xml.matchAll(/EntitySet Name="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

async function countEntity(entity, token) {
  try {
    const url = `https://api.businesscentral.dynamics.com/v2.0/${process.env.BC_TENANT_ID}/${process.env.BC_ENVIRONMENT}/api/v2.0/${entity}?$count=true&$top=0`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata.metadata=minimal",
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      if (msg.includes("Query option 'Count' is not allowed"))
        return { entity, status: "⚠️ count not supported" };
      if (msg.includes("You must get to the parent first"))
        return { entity, status: "🔗 requires parent" };
      return { entity, status: `❌ error ${res.status}` };
    }

    const data = await res.json();
    return { entity, status: "✅", count: data["@odata.count"] ?? 0 };
  } catch (err) {
    return { entity, status: "❌ exception", details: err.message };
  }
}

async function runWithLimit(entities, limit, token) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < entities.length) {
      const i = index++;
      const r = await countEntity(entities[i], token);
      results[i] = r;
      if (r.status === "✅") {
        console.log(`📊 ${entities[i]}: ${r.count} records`);
      } else {
        console.log(`${r.status} ${entities[i]}`);
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

async function main() {
  const token = await getAccessToken();
  const entities = await fetchMetadata(token);

  console.log(`✅ Total entities found: ${entities.length}`);

  const results = await runWithLimit(entities, 10, token);

  const ok = results.filter((r) => r.status === "✅").length;
  const notSupported = results.filter((r) => r.status.includes("⚠️")).length;
  const parent = results.filter((r) => r.status.includes("🔗")).length;
  const errors = results.filter((r) => r.status.startsWith("❌")).length;

  console.log("\n=== Summary ===");
  console.log(`✅ Counted: ${ok}`);
  console.log(`⚠️ Not supported: ${notSupported}`);
  console.log(`🔗 Requires parent: ${parent}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📦 Total entities processed: ${results.length}`);
}

main();
