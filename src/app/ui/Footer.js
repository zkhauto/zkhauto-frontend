import Link from "next/link";
import { Facebook, Hash, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-gray-900 border-t border-gray-800 text-gray-200">
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
