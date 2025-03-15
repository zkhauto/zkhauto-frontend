"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronDown, Star, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Navbar from "../ui/Navbar";
import ImageGallery from "../components/ImageGallery";

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [steering, setSteering] = useState("");
  const [minYear, setMinYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [selectedCar, setSelectedCar] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [currentPage]); // Refetch when page changes

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      
      console.log('Raw data from API:', data);
      console.log('Number of cars:', data.length);
      console.log('First few cars:', data.slice(0, 3));

      // Use the URLs directly from the API
      setCars(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cars.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    setFuel("");
    setTransmission("");
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

  const handleImageClick = (car) => {
    setSelectedCar(car);
    setShowGallery(true);
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

              {(make || model || type || steering || minYear || fuel || transmission) && (
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
                  <option value="">Brand (Any)</option>
                  <option value="audi">Audi</option>
                  <option value="bentley">Bentley</option>
                  <option value="bmw">BMW</option>
                  <option value="ferrari">Ferrari</option>
                  <option value="lamborghini">Lamborghini</option>
                  <option value="mclaren">McLaren</option>
                  <option value="mercedes-benz">Mercedes-Benz</option>
                  <option value="porsche">Porsche</option>
                  <option value="rolls-royce">Rolls-Royce</option>
                </select>

                <select
                  value={type}
                  onChange={(e) => handleInputChange(e, setType)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Type (Any)</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Hatchback">Hatchback</option>
                </select>

                <select
                  value={fuel}
                  onChange={(e) => handleInputChange(e, setFuel)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Fuel Type (Any)</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                  <option value="Hydrogen">Hydrogen</option>
                </select>

                <select
                  value={transmission}
                  onChange={(e) => handleInputChange(e, setTransmission)}
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Transmission (Any)</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">DCT</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
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
              {cars.length} vehicles found (Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, cars.length)})
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

          {/* Car Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {loading ? (
              <div className="col-span-full text-center text-white">Loading cars...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : getCurrentPageItems().length === 0 ? (
              <div className="col-span-full text-center text-white">No cars found</div>
            ) : (
              getCurrentPageItems().map((car) => (
                <div
                  key={car._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div 
                    className="relative h-48 cursor-pointer group"
                    onClick={() => handleImageClick(car)}
                  >
                    <Image
                      src={car.images?.[0]?.url || "/images/placeholder-car.jpg"}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={true}
                      quality={75}
                      loading="eager"
                      unoptimized={true}
                      onError={(e) => {
                        console.error('Image load error for', car.brand, car.model, ':', car.images?.[0]?.url);
                        e.target.src = "/images/placeholder-car.jpg";
                      }}
                    />
                    {car.images && car.images.length > 1 && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white text-sm font-medium">
                          +{car.images.length - 1} more photos
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-gray-400">{car.year}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-white">{car.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Type: {car.type}</p>
                      <p>Fuel: {car.fuel}</p>
                      <p>Transmission: {car.engineTransmission}</p>
                      <p>Mileage: {formatMileage(car.mileage)}</p>
                      <p>Status: {car.status}</p>
                      <p>Color: {car.color}</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(car.price)}
                      </span>
                      <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Image Gallery Modal */}
          {selectedCar && (
            <ImageGallery
              images={selectedCar.images || []}
              isOpen={showGallery}
              onClose={() => {
                setShowGallery(false);
                setSelectedCar(null);
              }}
            />
          )}

          {/* Pagination */}
          {!loading && !error && cars.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-white">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CarListing;
