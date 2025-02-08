'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function WishlistButton({ productId }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      checkWishlist()
    }
  }, [session, productId])

  const checkWishlist = async () => {
    const response = await fetch(`/api/wishlist?productId=${productId}`)
    const data = await response.json()
    setIsInWishlist(data.isInWishlist)
  }

  const toggleWishlist = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })

    if (response.ok) {
      setIsInWishlist(!isInWishlist)
    } else {
      console.error('Failed to update wishlist')
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

