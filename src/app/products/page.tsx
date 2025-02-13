import { ProductList } from "@/components/ProductList";

async function getProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.products; // Ensure the API response structure matches
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductList products={products} />
    </div>
  );
}
