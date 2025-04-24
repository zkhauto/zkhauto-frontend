"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Car, Home, Info, Phone, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Common navigation items for all pages
  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5 mr-2" /> },
    { href: "/carlisting", label: "Car Listings", icon: <Car className="w-5 h-5 mr-2" /> },
    { href: "/about", label: "About", icon: <Info className="w-5 h-5 mr-2" /> },
    { href: "/contact", label: "Contact", icon: <Phone className="w-5 h-5 mr-2" /> },
    { href: "/chatlogs", label: "Chat History", icon: <MessageSquare className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-gray-900 fixed w-full z-50 top-0 left-0 border-b border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <Car className="w-8 h-8 mr-2 text-white" />
          <span className="text-2xl font-bold text-white">ZKHAuto</span>
        </Link>
        
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-400"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden w-full md:block md:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 items-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center py-2 pl-3 pr-4 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } w-full md:hidden absolute top-full left-0 bg-gray-900 border-t border-gray-800`}
        >
          <ul className="flex flex-col font-medium p-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 