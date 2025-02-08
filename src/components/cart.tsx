"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]) // Ensures it's always an array
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cart")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // Ensure data.items is an array before setting state
      setCartItems(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive",
      })
      setCartItems([]) // Fallback to empty array
    } finally {
      setIsLoading(false)
    }
  }

  const incrementQuantity = async (productId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/cart/increment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to increase quantity")
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      )

      toast({ title: "Cart updated", description: "Increased item quantity." })
    } catch (error) {
      console.error("Error increasing quantity:", error)
      toast({
        title: "Error",
        description: "Could not increase item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const decrementQuantity = async (productId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/cart/decrement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to decrease quantity")
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        )
      )

      toast({ title: "Cart updated", description: "Decreased item quantity." })
    } catch (error) {
      console.error("Error decreasing quantity:", error)
      toast({
        title: "Error",
        description: "Could not decrease item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (productId: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/cart/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))

      toast({ title: "Item removed", description: "The item has been removed from your cart." })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Could not remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const handleCheckout = () => router.push("/checkout")

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <p className="text-center py-4">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => decrementQuantity(item.productId)}
                    disabled={isUpdating || item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    className="w-16 text-center"
                    disabled
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => incrementQuantity(item.productId)}
                    disabled={isUpdating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => removeItem(item.productId)} variant="destructive" size="icon" disabled={isUpdating}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {cartItems.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <div className="text-xl font-semibold">Total: ${calculateTotal().toFixed(2)}</div>
          <Button onClick={handleCheckout} className="bg-primary text-white" disabled={isUpdating}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
