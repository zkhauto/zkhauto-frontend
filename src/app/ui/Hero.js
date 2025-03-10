import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroImg from "../../../public/img/hero0.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Hero = () => {
  return (
    <div>
      <Navbar />
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[500px] lg:min-h-[600px] flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <div className="relative z-10 w-full md:max-w-lg lg:max-w-xl pt-8 sm:pt-10 md:pt-4 lg:pt-6 pb-6 sm:pb-8 md:pb-4 px-4 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
                Discover Your
                <span className="text-blue-400 block mt-1 sm:mt-2">
                  Dream Car Today
                </span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-lg lg:text-xl mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Explore our extensive collection of premium vehicles tailored to
                meet your needs. Whether you&apos;re looking for a luxury sedan
                or a family SUV, we have the perfect car for you.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button className="bg-blue-500 text-white hover:bg-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors">
                  View Listing
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-900 hover:bg-gray-900 hover:text-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors"
                >
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="hidden md:block relative w-full md:absolute md:right-[-5%] md:top-1/2 md:-translate-y-1/2 md:w-[55%] lg:w-[50%] md:h-[350px] lg:h-[400px]">
              <Image
                src={heroImg}
                alt="Luxury SUV"
                width={1200}
                height={800}
                className="object-contain object-center w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
