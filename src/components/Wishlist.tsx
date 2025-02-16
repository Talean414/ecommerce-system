'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, ShoppingCart } from 'lucide-react'

// Define the WishlistItem interface outside the component
interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Define the props for the Wishlist component
interface WishlistProps {
  items?: WishlistItem[]; // Optional prop for items
  onUpdateWishlist?: () => void; // Optional callback prop
}

export function Wishlist({ items = [], onUpdateWishlist }: WishlistProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(items);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setIsLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`);
    const data = await response.json();
    setWishlistItems(data);
    setIsLoading(false);
  };

  const removeFromWishlist = async (productId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`, {
      method: 'DELETE',
    });


    if (response.ok) {
      fetchWishlistItems();
      if (onUpdateWishlist) onUpdateWishlist(); // Call the callback if provided
    } else {
      console.error('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (productId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    if (response.ok) {
      await removeFromWishlist(productId);
    } else {
      console.error('Failed to add item to cart');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
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
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove from wishlist"
                  >
                    <Trash2 />
                  </button>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  >
                    <ShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}