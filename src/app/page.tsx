import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <Testimonials />
      <Newsletter />
    </main>
  )
}

