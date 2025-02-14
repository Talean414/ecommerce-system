"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define Order type
type order = {
  id: number;
  createdAt: string;
  total: number;
  status: string;
};

export function OrderHistory({ limit }: { limit?: number }) {
  const [orders, setOrders] = useState<order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders${limit ? `?limit=${limit}` : ""}`, {
        cache: "no-store", // Ensures fresh data is always fetched
      });      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      // Ensure we are getting an array from the API
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]); // Add `limit` as a dependency to re-fetch when it changes

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Include `fetchOrders` in the dependency array

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={order.status === "COMPLETED" ? "secondary" : "default"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <a href={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                  View Details
                </a>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
