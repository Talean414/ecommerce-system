import { Badge } from '@/components/ui/badge'

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface InventoryOverviewProps {
  lowStockProducts: Product[];
}

export function InventoryOverview({ lowStockProducts }: InventoryOverviewProps) {
  return (
    <ul className="space-y-4">
      {lowStockProducts.map((product) => (
        <li key={product.id} className="flex items-center justify-between">
          <span className="text-sm font-medium">{product.name}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{product.stock} units</span>
            <Badge variant="destructive">Low Stock</Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}

