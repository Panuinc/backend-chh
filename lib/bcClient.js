import jwt from "jsonwebtoken";

let cachedToken = null;
let cachedExpiresAt = null;

export async function getAccessToken() {
  if (cachedToken && cachedExpiresAt && Date.now() < cachedExpiresAt) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.BC_CLIENT_ID);
  params.append("client_secret", process.env.BC_CLIENT_SECRET);
  params.append("scope", process.env.BC_SCOPE);

  const res = await fetch(process.env.BC_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to get access token: ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;

  const decoded = jwt.decode(data.access_token);
  cachedExpiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 300000;

  return cachedToken;
}

export async function bcFetch(path, options = {}) {
  const token = await getAccessToken();

  let url;
  if (path.startsWith("http")) {
    url = path;
  } else if (path.startsWith("/ODataV4")) {
    url = `${process.env.BC_BASE_URL}/${process.env.BC_TENANT_ID}/${process.env.BC_ENVIRONMENT}${path}`;
  } else {
    url = `${process.env.BC_BASE_URL}/${process.env.BC_TENANT_ID}/${process.env.BC_ENVIRONMENT}/api/v2.0/companies(${process.env.BC_COMPANY})${path}`;
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json;odata.metadata=minimal",
    Prefer: "odata.maxpagesize=1000",
  };
  const headers = { ...defaultHeaders, ...(options.headers || {}) };

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    cachedToken = null;
    cachedExpiresAt = null;
    const retryToken = await getAccessToken();
    const retryHeaders = { ...headers, Authorization: `Bearer ${retryToken}` };
    res = await fetch(url, { ...options, headers: retryHeaders });
  }

  if (!res.ok) {
    throw new Error(`BC API Error: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
