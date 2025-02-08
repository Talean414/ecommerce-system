'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function OrderConfirmation() {
  const [order, setOrder] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchLatestOrder = async () => {
      const response = await fetch('/api/orders?limit=1')
      if (response.ok) {
        const orders = await response.json()
        if (orders.length > 0) {
          setOrder(orders[0])
        }
      }
    }

    fetchLatestOrder()
  }, [])

  if (!order) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 text-green-500" />
            Order Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Thank you for your purchase! Your order has been confirmed.</p>
          <div className="space-y-2 mb-4">
            <p><strong>Order Number:</strong> {order.id}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
          <h3 className="font-semibold mb-2">Order Items:</h3>
          <ul className="list-disc list-inside mb-4">
            {order.orderItems.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Shipping Details:</h3>
          <p>{order.shipping.address}</p>
          <p>{order.shipping.city}, {order.shipping.country} {order.shipping.postalCode}</p>
          <div className="mt-6">
            <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

