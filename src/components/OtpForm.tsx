"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OtpFormProps {
  onOtpSubmit: (otp: string) => void; // Change from any to string
  onOtpError: (errorMessage: string) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ onOtpSubmit, onOtpError }) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect to sign-in if session is not available
  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  // Get the user's email from the session
  const email = session?.user?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate OTP length
    if (otp.length !== 6) {
      const errorMessage = "OTP must be 6 digits.";
      setError(errorMessage);
      onOtpError(errorMessage);
      return;
    }

    // Validate OTP is all numeric
    if (!/^\d+$/.test(otp)) {
      const errorMessage = "OTP must be numeric.";
      setError(errorMessage);
      onOtpError(errorMessage);
      return;
    }

    try {
      // Send OTP for verification to your backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success modal before redirecting
        setShowSuccessModal(true);
        setTimeout(() => {
          onOtpSubmit(otp);
          router.push("/dashboard?verified=true");
        }, 3500);
      } else {
        const errorMessage = data.error || "Invalid OTP.";
        setError(errorMessage);
        onOtpError(errorMessage);
      }
    } catch (error) {
      console.error("An error occurred while verifying OTP:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      onOtpError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="p-8 bg-white rounded shadow-lg text-green-800 font-semibold animate-fadeIn transition-opacity duration-500">
            OTP verified successfully!
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">OTP Verification</h1>
        <p className="mb-6 text-center">
          Enter the OTP sent to your email: <strong>{email}</strong>
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit">Verify OTP</Button>
          </div>
        </form>
 </div>
    </div>
  );
};

export default OtpForm;