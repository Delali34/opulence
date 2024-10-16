"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ImageGallery = () => {
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-[1320px] mx-auto py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large image */}
        <motion.div
          className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            width={1000}
            height={800}
            src="/image1.jpg"
            alt="Woman in teal jacket"
            className="w-full h-full object-cover rounded-lg"
          />
        </motion.div>

        {/* Top right image */}
        <motion.div
          className="md:col-span-1 md:row-span-1 overflow-hidden rounded-lg"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            width={500}
            height={300}
            src="/image2.jpg"
            alt="Man in workshop"
            className="w-full h-full object-cover rounded-lg"
          />
        </motion.div>

        {/* Bottom left image */}
        <motion.div
          className="md:col-start-3 md:row-start-2 overflow-hidden rounded-lg"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            width={500}
            height={250}
            src="/image3.jpg"
            alt="Sewing machine close-up"
            className="w-full h-full object-cover rounded-lg"
          />
        </motion.div>

        {/* Bottom right image (placeholder) */}
      </div>
    </div>
  );
};

export default ImageGallery;
