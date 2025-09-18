import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET() {
  try {
    const url = `/ODataV4/Sales_Quote_Excel`;

    const orders = await bcFetch(url);

    if (!orders?.value || orders.value.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    return NextResponse.json(orders.value);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch released orders", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
