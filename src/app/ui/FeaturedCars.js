"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeaturedCars = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/cars`);
        const data = await res.json();

        // Feature only top 6 or with a condition like newest or lowest mileage
        const sortedCars = data
          .sort((a, b) => b.year - a.year)
          .slice(0, 6)
          .map((car) => ({
            ...car,
            price: car.price ?? 0,
            year: car.year ?? 2000,
            mileage: car.mileage ?? 0,
            brand: car.brand ?? "Unknown",
            model: car.model ?? "Unknown",
            fuel: car.fuel ?? "Unknown",
          }));

        setFilteredCars(sortedCars);
      } catch (err) {
        console.error("Error fetching featured cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="text-center bg-gray-900 text-gray-500 text-lg">
        Loading cars...
      </div>
    );
  }

  return (
    <section className=" px-5 py-16 bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl  font-bold text-center  text-white">
          Featured Cars
        </h2>
        <p className="text-slate-400 text-sm mb-10 text-center">
          Drive Your Dream – Discover Our Featured Cars!
        </p>
        {/* {JSON.stringify(filteredCars[0])} */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative">
                <Image
                  src={car.images[0] || "/default-car.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  width={400}
                  height={240}
                  className="w-full h-56 object-cover"
                />
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  Featured
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">
                  {car.brand} {car.model}
                </h3>
                <p className="text-gray-500 text-sm mt-1 mb-3">
                  {car.year} • {car.fuel} • {car.mileage} mi
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-pink-700 text-lg font-bold">
                    {`€${car.price}`}
                  </p>
                  <Link
                    href={`/cars/${car._id}`}
                    className="bg-gradient-to-r from-pink-700 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:scale-105 transition-transform"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
