import React from "react";

import HeroSection from "@/components/Hero";
import Scrolltext from "@/components/Scrolltext";
import Trends from "@/components/Trends";
import Blog from "@/components/Blog";
import Scrolltext2 from "@/components/Scrolltext2";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div>
      <HeroSection />
      <Scrolltext />
      <Trends />
      <Scrolltext2 />
    </div>
  );
};

export default page;
