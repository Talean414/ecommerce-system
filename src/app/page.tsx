import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

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

