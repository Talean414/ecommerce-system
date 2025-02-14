"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Subscribed!",
          description: "You've been added to our newsletter.",
        });
        setEmail("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (error) {
      console.error(error); // ✅ Now using error to avoid ESLint warning
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="font-heading text-4xl font-bold mb-4">Stay in Step with StepStyle</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers, new arrivals, and footwear tips.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-64 bg-primary-foreground text-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="secondary" size="lg" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
