"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import user_img from "../../../public/img/user_img.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  // Define navigation links based on user status
  const getNavigationLinks = () => {
    // Default links for non-logged in users
    const publicLinks = [
      { href: "/", label: "Home" },
      { href: "/carlisting", label: "Car Listings" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ];

    // Additional links for logged-in users
    const authenticatedLinks = [
      ...publicLinks,
      { href: "/appointments", label: "Booking and Visiting" },
      // { href: "/booking", label: "Booking and Visiting" },
    ];

    // Admin link
    const adminLink = { href: "/dashboard", label: "Admin" };

    if (!user) {
      return publicLinks;
    }

    if (user.role === "admin") {
      return [...authenticatedLinks, adminLink];
    }

    return authenticatedLinks;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">
        <span className="text-white">Car</span>
        <span className="text-blue-400"> Selling</span>
      </h1>
      <div className="hidden md:flex space-x-6">
        {getNavigationLinks().map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-b-2 border-transparent hover:border-blue-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="space-x-4">
        {!user ? (
          <>
            <Button className="bg-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        ) : (
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700"
          >
            <Image
              src={user.profilePhoto || user_img}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-gray-700"
              priority
              unoptimized={user.profilePhoto?.includes("googleusercontent.com")}
            />
            <span className="text-sm font-medium text-white">
              {user.displayName || `${user.firstName} ${user.lastName}`}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
