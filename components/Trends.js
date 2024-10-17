"use client";
import { useState, useEffect } from "react";
import { BiStar, BiHeart, BiShoppingBag } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useCart } from "./CartContext";
import Link from "next/link";

export default function Trends() {
  const [selectedTab, setSelectedTab] = useState("Best Seller Product");
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent the Link from navigating
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] font-sans2 py-10">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
          Trending Neckties
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="relative group bg-white p-4 border rounded-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[320px] object-cover mb-4"
                />

                {/* Hover Icons */}
                <div className="absolute top-[60%] lg:top-[50%] lg:right-[30%] right-[35%] space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 mr-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <BiHeart className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <BiShoppingBag className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 ml-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <FaEye className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <h2 className="text-xl font-bold text-indigo-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-md font-bold text-gray-800">
                    ${product.price}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <BiStar className="text-yellow-500 w-4 h-4" />
                    <p className="ml-2 text-sm text-gray-700">
                      {product.rating} / 5.0
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
