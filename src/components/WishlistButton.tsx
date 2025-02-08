'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function WishlistButton({ productId }: { productId: string }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Define checkWishlist using useCallback to avoid dependency issues
  const checkWishlist = useCallback(async () => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`)
      const data = await response.json()
      setIsInWishlist(data.isInWishlist)
    } catch (error) {
      console.error("Error checking wishlist:", error)
    }
  }, [productId])

  useEffect(() => {
    if (session) {
      checkWishlist()
    }
  }, [session, checkWishlist])

  const toggleWishlist = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setIsInWishlist(!isInWishlist)
      } else {
        console.error('Failed to update wishlist')
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  return (
    <Button
      onClick={toggleWishlist}
      variant={isInWishlist ? "secondary" : "outline"}
      size="icon"
    >
      <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
      <span className="sr-only">{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
    </Button>
  )
}
