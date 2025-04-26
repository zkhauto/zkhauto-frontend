"use client";

import { Calendar, Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function LatestCarsSection() {
  const [latestCars, setLatestCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchLatestCars = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/cars`);
        const data = await res.json();
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6); // Show latest 6
        setLatestCars(sorted);
      } catch (err) {
        console.error("Failed to fetch latest cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCars();
  }, []);

  if (loading)
    return (
      <div className="text-center py-8 bg-gray-900 text-gray-500">
        Loading latest cars...
      </div>
    );

  return (
    <section className=" px-5 py-16 bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold   text-white">
          Latest Arrivals
        </h2>

        <p className="text-slate-400 text-sm mb-10 ">
          Discover the latest additions to our collection of premium cars.
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-x-visible">
          {latestCars.map((car) => (
            <div
              key={car._id}
              className="min-w-[250px] bg-gray-900 shadow-xl rounded-2xl p-4 hover:scale-[1.02] transition duration-300 border"
            >
              <Image
                src={car.images[0] || "/car-placeholder.jpg"}
                alt={`${car.brand} ${car.model}`}
                width={400}
                height={250}
                className="rounded-xl w-full h-48 object-cover mb-3"
              />
              <div className="flex justify-between items-center">
                <div className="mb-2 text-lg font-semibold text-white">
                  {car.brand} {car.model}
                </div>
                <div className="text-white font-bold text-lg mt-2">
                  €{car.price.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 mt-auto">
                {" "}
                {/* Added mt-auto to push to bottom */}
                <div className="flex flex-col items-center p-2 rounded-md bg-slate-800">
                  <Gauge className="w-4 h-4 mb-1 text-slate-400" />
                  <span className="text-xs text-slate-400">
                    {car.mileage?.toLocaleString() ?? "N/A"} mi
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-slate-800">
                  <Calendar className="w-4 h-4 mb-1 text-slate-400" />
                  <span className="text-xs text-slate-400">
                    {car.year ?? "N/A"}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-slate-800">
                  <Fuel className="w-4 h-4 mb-1 text-slate-400" />
                  <span className="text-xs capitalize text-slate-400">
                    {" "}
                    {/* Capitalize fuel type */}
                    {car.fuel ?? "N/A"}
                  </span>
                </div>
              </div>

              <Link
                href={`/cars/${car._id}`}
                className="bg-blue-500 text-white text-center hover:bg-gray-900 px-4 block md:mt-4 common-radius sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
