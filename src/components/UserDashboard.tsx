"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductList } from "@/components/ProductList";
import { CategoryList } from "@/components/CategoryList";
import { SearchBar } from "@/components/SearchBar";
import { WishlistItems } from "@/components/WishlistItems";
import { OrderHistory } from "@/components/OrderHistory";
import { Cart } from "@/components/cart";
import { PlaceOrderForm } from "@/components/PlaceOrderForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [userMetrics, setUserMetrics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
  });
  
  // Local state for verification status (fallback to session.user.verified)
  const [isVerified, setIsVerified] = useState<boolean>(
    session?.user?.verified || false
  );
  
  // State for showing a verification success modal (after OTP verification)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // State for OTP send status messages (toast/modal)
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);

  // When session is updated, update our local verified state
  useEffect(() => {
    if (session && session.user) {
      setIsVerified(session.user.verified);
    }
  }, [session]);

  // Check URL for query parameter after OTP verification and update local verification state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      setIsVerified(true);
      setShowSuccessModal(true);
      // Remove the query parameter without a full page reload
      router.replace("/dashboard", undefined, { shallow: true });
      // Hide the success modal after 3.5 seconds
      setTimeout(() => setShowSuccessModal(false), 3500);
    }
  }, [router]);

  // Function to fetch user metrics
  const fetchUserMetrics = async () => {
    try {
      const response = await fetch("/api/user/metrics");
      if (response.ok) {
        const data = await response.json();
        setUserMetrics(data);
      }
    } catch (error) {
      console.error("Error fetching user metrics:", error);
    }
  };

  // Fetch user metrics when session is available
  useEffect(() => {
    if (session) {
      fetchUserMetrics();
    }
  }, [session]);

  // Function to send OTP and then redirect to the OTP verification page
  const sendOtp = async () => {
    try {
      if (!session || !session.user || !session.user.email) {
        alert("No email found. Please sign in again.");
        return;
      }
      const userEmail = session.user.email;
      const response = await axios.post("/api/auth/send-otp", { email: userEmail });
      if (response.status === 200) {
        setModalMessage("OTP sent successfully! Please check your email.");
        setModalType("success");
        setTimeout(() => {
          setModalMessage(null);
          router.push(`/otp-verification?email=${encodeURIComponent(userEmail)}`);
        }, 3500);
      } else {
        setModalMessage(response.data.error || "Failed to send OTP. Please try again later.");
        setModalType("error");
        setTimeout(() => setModalMessage(null), 3500);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setModalMessage("Failed to send OTP. Please try again later.");
      setModalType("error");
      setTimeout(() => setModalMessage(null), 3500);
    }
  };

  // While session is loading...
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  // If the user is unauthenticated...
  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-gray-500">Please sign in to view your dashboard.</div>
      </div>
    );
  }

  // At this point, session is available
  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn relative">
      {/* OTP Send Status Toast/Modal */}
      {modalMessage && (
        <div
          className={`fixed top-4 right-4 p-4 rounded border ${
            modalType === "success"
              ? "bg-green-100 border-green-400 text-green-800"
              : "bg-red-100 border-red-400 text-red-800"
          } transition-opacity duration-300`}
        >
          {modalMessage}
        </div>
      )}

      {/* Verification Success Modal (after OTP verification) */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="p-8 bg-white rounded shadow-lg text-green-800 font-semibold animate-fadeIn transition-opacity duration-500">
            Your account has been successfully verified!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gradient">Welcome, {user.name}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full transition"
          >
            {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          <Button variant="ghost" className="p-0" onClick={() => router.push("/profile")}>
            <Avatar>
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      {/* Verification Notice Banner (only for unverified users) */}
      {!isVerified && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Your account is not verified. Please verify your email to access all features.</p>
          <button
            onClick={sendOtp}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Verify Account
          </button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex justify-center space-x-2 mb-8">
          <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" onClick={() => setActiveTab("wishlist")}>
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="browse" onClick={() => setActiveTab("browse")}>
            Browse Products
          </TabsTrigger>
          <TabsTrigger value="cart" onClick={() => setActiveTab("cart")}>
            Cart
          </TabsTrigger>
          <TabsTrigger
            value="placeOrder"
            onClick={() => setActiveTab("placeOrder")}
            disabled={!isVerified} // Only verified users can place orders
          >
            Place Order
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userMetrics.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">Ksh {userMetrics.totalSpent.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Wishlist Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userMetrics.wishlistCount}</p>
              </CardContent>
            </Card>
            {/* New Profile Overview Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {isVerified ? (
                    <p className="text-green-600 font-bold">Verified Account</p>
                  ) : (
                    <p className="text-red-600 font-bold">Unverified Account</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderHistory limit={5} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderHistory />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <WishlistItems />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Products Tab */}
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>Browse Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <SearchBar />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <CategoryList />
                </div>
                <div className="md:col-span-3">
                  <ProductList />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart">
          <Card>
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <Cart />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Place Order Tab */}
        <TabsContent value="placeOrder">
          {isVerified ? (
            <PlaceOrderForm />
          ) : (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>Please verify your account to place orders.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
