// src/app/products/[id]/page.tsx
import { ProductDetails } from "@/components/ProductDetails";
import prisma from "@/lib/prisma";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return <div>Invalid product ID</div>;
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
}


