"use client";

import { useEffect, useState } from "react";

const Footer = () => {
  const [footerData, setFooterData] = useState({
    companyName: "Car Selling",
    socialLinks: {
      twitter: "#",
      youtube: "#",
      facebook: "#",
    },
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/footer`
        );
        if (!response.ok) throw new Error("Failed to fetch footer data");
        const data = await response.json();
        setFooterData(data);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto   grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            ZKH<span className="text-blue-400">Auto</span>
          </h2>
          <p className="text-gray-400">
            Your trusted partner in finding the perfect vehicle. Quality cars,
            exceptional service.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 hover:text-white"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/inventory" className="text-gray-400 hover:text-white">
                Inventory
              </a>
            </li>
            <li>
              <a href="/financing" className="text-gray-400 hover:text-white">
                Financing
              </a>
            </li>
            <li>
              <a href="/trade-in" className="text-gray-400 hover:text-white">
                Trade-In
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li>
              <a href="/faq" className="text-gray-400 hover:text-white">
                FAQ
              </a>
            </li>
            <li>
              <a href="/support" className="text-gray-400 hover:text-white">
                Support
              </a>
            </li>
            <li>
              <a href="/terms" className="text-gray-400 hover:text-white">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">Kokinniitty 9, 02250 Espoo, Finland</p>
          <p className="text-gray-400">Phone: +358 1234 567890</p>
          <p className="text-gray-400">Email: info@ZKHAuto.com</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; 2025 ZKHAuto. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
