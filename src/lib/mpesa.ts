export async function stkPush(phoneNumber: string, amount: number) {
    try {
      if (!phoneNumber || !amount) {
        return { error: "Phone number and amount are required", status: 400 };
      }
  
      // Get Access Token
      const authResponse = await fetch("http://localhost:3000/api/mpesa/token");
      const authData = await authResponse.json();
      if (!authData.accessToken) {
        return { error: "Failed to get access token", status: 500 };
      }
  
      const accessToken = authData.accessToken;
  
      // Generate Timestamp (without regex to avoid Tailwind issues)
      const isoString = new Date().toISOString();
      const timestamp = isoString
        .split("-").join("")
        .split(":").join("")
        .split(".").join("")
        .replace("T", "")
        .replace("Z", "")
        .substring(0, 14);
  
      // Generate Password
      const shortCode = process.env.MPESA_SHORTCODE!;
      const passKey = process.env.MPESA_PASSKEY!;
      const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");
  
      // Convert phone number to 254 format (Safaricom requirement)
      const formattedPhoneNumber = phoneNumber.replace(/^0/, "254");
  
      // Send STK Push Request
      const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhoneNumber,
          PartyB: shortCode,
          PhoneNumber: formattedPhoneNumber,
          CallBackURL: process.env.MPESA_CALLBACK_URL!,
          AccountReference: "E-Shop Checkout",
          TransactionDesc: "Payment for Order",
        }),
      });
  
      const stkData = await stkResponse.json();
      return stkData;
    } catch (error) {
      console.error("STK Push Error:", error);
      return { error: "Internal Server Error", status: 500 };
    }
  }
  