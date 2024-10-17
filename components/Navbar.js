"use client";

import { useState } from "react";
import { BiSearch, BiUser, BiShoppingBag } from "react-icons/bi";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { cartItemsCount } = useCart();

  return (
    <nav className="bg-black border-b font-sans2 sticky top-0 z-50 border-gray-700">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <span className="md:text-3xl text-2xl font-serif text-gold">
                Opulence
              </span>
            </a>
          </div>

          {/* Menu Items - Hidden on mobile */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-white hover:text-gold">
              Home
            </a>
            <a href="/about" className="text-white hover:text-gold">
              About Us
            </a>
            <a href="/shop" className="text-white hover:text-gold">
              Shop
            </a>
            <a href="/contact" className="text-white hover:text-gold">
              Contact
            </a>
          </div>

          {/* Icons - Visible on all screen sizes */}
          <div className="flex items-center space-x-4">
            <BiSearch className="h-6 w-6 text-white hover:text-gold cursor-pointer" />
            {session ? (
              <button
                onClick={() => signOut()}
                className="text-white hover:text-gold"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/api/auth/signin">
                <BiUser className="h-6 w-6 text-white hover:text-gold" />
              </Link>
            )}
            <div className="relative">
              <BiShoppingBag className="h-6 w-6 text-white hover:text-gold cursor-pointer" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gold focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-black border-t border-gray-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
          >
            Home
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
          >
            About us
          </a>
          <a
            href="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
          >
            Shop
          </a>
          <a
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
