"use client";
import Image from "next/image";
import Link from "next/link";

const LatestModel = () => {
  return (
    <div className="bg-gray-900 text-white py-20">
      {/* Featured Car Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Featured Model</h2>
        <div className="max-w-2xl mx-auto">
          {/* BMW */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="relative h-80">
              <Image
                src="/images/bmw-7.jpg"
                alt="BMW 7 Series"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">BMW 7 Series</h3>
              <p className="text-gray-400 mb-6">Experience unmatched luxury and cutting-edge technology.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">$95,000</span>
                <Link 
                  href="/cars/bmw-7-series"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestModel;
