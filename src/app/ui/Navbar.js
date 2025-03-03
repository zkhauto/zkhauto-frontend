"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/auth/current-user",
          {
            credentials: "include", // Important for cookies
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">
        <span className="text-white">Car</span>
        <span className="text-blue-400"> Selling</span>
      </h1>
      <div className="hidden md:flex space-x-6">
        <Link
          href="/"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/carlisting"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Car Listings
        </Link>
        <Link
          href="/appointments"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Appointments
        </Link>
        <Link
          href="/booking"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Booking and Visiting
        </Link>
        <Link
          href="/contact"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Contact Us
        </Link>
        <Link
          href="/dashboard"
          className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
        >
          Admin
        </Link>
      </div>
      <div className="space-x-4">
        {!user ? (
          <>
            <Button className="bg-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
              Sign Up
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700"
            >
              <Image
                src={user.profilePhoto || "https://via.placeholder.com/32"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-gray-700"
                priority
                unoptimized={user.profilePhoto?.includes(
                  "googleusercontent.com"
                )}
              />
              <span className="text-sm font-medium text-white">
                {user.displayName || `${user.firstName} ${user.lastName}`}
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
