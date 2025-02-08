import { NextResponse } from "next/server";
import { stkPush } from "@/lib/mpesa"; // ✅ Named import (not default)

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount } = await req.json();
    const response = await stkPush(phoneNumber, amount);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("STK Push API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
