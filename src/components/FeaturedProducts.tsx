import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  { id: 1, name: "Classic Leather Loafers", price: 129.99, image: "/product1.jpg" },
  { id: 2, name: "Sport Running Shoes", price: 89.99, image: "/product2.jpg" },
  { id: 3, name: "Elegant High Heels", price: 159.99, image: "/product3.jpg" },
  { id: 4, name: "Comfortable Sneakers", price: 79.99, image: "/product4.jpg" },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto">
        <h2 className="font-heading text-4xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover-lift">
              <CardContent className="p-4">
                <div className="relative h-64 mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-primary font-bold mb-4">${product.price.toFixed(2)}</p>
                <Button className="w-full">Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

