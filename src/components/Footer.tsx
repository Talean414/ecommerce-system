import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">We are a leading e-commerce platform providing high-quality products and excellent customer service.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm hover:text-blue-400">Products</Link></li>
              <li><Link href="/categories" className="text-sm hover:text-blue-400">Categories</Link></li>
              <li><Link href="/about" className="text-sm hover:text-blue-400">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm hover:text-blue-400">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm hover:text-blue-400">Shipping</Link></li>
              <li><Link href="/returns" className="text-sm hover:text-blue-400">Returns</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-blue-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400" title="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white hover:text-blue-400" title="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-blue-400" title="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-blue-400" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">&copy; 2023 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

