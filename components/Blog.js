// pages/index.js
import React from "react";

const articles = [
  {
    image: "/image1.jpg", // Replace with real images
    date: "25 June, 2022",
    title: "User Memory Design: How To Design For Experiences That Last",
    author: "Allie Grater",
    readTime: "5",
    excerpt: "There are many variations of Lorem Ipsum available...",
  },
  {
    image: "/image2.jpg",
    date: "25 June, 2022",
    title: "User Memory Design: How To Design For Experiences That Last",
    author: "Allie Grater",
    readTime: "5",
    excerpt: "There are many variations of Lorem Ipsum available...",
  },
  {
    image: "/image3.jpg",
    date: "25 June, 2022",
    title: "User Memory Design: How To Design For Experiences That Last",
    author: "Allie Grater",
    readTime: "5",
    excerpt: "There are many variations of Lorem Ipsum available...",
  },
];

export default function Home() {
  return (
    <div className="bg-black font-sans2 py-20">
      <div className="max-w-[1380px] mx-auto px-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-14 text-white text-center">
          Latest Articles & News
        </h1>

        {/* Responsive Grid for Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <div key={idx} className=" border border-gray-200  shadow-lg">
              {/* Article Image */}
              <img
                className=" w-full h-60 object-cover"
                src={article.image}
                alt={article.title}
              />

              {/* Article Content */}
              <div className="p-5">
                {/* Date */}
                <div className="text-gold text-sm font-bold mb-2">
                  {article.date}
                </div>

                {/* Title */}
                <h5 className="text-xl font-bold tracking-tight text-white mb-2">
                  {article.title}
                </h5>

                {/* Author and Read Time */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-white">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                </div>

                {/* Excerpt */}
                <p className="mb-3 font-normal text-gray-200">
                  {article.excerpt}
                </p>

                {/* Read More Link */}
                <a href="#" className="text-gold font-semibold hover:underline">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
