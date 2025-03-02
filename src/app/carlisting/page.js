"use client";

import { useState } from "react";
import { Search, X, ChevronDown, Star, Filter } from "lucide-react";
import Image from "next/image";
import Navbar from "../ui/Navbar";
// Sample data for demonstration
const demodata = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    type: "Sedan",
    steering: "Left",
    year: 2022,
    price: 25000,
    mileage: 15000,
    image: "/placeholder.svg?height=200&width=300",
    location: "New York, NY",
    rating: 4.8,
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    type: "Sedan",
    steering: "Left",
    year: 2021,
    price: 22000,
    mileage: 18000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Los Angeles, CA",
    rating: 4.6,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    type: "Sedan",
    steering: "Left",
    year: 2023,
    price: 45000,
    mileage: 5000,
    image: "/placeholder.svg?height=200&width=300",
    location: "San Francisco, CA",
    rating: 4.9,
  },
  {
    id: 4,
    make: "BMW",
    model: "X5",
    type: "SUV",
    steering: "Left",
    year: 2022,
    price: 62000,
    mileage: 12000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Chicago, IL",
    rating: 4.7,
  },
  {
    id: 5,
    make: "Mercedes",
    model: "C-Class",
    type: "Sedan",
    steering: "Left",
    year: 2021,
    price: 48000,
    mileage: 20000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Miami, FL",
    rating: 4.5,
  },
  {
    id: 6,
    make: "Audi",
    model: "Q7",
    type: "SUV",
    steering: "Right",
    year: 2023,
    price: 70000,
    mileage: 8000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Seattle, WA",
    rating: 4.8,
  },
];

const CarListing = () => {
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [steering, setSteering] = useState("");
  const [minYear, setMinYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = () => {
    // Handle search submission
    console.log("Search submitted");
  };

  const clearFilters = () => {
    setSearch("");
    setMake("");
    setModel("");
    setType("");
    setSteering("");
    setMinYear("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-US").format(mileage) + " mi";
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-12">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Dream Car
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Browse our extensive collection of premium vehicles and find the
              perfect match for your lifestyle.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-5xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  value={search}
                  onChange={(e) => handleInputChange(e, setSearch)}
                  type="text"
                  placeholder="Search your dream car"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-white hover:text-primary transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {(make || model || type || steering || minYear) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filters Grid */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <select
                  value={make}
                  onChange={(e) => handleInputChange(e, setMake)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Make (Any)</option>
                  <option value="toyota">Toyota</option>
                  <option value="honda">Honda</option>
                  <option value="tesla">Tesla</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>

                <select
                  value={model}
                  onChange={(e) => handleInputChange(e, setModel)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Model (Any)</option>
                  <option value="camry">Camry</option>
                  <option value="civic">Civic</option>
                  <option value="model3">Model 3</option>
                  <option value="x5">X5</option>
                  <option value="c-class">C-Class</option>
                  <option value="q7">Q7</option>
                </select>

                <select
                  value={type}
                  onChange={(e) => handleInputChange(e, setType)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Type (Any)</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="coupe">Coupe</option>
                  <option value="truck">Truck</option>
                  <option value="hatchback">Hatchback</option>
                </select>

                <select
                  value={steering}
                  onChange={(e) => handleInputChange(e, setSteering)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Steering (Any)</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>

                <select
                  value={minYear}
                  onChange={(e) => handleInputChange(e, setMinYear)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Min Year (Any)</option>
                  {Array.from({ length: 24 }, (_, i) => 2000 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center max-w-7xl mx-auto mb-6">
            <h2 className="text-xl font-semibold text-white">
              {demodata.length} vehicles found
            </h2>
            <select
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              defaultValue="newest"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="mileage">Lowest Mileage</option>
            </select>
          </div>

          {/* Car Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {demodata.map((car) => (
              <div
                key={car.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:translate-y-[-4px] group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white font-medium">
                    {car.year}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">
                      {car.make} {car.model}
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-700/50 rounded-full px-2 py-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-sm text-white">{car.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {car.type}
                    </span>
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {car.steering} Hand
                    </span>
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">
                      {formatMileage(car.mileage)}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <span>{car.location}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(car.price)}
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CarListing;
