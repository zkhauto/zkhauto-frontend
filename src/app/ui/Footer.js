import Link from "next/link";
import { Facebook, Hash, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-gray-900 border-t border-gray-800 text-gray-200">
      {/* Main footer with navigation links */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 py-10 md:grid-cols-3">
        <div className="space-y-4">
          <h6 className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Services
          </h6>
          <nav className="flex flex-col space-y-2">
            <Link href="#" className="hover:text-primary hover:underline">
              Branding
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Design
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Marketing
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Advertisement
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h6 className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Company
          </h6>
          <nav className="flex flex-col space-y-2">
            <Link href="#" className="hover:text-primary hover:underline">
              About us
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Contact
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Jobs
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Press kit
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h6 className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Legal
          </h6>
          <nav className="flex flex-col space-y-2">
            <Link href="#" className="hover:text-primary hover:underline">
              Terms of use
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Privacy policy
            </Link>
            <Link href="#" className="hover:text-primary hover:underline">
              Cookie policy
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom footer with logo and social links */}
      <div className="container mx-auto border-t border-gray-800 px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Hash className="h-6 w-6 text-primary" />
            <p className="text-sm">
              Car Selling
              <br />
              1232 Sunset Blvd
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-primary">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link href="#" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
