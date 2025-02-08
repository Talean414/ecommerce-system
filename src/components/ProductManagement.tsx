"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { toast } = useToast()

  const { register, handleSubmit, reset, setValue } = useForm()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("price", data.price)
    formData.append("stock", data.stock)
    formData.append("description", data.description)
    if (data.image[0]) {
      formData.append("image", data.image[0])
    }

    const url = isEditing ? `/api/products/${editingProduct.id}` : "/api/products"
    const method = isEditing ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: isEditing ? "Product Updated" : "Product Added",
        description: isEditing
          ? "The product has been updated successfully."
          : "A new product has been added successfully.",
      })

      reset()
      setIsEditing(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      console.error("Failed to submit product:", error)
      toast({
        title: "Error",
        description: "Failed to submit product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product) => {
    setIsEditing(true)
    setEditingProduct(product)
    reset(product)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      })
      fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <Input {...register("name")} placeholder="Product Name" />
        <Input {...register("price")} placeholder="Price" type="number" step="0.01" />
        <Input {...register("stock")} placeholder="Stock" type="number" />
        <Textarea {...register("description")} placeholder="Description" />
        <Input {...register("image")} type="file" accept="image/*" />
        <Button type="submit">{isEditing ? "Update Product" : "Add Product"}</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="relative h-48 mb-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleEdit(product)} variant="outline">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

