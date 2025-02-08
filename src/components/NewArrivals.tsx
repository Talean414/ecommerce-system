import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const newArrivals = [
  { id: 1, name: "Urban Street Sneakers", price: 99.99, image: "/new-arrival1.jpg" },
  { id: 2, name: "Luxe Velvet Slippers", price: 69.99, image: "/new-arrival2.jpg" },
  { id: 3, name: "All-Terrain Hiking Boots", price: 149.99, image: "/new-arrival3.jpg" },
]

export default function NewArrivals() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="font-heading text-4xl font-bold mb-8 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals.map((product) => (
            <Card key={product.id} className="hover-lift overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} layout="fill" objectFit="cover" />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">New</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

