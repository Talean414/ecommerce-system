export async function GET() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  
    try {
      const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        return Response.json({ accessToken: data.access_token });
      } else {
        return Response.json({ error: "Failed to get access token", details: data }, { status: 500 });
      }
    } catch (error) {
      console.error("M-Pesa Access Token Error:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  