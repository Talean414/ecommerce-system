import { Home, ShoppingCart, Package, BarChart2, Settings } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-white">E-Shop</h1>
      </div>
      <ul className="flex flex-col py-4">
        <li>
          <Link href="/" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Home /></span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/orders" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><ShoppingCart /></span>
            <span className="text-sm font-medium">Orders</span>
          </Link>
        </li>
        <li>
          <Link href="/inventory" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Package /></span>
            <span className="text-sm font-medium">Inventory</span>
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><BarChart2 /></span>
            <span className="text-sm font-medium">Analytics</span>
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Settings /></span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

