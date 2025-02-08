import { ProductList } from '@/components/ProductList' // Use named import
import { getProducts } from '@/lib/api'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Our Products</h1>
      <ProductList products={products} />
    </div>
  )
}

