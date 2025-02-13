"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { SearchBar } from "./SearchBar"
import { Button } from "@/components/ui/button"
// Removed ThemeSwitcher import and functionality

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary font-heading">
          StepStyle
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/products" className="text-foreground hover:text-primary transition-colors duration-300">
            Shop
          </Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition-colors duration-300">
            Categories
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors duration-300">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors duration-300">
            Contact
          </Link>
        </nav>

        <div className="flex-grow mx-4 hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-foreground hover:text-primary transition-colors duration-300">
            <ShoppingCart className="hover-lift" />
          </Link>
          {!session ? (
            <Button asChild variant="ghost">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          ) : (
            <div className="relative">
              <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="ghost"
          className="flex items-center space-x-2"
              >
          <User className="hover-lift" />
          <span className="hidden md:inline">{session.user.name}</span>
              </Button>
              {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50 animate-fadeIn border border-border">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300"
            >
              Profile
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300"
            >
              Orders
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300"
            >
              Sign out
            </button>
          </div>
              )}
            </div>
          )}
        </div>

        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="md:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden animate-slideInFromTop">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>
          <div className="px-2 pb-4">
            <SearchBar />
          </div>
        </div>
      )}
    </header>
  )
}

