"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface RegisterFormProps {
  onRegistrationStart: () => void
  onRegistrationComplete: () => void
  onRegistrationError: (error: string) => void
}

export function RegisterForm({ onRegistrationStart, onRegistrationComplete, onRegistrationError }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { toast } = useToast() // Now used properly

  const onSubmit = async (data) => {
    onRegistrationStart()
    setIsLoading(true)
    try {
      console.log("Submitting registration form:", data)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      // Sign in the user after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Success",
        description: "Registration successful! Redirecting...",
      })

      onRegistrationComplete()
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)

      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })

      onRegistrationError(error.message || "An unexpected error occurred during registration.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("name", { required: "Name is required" })} placeholder="Full Name" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : "Register"}
      </Button>
    </form>
  )
}
