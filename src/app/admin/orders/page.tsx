import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { AdminOrderManagement } from "@/components/AdminOrderManagement";

export const metadata: Metadata = {
  title: "Order Management - Admin Dashboard",
  description: "Manage and process customer orders.",
};

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  // Ensure only admins can access this page
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/orders");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      <AdminOrderManagement />
    </div>
  );
}


