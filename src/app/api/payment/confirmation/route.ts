import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("✅ MPESA Confirmation Received:", data);

    // Extract transaction details
    const transaction = {
      TransactionType: data.TransactionType,
      TransID: data.TransID,
      TransTime: data.TransTime,
      TransAmount: data.TransAmount,
      BusinessShortCode: data.BusinessShortCode,
      BillRefNumber: data.BillRefNumber,
      InvoiceNumber: data.InvoiceNumber,
      OrgAccountBalance: data.OrgAccountBalance,
      ThirdPartyTransID: data.ThirdPartyTransID,
      MSISDN: data.MSISDN,
    };

    console.log("💰 Payment Received:", transaction);

    // TODO: Store transaction in DB & update order status

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("❌ MPESA Confirmation Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error processing request" });
  }
}
