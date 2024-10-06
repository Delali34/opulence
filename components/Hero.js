"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSection() {
  // Array of images to cycle through
  const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"]; // Ensure these are in the 'public/images' directory

  // State to track the current image index
  const [currentImage, setCurrentImage] = useState(0);

  // Automatically change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className=" bg-black">
      <section className="max-w-[1380px] mx-auto  font-sans2 text-white flex flex-col lg:flex-row items-center justify-between h-screen px-6 py-8 ">
        {/* Left Section - Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center space-y-6 lg:space-y-4 text-center lg:text-left">
          <button className="bg-white text-black px-4 py-2 rounded-md text-sm lg:text-xs font-medium">
            Get Up To 30% Off
          </button>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gold">
            Discover Your <br /> Favourite <br /> Collection.
          </h1>
          <button className="mt-8 lg:mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md flex items-center space-x-2 text-lg lg:text-base">
            <svg
              className="w-6 h-6 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4L4.3 5H2m7 9v9a1 1 0 001 1h4a1 1 0 001-1v-9m-6 0h6"
              ></path>
            </svg>
            <span>Shop Now</span>
          </button>
        </div>

        {/* Divider Line */}
        <div className="h-[2px] w-full bg-gray-400 my-6 lg:hidden"></div>
        <div className="hidden lg:block h-4/5 w-[1px] bg-gray-400 mx-8"></div>

        {/* Right Section - Fading Image */}
        <div className="w-full lg:w-1/2 relative h-full flex items-center justify-center">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute lg:p-20 inset-0 transition-opacity duration-1000 flex justify-center items-center ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Fashion ${index + 1}`}
                width={1001}
                height={667}
                className="w-full h-full object-cover"
                priority={index === currentImage}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
