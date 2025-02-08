import { Badge } from '@/components/ui/badge'

export function InventoryOverview({ lowStockProducts }) {
  return (
    <ul className="space-y-4">
      {lowStockProducts.map((product) => (
        <li key={product.id} className="flex items-center justify-between">
          <span className="text-sm font-medium">{product.name}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{product.stock} units</span>
            <Badge variant="warning">Low Stock</Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}

