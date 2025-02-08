"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  // ✅ Use useCallback to avoid recreation of fetchProducts
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products?page=${currentPage}&category=${category}&search=${search}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // ✅ Now fetchProducts is included in the dependency array

  const addToCart = async (productId: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        toast({ title: "Added to cart", description: "The item has been added to your cart." });
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add item to cart. Please try again.", variant: "destructive" });
    }
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="card hover-lift group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button onClick={() => addToCart(product.id)} className="btn btn-primary p-2 rounded-full">
                      <ShoppingCart className="h-6 w-6" />
                    </Button>
                    <Button className="btn btn-secondary p-2 rounded-full">
                      <Heart className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-secondary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2">Ksh {product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">No products found.</div>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded transition-colors duration-300 ${
              currentPage === page ? "bg-primary text-white" : "bg-gray-200 hover:bg-secondary hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
