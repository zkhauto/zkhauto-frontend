import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
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
        <Button className="bg-gray-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
          <Link href="/login">Login</Link>
        </Button>
        <Button className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
