// app/category/[slug]/page.js
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import {
  FaShoppingCart,
  FaRegSadTear,
  FaFilter,
  FaSort,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Constants
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A-Z", value: "name_asc" },
  { label: "Name: Z-A", value: "name_desc" },
];

const filterOptions = [
  "Bandanas",
  "Long sleeves",
  "Men",
  "Shirts",
  "Short sleeves",
  "socks",
  "Zip-up shirts",
];

const CategorySkeleton = () => (
  <div className="animate-pulse">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 h-[400px]">
            <div className="h-[300px] bg-gray-200 mb-4"></div>
            <div className="px-4">
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SortDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="ml-auto bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer"
  >
    {sortOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const ProductCard = ({ product }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <div className="relative aspect-[3/4] mb-4">
      <Image
        src={product.image_url || "/placeholder.png"}
        alt={product.name}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300"
      />
    </div>
    <div className="text-center">
      <h3 className="text-sm uppercase tracking-wider mb-2 font-sans2">
        {product.name}
      </h3>
      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="text-gray-400 line-through">
          $
          {product.original_price ||
            (parseFloat(product.price) * 1.2).toFixed(2)}
        </span>
        <span className="text-red-500">
          ${parseFloat(product.price).toFixed(2)}
        </span>
      </div>
    </div>
  </motion.div>
);

const MobileFilters = ({ isOpen, onClose, activeFilter, setActiveFilter }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl z-50"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Filters</h3>
          <button onClick={onClose} className="p-2">
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                setActiveFilter(activeFilter === option ? null : option);
                onClose();
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function CategoryPage({ params }) {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/categories/byslug/${params.slug}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const text = await response.text();
        let result;

        try {
          result = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse JSON response:", text);
          throw new Error("Invalid server response");
        }

        if (!response.ok) {
          throw new Error(
            result.error || `HTTP error! status: ${response.status}`
          );
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch category data");
        }

        setCategoryData({
          ...result.data,
          products: result.data.products || [],
        });
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

  const filterProducts = (products) => {
    if (!activeFilter) return products;
    return products.filter(
      (product) => product.type?.toLowerCase() === activeFilter.toLowerCase()
    );
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  };

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

  const filteredAndSortedProducts = sortProducts(
    filterProducts(categoryData.products)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href="/categories"
            className="text-gray-500 hover:text-gray-900"
          >
            Categories
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{categoryData.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <h2 className="text-sm font-medium mb-4">FILTERS</h2>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setActiveFilter(activeFilter === option ? null : option)
                  }
                  className={`block w-full text-left py-1 text-sm transition-colors ${
                    activeFilter === option
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:pl-8">
            {/* Mobile Filter & Sort Controls */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaFilter />
                Filters
              </button>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Desktop Sort */}
            <div className="hidden md:flex justify-end mb-6">
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </div>
  );
}
