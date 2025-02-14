import { ProductList } from "@/components/ProductList";

async function getProducts() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  
  const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" }); // Disable caching for fresh data
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
