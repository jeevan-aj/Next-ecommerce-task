"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProductListSkeleton from "./ProductListSkeleton"

interface Product {
  id: number
  title: string
  price: number
  description: string
  image: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name" | "price">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("") // 🔍 Search state

  const router = useRouter()
  const productsPerPage = 10

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (err) {
      setError("An error occurred while fetching products")
      setLoading(false)
      console.log(err)
    }
  }

  const sortedProducts = [...products]
    .filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase())) // 🔍 Filter by search
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      }
    })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleSort = (criteria: "name" | "price") => {
    if (criteria === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(criteria)
      setSortOrder("asc")
    }
  }

  const handleProductClick = (productId: number) => {
    setLoadingProductId(productId)
    router.push(`/product/${productId}`)
  }

  if (loading) return <ProductListSkeleton />
  if (error) return <div>{error}</div>

  return (
    <div>
      <div className="mb-4 px-5 md:px-10 lg:px-40">
        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-black rounded mb-4"
        />
        
        <button onClick={() => handleSort("name")} className="mr-2 px-4 py-2 bg-black text-white rounded">
          Sort by Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => handleSort("price")} className="px-4 py-2 bg-black text-white rounded">
          Sort by Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto px-5 md:px-10 lg:px-40">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded hover:shadow-lg transition-shadow">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                width={200}
                height={200}
                className="mx-auto mb-2 p-10 h-[400px] w-[300px] object-contain"
              />
              <div className="flex flex-col justify-between gap-4">
                <h3 className="font-semibold">{product.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="px-3 py-2 bg-black rounded w-[100px]">
                    <p className="text-white font-bold">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="px-4 py-2 outline-dashed text-black font-medium rounded hover:bg-green-400 transition-colors"
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? <span className="loading-dots">Loading ...</span> : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found</p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastProduct >= sortedProducts.length}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
