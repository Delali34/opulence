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

// Updated Constants
const filterOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A-Z", value: "name_asc" },
  { label: "Name: Z-A", value: "name_desc" },
];

// Components
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
    {filterOptions.map((option) => (
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
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />

        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-auto"
        >
          {/* Handle bar for better UX */}
          <div className="flex justify-center p-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pt-2 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setActiveFilter(
                      activeFilter === option.value ? null : option.value
                    );
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeFilter === option.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {activeFilter && (
              <button
                onClick={() => {
                  setActiveFilter(null);
                  onClose();
                }}
                className="w-full mt-4 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </motion.div>
      </>
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

  const sortAndFilterProducts = (products) => {
    if (!activeFilter) return products;

    return [...products].sort((a, b) => {
      switch (activeFilter) {
        case "price_asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price_desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "newest":
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

  const sortedAndFilteredProducts = sortAndFilterProducts(
    categoryData.products
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
                  key={option.value}
                  onClick={() =>
                    setActiveFilter(
                      activeFilter === option.value ? null : option.value
                    )
                  }
                  className={`block w-full text-left py-1 text-sm transition-colors ${
                    activeFilter === option.value
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:pl-8">
            {/* Mobile Filter Controls */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <FaFilter />
                Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
              {sortedAndFilteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden flex justify-between items-center mb-4">
        {" "}
        <MobileFilters
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
    </div>
  );
}
