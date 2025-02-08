import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProfileManagement } from "@/components/ProfileManagement"

export const metadata = {
  title: "User Profile - E-Shop",
  description: "Manage your E-Shop account profile.",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/profile")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileManagement />
    </div>
  )
}

