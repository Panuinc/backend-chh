import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET(request, context) {
  const { orderNo } = context.params;

  try {
    const url = `/ODataV4/Released_Production_Order_Excel?$filter=No eq '${orderNo}'`;
    const orders = await bcFetch(url);

    if (!orders?.value || orders.value.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orders.value[0]);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch released order", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
