// app/category/[slug]/page.js
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { FaShoppingCart, FaRegSadTear } from "react-icons/fa";
import { motion } from "framer-motion";

// Skeleton loader component
const CategorySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[300px] bg-gray-200 mb-8"></div>
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-8 bg-gray-200 w-1/3 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-[400px] rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export default function CategoryPage({ params }) {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching category data for slug:", params.slug);

        const response = await fetch(`/api/categories/byslug/${params.slug}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        // Log the raw response for debugging
        console.log("Response status:", response.status);

        // Try to get the response text first
        const text = await response.text();

        // Try to parse it as JSON
        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse JSON response:", text);
          throw new Error("Invalid JSON response from server");
        }

        if (!response.ok) {
          throw new Error(
            result.error || `HTTP error! status: ${response.status}`
          );
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch category data");
        }

        console.log("Category data fetched successfully:", result.data);

        // Ensure products array exists
        const categoryWithProducts = {
          ...result.data,
          products: result.data.products || [],
        };

        setCategoryData(categoryWithProducts);
      } catch (error) {
        console.error("Error fetching category:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCategoryData();
    }
  }, [params.slug]);

  if (loading) return <CategorySkeleton />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaRegSadTear className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!categoryData) return null;

  const { products = [] } = categoryData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="relative h-[300px] overflow-hidden">
        {categoryData.image_url ? (
          <img
            src={categoryData.image_url}
            alt={categoryData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{categoryData.name}</h1>
            <p className="text-lg max-w-2xl mx-auto px-4">
              {categoryData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaRegSadTear className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Available
            </h2>
            <p className="text-gray-600">
              There are currently no products in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
