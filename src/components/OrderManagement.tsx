'use client'

import { useState, useEffect } from 'react'

export default function OrderManagement() {
  interface Order {
    id: number;
    user: {
      name: string;
    };
    total: number;
    status: string;
  }

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`)
    const data = await response.json()
    setOrders(data)
    setIsLoading(false)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user.name}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button className="text-blue-500 mr-2">View</button>
                <button className="text-green-500">Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

