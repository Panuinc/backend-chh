import { NextResponse } from "next/server";
import { bcFetch } from "@/lib/bcClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("No");

  try {
    let url = `/ODataV4/Company('${process.env.BC_COMPANY_NAME}')/Released_Production_Order_Excel`;

    if (orderNo) {
      url += `?$filter=No eq '${orderNo}'`;
    }

    const orders = await bcFetch(url);
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch released orders", details: err.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
