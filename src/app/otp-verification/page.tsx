// src/app/otp-verification/page.tsx

"use client";

import React from "react";
import OtpForm from "@/components/OtpForm";

const OtpVerificationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Verify Your Account</h1>
      <OtpForm />
    </div>
  );
};

export default OtpVerificationPage;
