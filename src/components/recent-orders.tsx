import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function RecentOrders() {
  const orders = [
    { id: '1234', customer: 'John Doe', total: '$129.99', status: 'Completed' },
    { id: '1235', customer: 'Jane Smith', total: '$79.99', status: 'Processing' },
    { id: '1236', customer: 'Bob Johnson', total: '$199.99', status: 'Shipped' },
    { id: '1237', customer: 'Alice Brown', total: '$59.99', status: 'Pending' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Completed' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

