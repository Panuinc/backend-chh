import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET(request, context) {
  const { customersId } = context.params;

  try {
    const customers = await bcFetch(`/customers(${customersId})`);

    if (!customers) {
      return NextResponse.json({ error: "customers not found" }, { status: 404 });
    }

    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch customers", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
