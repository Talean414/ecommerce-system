"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/RegisterForm"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import OtpForm from "@/components/OtpForm" // Import the OTP Form component
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isClient, setIsClient] = useState(false) // New state to handle client-side rendering
  const router = useRouter()

  // Use useEffect to trigger once on client-side rendering
  useEffect(() => {
    setIsClient(true) // Set isClient to true after the first render (on the client side)
  }, [])

  const handleRegistrationStart = () => {
    setIsLoading(true)
    setError(null)
  }

  const handleRegistrationComplete = () => {
    setIsLoading(false)
    setIsOtpSent(true)  // OTP is sent, ask for verification
  }

  const handleRegistrationError = (errorMessage: string) => {
    setError(errorMessage)
    setIsLoading(false)
  }

  const handleOtpSubmit = () => {
    setIsOtpVerified(true)
    // Redirect to login page after OTP verification
    if (isClient) {
      router.push("/auth/signin")
    }
  }

  const handleOtpError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isOtpSent ? (
            // Show registration form if OTP hasn't been sent
            <RegisterForm
              onRegistrationStart={handleRegistrationStart}
              onRegistrationComplete={handleRegistrationComplete}
              onRegistrationError={handleRegistrationError}
            />
          ) : !isOtpVerified ? (
            // Show OTP form if OTP has been sent, but not verified
            <OtpForm onOtpSubmit={handleOtpSubmit} onOtpError={handleOtpError} />
          ) : (
            // Show success message after OTP is verified
            <div className="text-center">
              <h3>OTP Verified Successfully</h3>
              {/* Proceed to next step or redirect */}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}