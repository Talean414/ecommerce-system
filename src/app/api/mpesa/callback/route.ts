import { NextResponse } from "next/server";

// Define an interface for metadata items
interface MetadataItem {
  Name: string;
  Value: string | number;
}

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
      const metadata: MetadataItem[] = stkCallback.CallbackMetadata?.Item || [];
      const getMetadataValue = (name: string): string | number | null =>
        metadata.find((item) => item.Name === name)?.Value || null; // ✅ No `any`

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
