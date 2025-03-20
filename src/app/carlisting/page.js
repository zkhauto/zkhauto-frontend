"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import Navbar from "../ui/Navbar";

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate the year range dynamically
  const currentYear = new Date().getFullYear();
  const maxModelYear = currentYear + 2; // Allow for future model years
  
  const [filters, setFilters] = useState({
    brand: "all",
    type: "all",
    condition: "all",
    year: [2000, maxModelYear], // Updated to use dynamic max year
    price: [0, 1000000],
  });
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12; // Changed back to 12 cars per page

  // Fetch cars from the backend
  const fetchCars = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      console.log("Fetching cars from backend:", backendUrl);
      const response = await fetch(`${backendUrl}/api/cars`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
        throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Cars fetched successfully:", data.length, "cars");
      
      // Log detailed car data
      data.forEach(car => {
        console.log("Car data:", {
          brand: car.brand,
          model: car.model,
          year: car.year,
          yearType: typeof car.year,
          price: car.price,
          priceType: typeof car.price
        });
      });
      
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        throw new Error('Invalid data format received from server');
      }

      // Sort cars by year in descending order (newest first)
      const sortedCars = data.sort((a, b) => b.year - a.year);
      setCars(sortedCars);
      setLoading(false);
      
      if (data.length === 0) {
        toast.info('No cars found. Please check back later.');
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter cars based on search term and filters
  const filteredCars = cars.filter((car) => {
    console.log("\nFiltering car:", car.brand, car.model);
    console.log("Current filters:", {
      yearRange: filters.year,
      priceRange: filters.price,
      brand: filters.brand,
      type: filters.type,
      condition: filters.condition,
      searchTerm
    });
    
    // Log the actual car values being compared
    console.log("Car values:", {
      year: car.year,
      yearType: typeof car.year,
      price: car.price,
      priceType: typeof car.price,
      brand: car.brand,
      type: car.type,
      condition: car.condition
    });

    const matchesBrand = filters.brand === "all" || car.brand === filters.brand;
    const matchesType = filters.type === "all" || car.type === filters.type;
    const matchesCondition = filters.condition === "all" || car.condition === filters.condition;
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Detailed year range check
    const carYear = Number(car.year);
    const matchesYear = !isNaN(carYear) && 
                       carYear >= filters.year[0] && 
                       carYear <= filters.year[1];
    console.log("Year comparison:", {
      carYear,
      minYear: filters.year[0],
      maxYear: filters.year[1],
      matchesYear
    });

    // Detailed price range check
    const carPrice = Number(car.price);
    const matchesPrice = !isNaN(carPrice) && 
                        carPrice >= filters.price[0] && 
                        carPrice <= filters.price[1];
    console.log("Price comparison:", {
      carPrice,
      minPrice: filters.price[0],
      maxPrice: filters.price[1],
      matchesPrice
    });

    const matches = matchesSearch &&
      matchesBrand &&
      matchesType &&
      matchesCondition &&
      matchesYear &&
      matchesPrice;

    // Log which filters are failing if the car doesn't match
    if (!matches) {
      console.log("Car filtered out:", car.brand, car.model);
      console.log("Filter results:", {
        matchesBrand,
        matchesType,
        matchesCondition,
        matchesSearch,
        matchesYear,
        matchesPrice
      });
    }

    return matches;
  });

  // Calculate pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  console.log("Pagination info:", {
    totalCars: cars.length,
    filteredCars: filteredCars.length,
    currentPage,
    totalPages,
    carsPerPage,
    currentCarsCount: currentCars.length
  });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleViewDetails = (carId) => {
    router.push(`/cars/${carId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20">
          <div className="container mx-auto px-4">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20">
          <div className="container mx-auto px-4">Error: {error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Car Listings</h1>
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-gray-800 hover:bg-gray-700 text-white w-full sm:w-auto"
                >
                  ← Back to Home
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 bg-gray-800 text-white placeholder:text-gray-400 border-gray-700"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={filters.brand}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, brand: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {Array.from(new Set(cars.map((car) => car.brand))).map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Array.from(new Set(cars.map((car) => car.type))).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.condition}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {Array.from(new Set(cars.map((car) => car.condition))).map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <span className="text-base md:text-lg text-gray-300">Price Range:</span>
                    <span className="text-base md:text-lg font-medium text-white">
                      ${filters.price[0].toLocaleString()} - ${filters.price[1].toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-end w-full max-w-[100px]">
                    <span className="text-sm text-gray-400">$1M</span>
                  </div>
          </div>
                <Slider
                  defaultValue={[0, 1000000]}
                  max={1000000}
                  step={1000}
                  value={filters.price}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, price: value }))
                  }
                  className="w-full"
                />
          </div>

              {/* Year Range */}
              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <span className="text-base md:text-lg text-gray-300">Year Range:</span>
                    <span className="text-base md:text-lg font-medium text-white">
                      {filters.year[0]} - {filters.year[1]}
                    </span>
                  </div>
                  <div className="flex items-center justify-end w-full max-w-[100px]">
                    <span className="text-sm text-gray-400">{maxModelYear}</span>
                  </div>
                </div>
                <Slider
                  defaultValue={[2000, maxModelYear]}
                  min={2000}
                  max={maxModelYear}
                  step={1}
                  value={filters.year}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, year: value }))
                  }
                  className="w-full"
                />
                  </div>
                </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCars.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-8">
                  No cars match your current filters. Try adjusting your search criteria.
                </div>
              ) : (
                currentCars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800 flex flex-col"
                  >
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
                      <Image
                        src={car.images?.[0]?.url || "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg"}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover absolute inset-0"
                        priority={true}
                        quality={100}
                        loading="eager"
                        onError={(e) => {
                          console.error('Image load error:', car.images?.[0]?.url);
                          e.target.src = "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h2 className="text-xl font-semibold mb-2 text-white">
                        {car.brand} {car.model}
                      </h2>
                      <p className="text-gray-400 mb-2">{car.year}</p>
                      <p className="text-lg font-bold text-blue-400 mb-2">
                        ${car.price.toLocaleString()}
                      </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                      {car.type}
                    </span>
                        <span className="px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                          {car.condition}
                    </span>
                        <span className="px-2 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                          {car.mileage.toLocaleString()} miles
                    </span>
                  </div>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {car.description}
                      </p>
                      <div className="mt-auto">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleViewDetails(car._id)}
                        >
                        View Details
                        </Button>
                  </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstCar + 1} to {Math.min(indexOfLastCar, filteredCars.length)} of{" "}
                {filteredCars.length} cars
                </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarListing;