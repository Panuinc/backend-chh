import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const displayName = searchParams.get("displayName");

  try {
    if (displayName) {
      const customers = await bcFetch(
        `/customers?$filter=contains(displayName,'${displayName}')`
      );
      return NextResponse.json(customers);
    }

    const customers = await bcFetch("/customers");
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch customers", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
