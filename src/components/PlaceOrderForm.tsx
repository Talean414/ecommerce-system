'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function PlaceOrderForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderData>()
  const { toast } = useToast()

  interface OrderData {
    productName: string;
    quantity: number;
    shippingAddress: string;
  }

  const onSubmit = async (data: OrderData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed.",
      })
      reset()
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('productName', { required: 'Product name is required' })}
              placeholder="Product Name"
            />
            {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
          </div>
          <div>
            <Input
              {...register('quantity', { 
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' }
              })}
              type="number"
              placeholder="Quantity"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>
          <div>
            <Textarea
              {...register('shippingAddress', { required: 'Shipping address is required' })}
              placeholder="Shipping Address"
            />
            {errors.shippingAddress && <p className="text-red-500 text-sm">{errors.shippingAddress.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

