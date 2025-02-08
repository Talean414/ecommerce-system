import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("🔎 MPESA Validation Request:", data);

    // Here, you can check if the payment is valid (e.g., check order exists)
    const isValid = true; // Change this based on your logic

    if (isValid) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    } else {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Transaction Rejected" });
    }
  } catch (error) {
    console.error("❌ MPESA Validation Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error processing request" });
  }
}
