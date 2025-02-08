"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Import next/image

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export default function CheckoutPage() {
  const [cartitems, setCartitems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();

        console.log("Fetched Cart Data:", data); // Debugging log

        if (data && Array.isArray(data.items)) {
          setCartitems(data.items);

          // Calculate total price
          const totalPrice = data.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          setTotal(totalPrice);
        } else {
          console.error("Invalid cart data format", data);
          setError("Cart data is not in the correct format.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch cart data:", error.message);
          setError(error.message);
        } else {
          console.error("Unknown error fetching cart data");
          setError("Failed to load cart data.");
        }
      }
    };

    fetchCartItems();
  }, []);

  const validatePhoneNumber = (phone: string) => {
    const safaricomPattern = /^(2547\d{8}|07\d{8})$/;
    return safaricomPattern.test(phone);
  };

  const validateCreditCard = () => {
    const cardPattern = /^\d{16}$/;
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvPattern = /^\d{3}$/;

    if (!cardPattern.test(cardNumber)) return "Invalid card number. Must be 16 digits.";
    if (!expiryPattern.test(expiryDate)) return "Invalid expiry date. Format: MM/YY";
    if (!cvvPattern.test(cvv)) return "Invalid CVV. Must be 3 digits.";

    return null;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    if (paymentMethod === "Mpesa") {
      const cleanPhone = phoneNumber.trim().replace(/\s+/g, "");
      if (!validatePhoneNumber(cleanPhone)) {
        setError("Please enter a valid Safaricom number (07XXXXXXXX or 2547XXXXXXXX)");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: cleanPhone,
            amount: total,
            callbackUrl: "https://4a39-197-232-62-136.ngrok-free.app", // Replace with actual callback URL
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.errorMessage || "M-Pesa payment failed");

        alert("Payment request sent. Please check your phone.");
        router.push("/orders");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong.");
        }
      }
    } else {
      const cardError = validateCreditCard();
      if (cardError) {
        setError(cardError);
        setLoading(false);
        return;
      }

      alert("Processing credit card payment...");
      router.push("/orders");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      {cartitems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cartitems.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <div className="flex items-center">
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={48} // Adjust as needed
                height={48} // Adjust as needed
                className="w-12 h-12 mr-2"
              />
              <span>{item.product.name} (x{item.quantity})</span>
            </div>
            <span>KES {item.product.price * item.quantity}</span>
          </div>
        ))
      )}

      <div className="mt-4 font-semibold text-lg">Total: KES {total}</div>

      {/* Payment Method Selection */}
      <label className="block mt-4">
        <span className="font-semibold">Payment Method:</span>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Mpesa">Mpesa</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </label>

      {/* M-Pesa Phone Number Field */}
      {paymentMethod === "Mpesa" && (
        <label className="block mt-4">
          <span className="font-semibold">M-Pesa Phone Number:</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
      )}

      {/* Credit Card Fields */}
      {paymentMethod === "Credit Card" && (
        <div className="mt-4">
          <label className="block">
            <span className="font-semibold">Card Number:</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ""))}
              maxLength={16}
            />
          </label>

          <div className="flex mt-2">
            <label className="w-1/2 pr-2">
              <span className="font-semibold">Expiry Date (MM/YY):</span>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
              />
            </label>

            <label className="w-1/2 pl-2">
              <span className="font-semibold">CVV:</span>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
              />
            </label>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading || cartitems.length === 0}
        className="w-full bg-blue-600 text-white mt-4 p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
