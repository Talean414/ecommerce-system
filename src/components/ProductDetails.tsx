"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, Minus, Plus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Define the product type
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  rating: number;
  numReviews: number;
  description: string;
  image?: string;
};

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, product.stock)));
  };

  const addToCart = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to cart");
      }

      const data = await response.json();
      toast({
        title: "Added to Cart",
        description: data.message || `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart.`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  const buyNow = async () => {
    await addToCart();
    router.push("/checkout");
  };

  const addToWishlist = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to wishlist");
      }

      const data = await response.json();
      toast({
        title: "Added to Wishlist",
        description: data.message || "Item added to your wishlist.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error adding to wishlist:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add item to wishlist. Please try again.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  const shareProduct = async () => {
    const shareURL = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareURL);
        toast({
          title: "Link Copied",
          description: "Product link copied to clipboard.",
        });
      } else {
        throw new Error("Clipboard API not supported");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error sharing product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to copy product link.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="max-w-4xl mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold mb-4">Ksh {product.price.toFixed(2)}</p>
              </motion.div>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= product.rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.numReviews} reviews)
                </span>
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="flex items-center mb-6">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 text-xl font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addToCart} className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button onClick={buyNow} className="flex-1">
                  Buy Now
                </Button>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={addToWishlist} variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-1" /> Wishlist
                </Button>
                <Button onClick={shareProduct} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
