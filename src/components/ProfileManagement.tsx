"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"

export function ProfileManagement() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, setValue, watch } = useForm<FormData>()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "")
      setValue("email", session.user.email || "")
    }
  }, [session, setValue])

  interface FormData {
    name: string;
    email: string;
    image: FileList;
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to update profile");
        }
        await update(result);

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });

        router.refresh();
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const profileImage = watch("image")

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={profileImage ? URL.createObjectURL(profileImage[0]) : session?.user?.image || undefined}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="image" className="block mb-2">
                Profile Picture
              </Label>
              <Input id="image" type="file" {...register("image")} accept="image/*" />
            </div>
          </div>
          <div>
            <Label htmlFor="name" className="block mb-2">
              Name
            </Label>
            <Input id="name" {...register("name", { required: "Name is required" })} />
          </div>
          <div>
            <Label htmlFor="email" className="block mb-2">
              Email
            </Label>
            <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Removed conflicting local declaration of useEffect
