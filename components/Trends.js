"use client";
import { useState } from "react";
import { BiStar, BiHeart, BiShoppingBag } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    image: "/image1.jpg", // Replace with your image paths
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 2,
    image: "/image2.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 3,
    image: "/image3.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 4,
    image: "/image2.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 5,
    image: "/image3.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 1,
    image: "/image1.jpg", // Replace with your image paths
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 2,
    image: "/image2.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
  {
    id: 3,
    image: "/image3.jpg",
    name: "Striped Crest-Patch Roll Neck T-shirt",
    brand: "Polo Ralph Lauren",
    price: "$122.00",
    rating: 4.0,
  },
];

export default function Trends() {
  const [selectedTab, setSelectedTab] = useState("Best Seller Product");
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!session) {
      router.push("/api/auth/signin");
    } else {
      // Add to cart logic here
      console.log("Added to cart");
    }
  };

  return (
    <div className="bg-[#f7f7f7] font-sans2 py-10">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
          Trending Neckties
        </h2>

        {/* Tabs */}
        <div className="flex justify-center space-x-8 mb-8">
          {["New Product", "Best Seller Product", "Featured Product"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`md:text-lg text-sm font-medium pb-2 ${
                  selectedTab === tab
                    ? "text-[#d32d27] border-b-2 border-[#d32d27]"
                    : "text-gray-700"
                } hover:text-[#d32d27]`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white p-4 border rounded-md"
            >
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[320px] object-cover mb-4"
              />

              {/* Hover Icons */}
              <div className="absolute top-[60%] lg:top-[50%] lg:right-[30%] right-[35%] space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 mr-2 bg-gray-200 rounded-full hover:bg-gray-300">
                  <BiHeart className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleAddToCart}
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
                <h3 className="text-md font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-md font-bold text-gray-800">
                  {product.price}
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
          ))}
        </div>
      </div>
    </div>
  );
}
