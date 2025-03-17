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

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "all",
    type: "all",
    condition: "all",
    year: "",
    price: [0, 1000000],
  });
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6; // Show 6 cars per page (2 rows of 3 in desktop view)

  // Fetch cars from the backend
  const fetchCars = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      console.log("Fetching cars from backend:", backendUrl);
      const response = await fetch(`${backendUrl}/api/cars`);
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      console.log("Cars fetched from backend:", data.length, "cars");
      console.log("First few cars:", data.slice(0, 3));
      setCars(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter cars based on search term and filters
  const filteredCars = cars.filter((car) => {
    const matchesBrand = filters.brand === "all" || car.brand === filters.brand;
    const matchesType = filters.type === "all" || car.type === filters.type;
    const matchesCondition = filters.condition === "all" || car.condition === filters.condition;
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = !filters.year || car.year.toString() === filters.year;
    const matchesPrice =
      car.price >= filters.price[0] && car.price <= filters.price[1];

    return (
      matchesSearch &&
      matchesBrand &&
      matchesType &&
      matchesCondition &&
      matchesYear &&
      matchesPrice
    );
  });

  // Calculate pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Car Listings</h1>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              ← Back to Home
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 bg-gray-800 text-white placeholder-gray-400 border-gray-700"
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
                {Array.from(new Set(cars.map((car) => car.condition))).map(
                  (condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-white">
              Price Range: ${filters.price[0]} - ${filters.price[1]}
            </label>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCars.map((car) => (
            <div
              key={car._id}
              className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800"
            >
              <div className="relative h-48">
                <Image
                  src={car.images?.[0]?.url || "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={true}
                  quality={75}
                  loading="eager"
                  onError={(e) => {
                    console.error('Image load error:', car.images?.[0]?.url);
                    e.target.src = "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg";
                  }}
                  unoptimized={true}
                />
              </div>
              <div className="p-4">
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
                <p className="text-gray-400 text-sm line-clamp-3">
                  {car.description}
                </p>
                <div className="mt-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleViewDetails(car._id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredCars.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50"
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => {
                  // Show first page, last page, current page, and one page before and after current
                  return num === 1 || 
                         num === totalPages || 
                         num === currentPage || 
                         num === currentPage - 1 || 
                         num === currentPage + 1;
                })
                .map((number) => {
                  // If there's a gap, show ellipsis
                  if (number > 1 && number < totalPages && 
                      ![currentPage - 1, currentPage, currentPage + 1].includes(number)) {
                    return <span key={`ellipsis-${number}`} className="text-gray-400">...</span>;
                  }
                  return (
                    <Button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {number}
                    </Button>
                  );
                })}
            </div>

            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results Message */}
        {filteredCars.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No cars found matching your criteria.
          </div>
        )}

        {/* Results Counter */}
        <div className="text-center text-gray-400 mt-4">
          Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length} cars
        </div>
      </div>
    </div>
  );
};

export default CarListing; 