import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import UserDashboard from "@/components/UserDashboard"
import AdminDashboard from "@/components/AdminDashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  if (session.user.role === 'ADMIN') {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

