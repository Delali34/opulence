"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaShoppingCart, FaHeart, FaStar, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../../../components/CartContext";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gold-600">
        Product not found
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-[1320px] font-sans2 mx-auto px-4 py-12 bg-white">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-black hover:text-gold transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to previous page
        </button>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="border border-gold-200">
              <Image
                src={product.image_url}
                alt={product.name}
                width={500}
                height={700}
                className="w-full h-[700px] object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-800">
                {product.name}
              </h1>
              <p className="text-xl text-gold font-semibold mb-4">
                {product.brand}
              </p>
              <p className="text-3xl font-bold text-gold-500">
                ${product.price}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Description:
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-700">Rating:</h2>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating)
                        ? "text-gold"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-600">
                ({product.rating})
              </span>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-black text-white py-4  font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" /> ADD TO CART
            </button>

            <button className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-4 font-bold text-lg transition duration-300 ease-in-out flex items-center justify-center">
              <FaHeart className="mr-2" /> Add to Wishlist
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
