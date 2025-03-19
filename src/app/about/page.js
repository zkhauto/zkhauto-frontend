"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Navbar from "../ui/Navbar";

export default function About() {
  const router = useRouter();

  return (
    <div className="bg-black">
      <Navbar />
      <div className="pt-16">
        <div className="min-h-screen bg-black text-white">
          {/* Back Button */}
          <div className="container mx-auto px-4 py-4">
            <Button 
              onClick={() => router.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              ← Back
            </Button>
          </div>

          {/* Hero Section */}
          <div className="relative h-[400px] w-full">
            <Image
              src="https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg"
              alt="ZKH Auto Showroom"
              fill
              className="object-cover brightness-50"
              priority
              unoptimized={true}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-5xl font-bold mb-4">ZKH Auto</h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Your Premier Destination for Luxury and Performance Vehicles
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            {/* Mission Statement */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                At ZKH Auto, we are dedicated to providing exceptional automotive experiences through 
                unparalleled service, curated selection of premium vehicles, and a commitment to 
                customer satisfaction that goes beyond the traditional dealership experience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Selection</h3>
                <p className="text-gray-400">
                  Carefully curated collection of luxury and performance vehicles, each meeting our 
                  stringent quality standards.
                </p>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Secure Transactions</h3>
                <p className="text-gray-400">
                  Safe and transparent buying process with detailed vehicle history and comprehensive 
                  documentation.
                </p>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Expert Support</h3>
                <p className="text-gray-400">
                  Dedicated team of automotive experts providing personalized assistance throughout 
                  your car buying journey.
                </p>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ZKH Auto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Quality Assurance</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>• Rigorous vehicle inspection process</li>
                    <li>• Verified vehicle history reports</li>
                    <li>• Premium maintenance standards</li>
                    <li>• Quality certification for all vehicles</li>
                  </ul>
                </div>
                <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">Customer Benefits</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>• Competitive financing options</li>
                    <li>• Extended warranty coverage</li>
                    <li>• After-sales support</li>
                    <li>• Trade-in opportunities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Car?</h2>
              <p className="text-gray-300 mb-8">
                Browse our collection or contact us for personalized assistance.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push('/carlisting')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Inventory
                </Button>
                <Button
                  onClick={() => router.push('/contact')}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-gray-900 py-16 mt-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
                  <div className="text-gray-400">Cars Sold</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-500 mb-2">98%</div>
                  <div className="text-gray-400">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-500 mb-2">10+</div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
                  <div className="text-gray-400">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 