// components/Footer.js
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-[1380px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Our Store */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Our Store</h5>
            <ul>
              <li className="mb-2">3881 Heron Way, Oregon</li>
              <li className="mb-2">United States - 97205</li>
              <li className="mb-2">Phone: (+123)972-883-4780</li>
              <li className="mb-2">Email: support@opulence.com</li>
            </ul>
          </div>

          {/* Outfits */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Outfits</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Top Collection
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Best Seller
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Outfits Of The Day
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Featured Collection
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Legal</h5>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Claim
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Privacy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-gray-400">
          <p>© 2024 Opulence</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaYoutube />
            </a>
            <a href="#" className="hover:text-white">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
