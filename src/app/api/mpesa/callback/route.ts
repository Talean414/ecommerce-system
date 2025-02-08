import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📩 MPESA Callback Received:", JSON.stringify(data, null, 2));

    const stkCallback = data.Body?.stkCallback;
    if (!stkCallback) {
      console.error("⚠️ Invalid Callback Data:", data);
      return NextResponse.json({ error: "Invalid callback data" }, { status: 400 });
    }

    if (stkCallback.ResultCode === 0) {
      // Extract metadata safely
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const getMetadataValue = (name: string) =>
        metadata.find((item: any) => item.Name === name)?.Value || null;

      const transaction = {
        MerchantRequestID: stkCallback.MerchantRequestID,
        CheckoutRequestID: stkCallback.CheckoutRequestID,
        MpesaReceiptNumber: getMetadataValue("MpesaReceiptNumber"),
        Amount: getMetadataValue("Amount"),
        PhoneNumber: getMetadataValue("PhoneNumber"),
      };

      console.log("✅ Payment Successful:", transaction);

      // TODO: Store transaction in database
      // Example: await saveTransactionToDB(transaction);

      return NextResponse.json({ success: true, message: "Payment processed" });
    } else {
      console.error("❌ Payment Failed:", stkCallback.ResultDesc);
      return NextResponse.json({ error: stkCallback.ResultDesc }, { status: 400 });
    }
  } catch (error) {
    console.error("🚨 MPESA Callback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
