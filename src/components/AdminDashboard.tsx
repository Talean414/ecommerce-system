"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";

export default function AdminDashboard() {
  const { toast } = useToast(); // ✅ Removed unused `activeTab`

  const sendNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;

    try {
      const response = await fetch("/api/admin/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      if (response.ok) {
        toast({
          title: "Newsletter Sent",
          description: "The newsletter has been sent to all subscribers.",
        });
      } else {
        throw new Error("Failed to send newsletter");
      }
    } catch (error) {
      console.error(error); // ✅ Now `error` is used
      toast({
        title: "Error",
        description: "Failed to send newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <CardTitle>Send Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendNewsletter} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <Input id="subject" name="subject" required />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Textarea id="content" name="content" rows={5} required />
                </div>
                <Button type="submit">Send Newsletter</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
