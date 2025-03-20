"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Calendar, DollarSign } from "lucide-react";
import Sidebar from "./Sidebar";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Navbar from "./Navbar";

// Import hero images individually for better optimization
import heroImg1 from "../../../public/img/hero0.png";
import heroImg2 from "../../../public/img/hero0.png";
import heroImg3 from "../../../public/img/hero0.png";

const slides = [
  {
    title: "Discover Your",
    highlight: "Dream Car Today",
    description:
      "Explore our extensive collection of premium vehicles tailored to meet your needs. Whether you're looking for a luxury sedan or a family SUV, we have the perfect car for you.",
    image: heroImg1,
    button1: "View Listings",
    button2: "Contact Us",
  },
  {
    title: "Experience Luxury &",
    highlight: "Top Performance",
    description:
      "Drive with elegance and power. Our collection includes the finest luxury cars, ensuring you get the best experience on the road.",
    image: heroImg2,
    button1: "Explore Now",
    button2: "Learn More",
  },
  {
    title: "Your Journey Starts",
    highlight: "With Us",
    description:
      "Find the perfect car that matches your style and needs. Choose from our premium selection and drive with confidence today.",
    image: heroImg3,
    button1: "Get Started",
    button2: "Talk to Us",
  },
];

const Hero = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <section className="relative bg-gray-900 overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="bg-gray-900">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[500px] lg:min-h-[600px] flex flex-col md:flex-row items-center">
                  {/* Left Content */}
                  <div className="relative z-10 w-full md:max-w-lg lg:max-w-xl pt-8 sm:pt-10 md:pt-4 lg:pt-6 pb-6 sm:pb-8 md:pb-4 px-4 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
                      {slide.title}
                      <span className="text-blue-400 block mt-1 sm:mt-2">
                        {slide.highlight}
                      </span>
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg md:text-lg lg:text-xl mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <Button className="bg-blue-500 text-white hover:bg-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors">
                        {slide.button1}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-gray-900 hover:bg-gray-900 hover:text-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors"
                      >
                        {slide.button2}
                      </Button>
                    </div>
                  </div>

                  {/* Right Image Section */}
                  <div className="hidden md:block relative w-full md:absolute md:right-[-5%] md:top-1/2 md:-translate-y-1/2 md:w-[55%] lg:w-[50%] md:h-[350px] lg:h-[400px]">
                    <Image
                      src={slide.image}
                      alt={`${slide.title} ${slide.highlight}`}
                      width={1200}
                      height={800}
                      className="object-contain object-center w-full h-full"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      quality={90}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default Hero;
