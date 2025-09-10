import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET(request, context) {
  const { customerId } = context.params;

  try {
    const customer = await bcFetch(`/customers(${customerId})`);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch customer", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
