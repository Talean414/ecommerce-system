'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Category = {
  id: string
  name: string
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/products?category=${category.name}`} className="text-blue-500 hover:underline">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
