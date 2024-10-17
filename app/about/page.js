"use client";
import React from "react";
import Image from "@/components/Image";
import Services from "@/components/Service";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const NecktieShape = ({ className, color }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 5 L35 15 L25 45 L15 15 Z"
      stroke={color}
      strokeWidth="2"
      fill={color}
      fillOpacity="0.1"
    />
  </svg>
);

const MessageComponent = () => {
  const tieColors = [
    "#2C3E50",
    "#E74C3C",
    "#3498DB",
    "#27AE60",
    "#F39C12",
    "#8E44AD",
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-[#FFF9F2] relative overflow-hidden pt-16">
      <div className="max-w-4xl font-sans2 mx-auto px-4 text-center relative z-10">
        <motion.h1
          className="md:text-4xl lg:text-5xl text-3xl font-bold mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Premium Neckties for the Discerning Professional
        </motion.h1>
        <motion.p
          className="text-lg mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A premium necktie manufacturing business, catering to
          fashion-conscious professionals and businesses. Our expertise lies in
          crafting custom-made neckties and complementary accessories, tailored
          to our clients' unique needs and preferences.
        </motion.p>
        <motion.div
          className="inline-block"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-2xl font-script mb-1">Derrick</p>
          <p className="text-sm">Founder & CEO</p>
        </motion.div>
      </div>

      {/* Static Necktie Shapes */}
      <NecktieShape
        className="absolute top-0 left-0 w-64 h-64 -rotate-12 opacity-30"
        color={tieColors[0]}
      />
      <NecktieShape
        className="absolute top-1/4 right-0 w-80 h-80 rotate-45 opacity-30"
        color={tieColors[1]}
      />
      <NecktieShape
        className="absolute top-1/2 left-1/3 w-56 h-56 -rotate-30 opacity-30"
        color={tieColors[3]}
      />
      <NecktieShape
        className="absolute top-3/4 left-2/3 w-60 h-60 -rotate-15 opacity-30"
        color={tieColors[5]}
      />

      <Image />
      <Services />
      <Footer />
    </section>
  );
};

export default MessageComponent;
