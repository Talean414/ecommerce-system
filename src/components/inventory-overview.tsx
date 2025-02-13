import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function InventoryOverview() {
  const inventory = [
    { name: 'Product A', stock: 150, status: 'In Stock' },
    { name: 'Product B', stock: 50, status: 'Low Stock' },
    { name: 'Product C', stock: 0, status: 'Out of Stock' },
    { name: 'Product D', stock: 200, status: 'In Stock' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {inventory.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{item.stock} units</span>
                <Badge variant={item.status === 'In Stock' ? 'default' : item.status === 'Low Stock' ? 'secondary' : 'destructive'}>
                  {item.status === 'In Stock' ? 'In Stock' : item.status === 'Low Stock' ? 'Low Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}