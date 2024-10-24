// components/Trends.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Loading Skeleton Component
const CategorySkeleton = () => (
  <div className="relative h-[600px] animate-pulse bg-gray-200">
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
          <div className="h-10 w-36 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50">
    <div className="text-center p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function Trends() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching categories...");

      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      console.log("Categories data:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch categories");
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    try {
      console.log("Navigating to category:", category);
      router.push(`/category/${category.slug}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white font-sans2 py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
          >
            {[1, 2].map((item) => (
              <SwiperSlide key={item}>
                <CategorySkeleton />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white font-sans2 py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState error={error} onRetry={fetchCategories} />
        </div>
      </div>
    );
  }

  // No Categories State
  if (categories.length === 0) {
    return (
      <div className="bg-white font-sans2 py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Categories Found
            </h2>
            <p className="text-gray-600">
              Please check back later for our collections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans2 py-20">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Collections
          </h2>
          <p className="text-gray-600">
            Discover our exquisite range of categories
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, EffectFade]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 8000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="mySwiper"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={category.id}>
              <div
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer"
              >
                <div className="relative h-[600px] group overflow-hidden  shadow-lg">
                  {/* Image Section */}
                  <div className="relative w-full h-full">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover animate-kenburns group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                        <FaShoppingBag className="text-gray-400 text-6xl" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="p-6 backdrop-blur-sm bg-black/20 rounded-lg transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                      <div className="text-white">
                        <p className="text-sm uppercase tracking-wider mb-2 text-gold">
                          Collection
                        </p>
                        <h3 className="text-2xl font-bold mb-4">
                          {category.name}
                        </h3>
                        <p className="mb-4 text-gray-200 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center bg-white text-black md:px-6 px-4 py-2 sm:text-sm text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 rounded">
                            VIEW COLLECTION
                            <FaArrowRight className="ml-2" />
                          </div>
                          <span className="text-gold md:text-sm text-xs">
                            {category.product_count || 0} Products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Counter */}
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded">
                    {String(index + 1).padStart(2, "0")}/
                    {String(categories.length).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #ffffff;
          background: rgba(0, 0, 0, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          --swiper-navigation-size: 20px;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
        }

        @keyframes kenburns {
          0% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-kenburns {
          animation: kenburns 8s linear infinite alternate;
        }

        .swiper-slide-active .animate-kenburns {
          animation: kenburns 8s linear infinite alternate;
        }
      `}</style>
    </div>
  );
}
