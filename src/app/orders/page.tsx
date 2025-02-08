import { Metadata } from 'next'
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderHistory } from "@/components/OrderHistory"

export const metadata: Metadata = {
  title: 'Your Orders - E-Shop',
  description: 'View your order history and track your purchases.',
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <OrderHistory />
    </div>
  )
}

