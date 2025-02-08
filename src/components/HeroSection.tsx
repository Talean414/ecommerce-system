import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] overflow-hidden bg-gray-100">
      <div className="container mx-auto h-full flex flex-col lg:flex-row items-center justify-between px-4">
        <div className="z-10 text-center lg:text-left lg:w-1/2 space-y-6">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold">
            Step into <span className="text-gradient">Style</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-lg mx-auto lg:mx-0">
            Discover our latest collection of premium footwear, designed for comfort and crafted for style.
          </p>
          <Button asChild size="lg" className="min-w-[150px] font-semibold">
            <Link href="/auth/signin">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="hidden lg:block lg:w-1/2 relative h-full">
          <Image
            src="/uploads/hero-shoe.jpg"
            alt="Featured stylish shoe"
            layout="fill"
            objectFit="contain"
            priority
            className="object-right"
          />
        </div>
      </div>
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/uploads/hero-shoe.jpg"
          alt="Featured stylish shoe"
          layout="fill"
          objectFit="cover"
          priority
          className="opacity-20"
        />
      </div>
    </section>
  )
}

