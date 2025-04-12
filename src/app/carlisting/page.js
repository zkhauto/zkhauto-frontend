"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Fuel,
  Calendar,
  Gauge,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "../ui/Navbar";
import Link from "next/link";

// --- Helper Function for dynamic makes (optional but good) ---
const getUniqueMakes = (cars) => {
  if (!cars || cars.length === 0) return [];
  const makes = cars.map((car) => car.brand);
  return ["any", ...new Set(makes)].sort(); // Add 'any' and sort
};

export default function CarListingPage() {
  const [mounted, setMounted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]); // Original full list
  const [filteredCars, setFilteredCars] = useState([]); // List to display

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Updated Default Max Price
  const [yearRange, setYearRange] = useState([2000, 2024]); // Default Year Range
  const [mileageRange, setMileageRange] = useState([0, 200000]); // Default Max Mileage
  const [sortOrder, setSortOrder] = useState("newest"); // Default sort

  const [uniqueMakes, setUniqueMakes] = useState(["any"]); // For dynamic make dropdown

  // --- Constants for filter ranges ---
  const MAX_PRICE = 1000000; // Updated from 100,000 to 1,000,000
  const MIN_YEAR = 2000;
  const MAX_YEAR = new Date().getFullYear(); // Use current year as max
  const MAX_MILEAGE = 200000;

  // Fetch cars from the backend
  const fetchCars = async () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/cars`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch cars: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Successfully fetched ${data.length} cars`);

      // We don't need to extract makes here since it's already done in loadCars
      return data;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error; // Re-throw to be caught in loadCars
    }
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCars = await fetchCars();
        // Ensure required fields have default values if missing
        const processedCars = fetchedCars.map((car) => ({
          ...car,
          price: car.price ?? 0,
          year: car.year ?? MIN_YEAR,
          mileage: car.mileage ?? 0,
          brand: car.brand ?? "Unknown",
          model: car.model ?? "Unknown",
          fuel: car.fuel ?? "Unknown",
          // Add other fields as needed
        }));
        setCars(processedCars);
        setFilteredCars(processedCars);
        setUniqueMakes(getUniqueMakes(processedCars)); // Calculate unique makes
        console.log("Fetched and processed cars:", processedCars);
      } catch (error) {
        console.error("Failed to load cars:", error);
        setError(error.message);
        setCars([]); // Clear cars on error
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    setMounted(true);
    loadCars();
    // Set initial year range max to current year
    setYearRange([MIN_YEAR, MAX_YEAR]);
  }, []); // Empty dependency array: runs only once on mount

  // --- Filtering and Sorting Effect ---
  useEffect(() => {
    if (!mounted || loading) return; // Don't filter until mounted and loaded

    let tempFilteredCars = [...cars];

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempFilteredCars = tempFilteredCars.filter(
        (car) =>
          car.brand?.toLowerCase().includes(lowerSearchTerm) ||
          car.model?.toLowerCase().includes(lowerSearchTerm) ||
          car.year?.toString().includes(lowerSearchTerm) // Allow searching by year too
        // Add other fields to search if needed (e.g., keywords)
        // (car.keywords && car.keywords.some(k => k.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    // 2. Make Filter
    if (selectedMake !== "any") {
      tempFilteredCars = tempFilteredCars.filter(
        (car) => car.brand?.toLowerCase() === selectedMake.toLowerCase()
      );
    }

    // 3. Price Range Filter
    tempFilteredCars = tempFilteredCars.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    // 4. Year Range Filter
    tempFilteredCars = tempFilteredCars.filter(
      (car) => car.year >= yearRange[0] && car.year <= yearRange[1]
    );

    // 5. Mileage Range Filter
    tempFilteredCars = tempFilteredCars.filter(
      (car) => car.mileage >= mileageRange[0] && car.mileage <= mileageRange[1]
    );

    // 6. Sorting
    tempFilteredCars.sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "mileage": // Assuming low to high
          return a.mileage - b.mileage;
        case "newest": // Assuming newest means highest year
        default:
          return b.year - a.year; // Or use a dateAdded field if available
      }
    });

    setFilteredCars(tempFilteredCars);
  }, [
    cars,
    searchTerm,
    selectedMake,
    priceRange,
    yearRange,
    mileageRange,
    sortOrder,
    mounted,
    loading,
  ]); // Dependencies that trigger re-filtering

  // --- Handler Functions ---
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMake("any");
    setPriceRange([0, MAX_PRICE]);
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setMileageRange([0, MAX_MILEAGE]);
    setSortOrder("newest");
    setShowAdvanced(false); // Optionally hide advanced filters on reset
  };

  // Don't render anything until mounted (prevents hydration errors)
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="container px-4 py-6 mx-auto md:px-6 md:py-8">
        {" "}
        {/* Added mx-auto for centering */}
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Find your perfect car
            </h1>
            <p className="mt-2 text-slate-400">
              Browse our collection of luxury vehicles
            </p>
          </div>

          {/* --- Filter Card --- */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Basic Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search" className="sr-only">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by make, model, or year"
                        className="pl-8 text-white bg-slate-800 border-slate-700 placeholder-slate-400 focus:ring-offset-slate-900 focus:ring-slate-500" // Changed focus ring color
                        value={searchTerm} // Controlled input
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Select
                      value={selectedMake} // Controlled select
                      onValueChange={(value) => setSelectedMake(value || "any")} // Handle potential null value
                    >
                      <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white focus:ring-offset-slate-900 focus:ring-slate-500">
                        <SelectValue placeholder="Any Make" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {uniqueMakes.map((make) => (
                          <SelectItem
                            key={make}
                            value={make}
                            className="capitalize hover:bg-slate-700 focus:bg-slate-700"
                          >
                            {make === "any" ? "Any Make" : make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-start-4">
                    {" "}
                    {/* Empty div to maintain grid layout, or add another filter */}
                    <Button className="w-full invisible">Placeholder</Button>{" "}
                    {/* Keep layout */}
                  </div>
                </div>

                {/* Advanced Filter Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="link"
                    className="flex items-center gap-1 p-0 font-normal h-auto text-slate-400 hover:text-slate-300" // Reverted to slate colors
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {showAdvanced ? "Hide" : "Show"} Advanced Filters
                  </Button>
                  {/* Show Reset only when advanced filters are open OR if any filter is active */}
                  {(showAdvanced ||
                    searchTerm ||
                    selectedMake !== "any" ||
                    priceRange[0] !== 0 ||
                    priceRange[1] !== MAX_PRICE ||
                    yearRange[0] !== MIN_YEAR ||
                    yearRange[1] !== MAX_YEAR ||
                    mileageRange[0] !== 0 ||
                    mileageRange[1] !== MAX_MILEAGE) && (
                    <Button
                      variant="link"
                      className="p-0 font-normal h-auto text-slate-400 hover:text-slate-300"
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                  <div className="grid grid-cols-1 gap-6 pt-4 border-t md:grid-cols-3 border-slate-800">
                    <div className="space-y-2">
                      <Label className="text-slate-400">Price Range</Label>
                      <div className="pt-2">
                        <Slider
                          value={priceRange} // Controlled slider
                          onValueChange={setPriceRange} // Update state on change
                          max={MAX_PRICE}
                          step={1000}
                          className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-slate-500 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-slate-600" // Reverted slider colors
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>
                          ${priceRange[1].toLocaleString()}
                          {priceRange[1] === MAX_PRICE ? "+" : ""}
                        </span>
                      </div>
                    </div>
                    {/* Year Range */}
                    <div className="space-y-2">
                      <Label className="text-slate-400">Year</Label>
                      <div className="pt-2">
                        <Slider
                          value={yearRange} // Controlled slider
                          onValueChange={setYearRange} // Update state on change
                          min={MIN_YEAR}
                          max={MAX_YEAR}
                          step={1}
                          className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-slate-500 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-slate-600" // Reverted slider colors
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                    {/* Mileage Range */}
                    <div className="space-y-2">
                      <Label className="text-slate-400">Mileage</Label>
                      <div className="pt-2">
                        <Slider
                          value={mileageRange} // Controlled slider
                          onValueChange={setMileageRange} // Update state on change
                          max={MAX_MILEAGE}
                          step={5000}
                          className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-slate-500 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-slate-600" // Reverted slider colors
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{mileageRange[0].toLocaleString()} mi</span>
                        <span>
                          {mileageRange[1].toLocaleString()}
                          {mileageRange[1] === MAX_MILEAGE ? "+ mi" : " mi"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* --- Car Listing Section --- */}
          <div className="grid gap-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              {" "}
              {/* Adjust layout for mobile */}
              <h2 className="text-xl font-semibold text-white">
                {loading
                  ? "Loading Cars..."
                  : `${filteredCars.length} Car${
                      filteredCars.length !== 1 ? "s" : ""
                    } Found`}
              </h2>
              <div className="flex items-center self-end gap-2 md:self-auto">
                {" "}
                {/* Align sort to end on mobile */}
                <span className="text-sm text-slate-400">Sort by:</span>
                <Select
                  value={sortOrder} // Controlled select
                  onValueChange={(value) => setSortOrder(value || "newest")}
                  defaultValue="newest"
                >
                  <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:ring-offset-slate-900 focus:ring-slate-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem
                      value="newest"
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      Newest (Year)
                    </SelectItem>
                    <SelectItem
                      value="price-asc"
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      Price: Low to High
                    </SelectItem>
                    <SelectItem
                      value="price-desc"
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      Price: High to Low
                    </SelectItem>
                    <SelectItem
                      value="mileage"
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      Mileage: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditional Rendering for Loading, Error, No Results */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <p className="text-xl text-slate-400">Loading cars...</p>
                {/* Add a spinner here if desired */}
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-64 p-4 text-center bg-red-900/20 border border-red-700 rounded-md">
                <p className="text-xl text-red-400">
                  Error loading cars: {error}
                </p>
              </div>
            )}
            {!loading && !error && filteredCars.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-xl text-slate-400">
                  No cars match your current filters.
                </p>
              </div>
            )}

            {/* Car Grid */}
            {!loading && !error && filteredCars.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCars.map((car) => (
                  <Card
                    key={car._id || car.id} // Use _id if available from MongoDB, fallback to id
                    className="flex flex-col overflow-hidden transition-shadow duration-300 border-slate-800 bg-slate-900/50 hover:shadow-lg hover:shadow-slate-900/50" // Changed hover shadow color
                  >
                    <div className="relative">
                      <Image
                        src={
                          car.images && car.images.length > 0
                            ? car.images[0]
                            : "/placeholder.svg" // Use a default placeholder SVG
                        }
                        alt={`${car.year} ${car.brand} ${car.model}`}
                        width={400} // Increase size slightly for better quality
                        height={250}
                        className="object-cover w-full h-48" // Maintain aspect ratio
                        priority={filteredCars.indexOf(car) < 3} // Prioritize loading images for first few cars
                      />
                      {/* Favorite button - Add state/logic later if needed */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-white/80 text-slate-700 hover:bg-white/90 hover:text-red-500"
                        aria-label="Add to favorites"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                    <CardContent className="flex-grow p-4">
                      {" "}
                      {/* Added flex-grow */}
                      <div className="flex flex-col justify-between h-full">
                        {" "}
                        {/* Ensure content fills space */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            {" "}
                            {/* Added gap */}
                            <h3 className="flex-1 font-semibold text-white truncate">
                              {" "}
                              {/* Allow title to take space */}
                              {car.year} {car.brand} {car.model}
                            </h3>
                            <span className="text-lg font-bold text-white whitespace-nowrap">
                              {" "}
                              {/* Prevent price wrap */}$
                              {car.price?.toLocaleString() ?? "N/A"}{" "}
                              {/* Format price */}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2 mt-1 h-[40px]">
                            {" "}
                            {/* Example Description */}
                            {car.description ||
                              "No description available."}{" "}
                            {/* Add description */}
                          </p>
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
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 p-4 pt-0">
                      {/* Modified this part to fix React.Children.only error */}
                      {car._id ? (
                        <Button className="flex-1" asChild>
                          <Link href={`/cars/${car._id}`}>View Details</Link>
                        </Button>
                      ) : (
                        <Button className="flex-1">
                          <span className="text-slate-500">Details N/A</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800/30 hover:text-slate-300"
                        asChild
                      >
                        <Link href={`/contact/${car._id}`}>Contact Seller</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Button - Implement pagination logic separately if needed */}
            {!loading &&
              !error &&
              cars.length > filteredCars.length && ( // Example condition: show if not all original cars are displayed
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                    // onClick={handleLoadMore} // Add load more logic here
                  >
                    Load More (Not Implemented)
                  </Button>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
