'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, ShoppingCart } from 'lucide-react'

export function WishlistItems({ items = [], onUpdateWishlist }) {
  const [isLoading, setIsLoading] = useState(false)

  const removeFromWishlist = async (productId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdateWishlist()
      } else {
        console.error('Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error)
    }
    setIsLoading(false)
  }

  const addToCart = async (productId) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        // Optionally remove from wishlist after adding to cart
        await removeFromWishlist(productId)
      } else {
        console.error('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // Debugging to ensure `items` is an array
    console.log('Wishlist items:', items)
  }, [items])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items && items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
                <button
                  onClick={() => addToCart(item.id)}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <ShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  )
}
