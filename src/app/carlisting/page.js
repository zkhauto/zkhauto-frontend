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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  Star,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../ui/Navbar";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

// --- Helper Function for dynamic makes (optional but good) ---
const getUniqueMakes = (cars) => {
  if (!cars || cars.length === 0) return [];
  const makes = cars.map((car) => car.brand);
  return ["any", ...new Set(makes)].sort(); // Add 'any' and sort
};

// Helper function to get unique models
const getUniqueModels = (cars) => {
  if (!cars || cars.length === 0) return [];
  const models = cars.map((car) => car.model);
  return ["any", ...new Set(models)].sort(); // Add 'any' and sort
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
  const [selectedModel, setSelectedModel] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [yearRange, setYearRange] = useState([2000, 2030]);
  const [mileageRange, setMileageRange] = useState([0, 500000]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [isSmartSearching, setIsSmartSearching] = useState(false);

  // New state variables for advanced filters
  const [selectedType, setSelectedType] = useState("any");
  const [selectedFuel, setSelectedFuel] = useState("any");
  const [selectedStatus, setSelectedStatus] = useState("any");
  const [selectedColor, setSelectedColor] = useState("any");
  const [engineSizeRange, setEngineSizeRange] = useState([0, 10]);
  const [engineCylindersRange, setEngineCylindersRange] = useState([0, 12]);
  const [horsepowerRange, setHorsepowerRange] = useState([0, 1000]);
  const [selectedTransmission, setSelectedTransmission] = useState("any");
  const [selectedDriveTrain, setSelectedDriveTrain] = useState("any");
  const [selectedCondition, setSelectedCondition] = useState("any");

  const [uniqueMakes, setUniqueMakes] = useState(["any"]);
  const [uniqueModels, setUniqueModels] = useState(["any"]);

  // --- Constants for filter ranges ---
  const MAX_PRICE = 1000000;
  const MIN_YEAR = 2000;
  const MAX_YEAR = 2030;
  const MAX_ENGINE_SIZE = 10;
  const MAX_ENGINE_CYLINDERS = 12;
  const MAX_HORSEPOWER = 1000;

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch cars from the backend
  const fetchCars = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search term if exists
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      // Add filters if not set to "any"
      if (selectedMake !== "any") params.append('brand', selectedMake);
      if (selectedModel !== "any") params.append('model', selectedModel);
      if (selectedType !== "any") params.append('type', selectedType);
      if (selectedFuel !== "any") params.append('fuel', selectedFuel);
      if (selectedStatus !== "any") params.append('status', selectedStatus);
      if (selectedColor !== "any") params.append('color', selectedColor);
      if (selectedTransmission !== "any") params.append('transmission', selectedTransmission);
      if (selectedDriveTrain !== "any") params.append('driveTrain', selectedDriveTrain);
      if (selectedCondition !== "any") params.append('condition', selectedCondition);

      // Add range filters
      params.append('minPrice', priceRange[0]);
      params.append('maxPrice', priceRange[1]);
      params.append('minYear', yearRange[0]);
      params.append('maxYear', yearRange[1]);
      params.append('minMileage', mileageRange[0]);
      params.append('maxMileage', mileageRange[1]);
      params.append('minEngineSize', engineSizeRange[0]);
      params.append('maxEngineSize', engineSizeRange[1]);
      params.append('minCylinders', engineCylindersRange[0]);
      params.append('maxCylinders', engineCylindersRange[1]);
      params.append('minHorsepower', horsepowerRange[0]);
      params.append('maxHorsepower', horsepowerRange[1]);

      // Add sorting parameters
      switch (sortOrder) {
        case 'newest':
          params.append('sortBy', 'year');
          params.append('sortOrder', 'desc');
          break;
        case 'oldest':
          params.append('sortBy', 'year');
          params.append('sortOrder', 'asc');
          break;
        case 'price-low':
          params.append('sortBy', 'price');
          params.append('sortOrder', 'asc');
          break;
        case 'price-high':
          params.append('sortBy', 'price');
          params.append('sortOrder', 'desc');
          break;
        case 'mileage-low':
          params.append('sortBy', 'mileage');
          params.append('sortOrder', 'asc');
          break;
        case 'mileage-high':
          params.append('sortBy', 'mileage');
          params.append('sortOrder', 'desc');
          break;
        default:
          params.append('sortBy', 'createdAt');
          params.append('sortOrder', 'desc');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cars?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Successfully fetched cars with filters:', data);
      return data;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortOrder(value);
    // Trigger a new fetch with updated sort
    fetchCars().then(fetchedCars => {
      setCars(fetchedCars);
      setFilteredCars(fetchedCars);
    }).catch(error => {
      console.error("Error fetching sorted cars:", error);
      setError(error.message);
    });
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCars = await fetchCars();
        console.log('Raw fetched cars:', fetchedCars);
        
        // Map API fields to frontend fields
        const processedCars = fetchedCars.map((car) => ({
          ...car,
          price: car.price || 0,
          year: car.year || MIN_YEAR,
          mileage: car.mileage || 0,
          brand: car.brand || "Unknown",
          model: car.model || "Unknown",
          fuel: car.fuel || "Unknown",
          engineSize: parseFloat(car.engineSize) || 0,
          engineCylinders: car.engineCylinders || 0,
          engineHorsepower: car.engineHorsepower || 0,
          engineTransmission: car.engineTransmission || "Unknown",
          driveTrain: car.driveTrain?.toUpperCase() || "UNKNOWN",
          condition: car.condition || "Used",
          rating: car.rating?.toString() || "0",
          type: car.type || "Unknown",
          status: car.status?.toLowerCase() || "available",
          color: car.color || "Unknown"
        }));
        
        console.log('Processed cars:', processedCars);
        setCars(processedCars);
        setFilteredCars(processedCars);
        setUniqueMakes(getUniqueMakes(processedCars));
        setUniqueModels(getUniqueModels(processedCars));
      } catch (error) {
        console.error("Failed to load cars:", error);
        setError(error.message);
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    setMounted(true);
    loadCars();
  }, [
    searchTerm,
    selectedMake,
    selectedModel,
    selectedType,
    selectedFuel,
    selectedStatus,
    selectedColor,
    selectedTransmission,
    selectedDriveTrain,
    selectedCondition,
    priceRange,
    yearRange,
    mileageRange,
    engineSizeRange,
    engineCylindersRange,
    horsepowerRange,
    sortOrder,
  ]);

  // --- Filtering and Sorting Effect ---
  useEffect(() => {
    if (!mounted) return;

    let result = [...cars];

    // Apply search term filter if it exists
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((car) => 
        (car.brand?.toLowerCase().includes(searchLower) || 
         car.model?.toLowerCase().includes(searchLower) ||
         car.year?.toString().includes(searchTerm))
      );
    }

    // Apply filters only if they are not set to "any"
    if (selectedMake !== "any") {
      result = result.filter((car) => car.brand?.toLowerCase() === selectedMake.toLowerCase());
    }

    if (selectedModel !== "any") {
      result = result.filter((car) => car.model?.toLowerCase() === selectedModel.toLowerCase());
    }

    if (selectedType !== "any") {
      result = result.filter((car) => car.type?.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedFuel !== "any") {
      result = result.filter((car) => car.fuel?.toLowerCase() === selectedFuel.toLowerCase());
    }

    if (selectedStatus !== "any") {
      console.log('Filtering by status:', selectedStatus);
      console.log('Car statuses:', result.map(car => car.status));
      result = result.filter((car) => {
        const carStatus = car.status;
        console.log('Comparing:', carStatus, 'with', selectedStatus);
        return carStatus === selectedStatus.toLowerCase();
      });
    }

    if (selectedColor !== "any") {
      result = result.filter((car) => car.color?.toLowerCase() === selectedColor.toLowerCase());
    }

    if (selectedTransmission !== "any") {
      result = result.filter((car) => car.engineTransmission.toLowerCase() === selectedTransmission.toLowerCase());
    }

    if (selectedDriveTrain !== "any") {
      console.log('Filtering by drive train:', selectedDriveTrain);
      console.log('Car drive trains:', result.map(car => car.driveTrain));
      result = result.filter((car) => {
        // If the car doesn't have a drive train set, it should be shown when "UNKNOWN" is selected
        if (selectedDriveTrain === "UNKNOWN") {
          return !car.driveTrain || car.driveTrain === "UNKNOWN";
        }
        const carDriveTrain = car.driveTrain?.toUpperCase() || "UNKNOWN";
        console.log('Comparing:', carDriveTrain, 'with', selectedDriveTrain.toUpperCase());
        return carDriveTrain === selectedDriveTrain.toUpperCase();
      });
    }

    if (selectedCondition !== "any") {
      console.log('Filtering by condition:', selectedCondition);
      console.log('Car conditions:', result.map(car => car.condition));
      result = result.filter((car) => {
        const carCondition = car.condition;
        console.log('Comparing:', carCondition, 'with', selectedCondition);
        return carCondition === selectedCondition;
      });
    }

    // Range filters - only apply if not at default values
    result = result.filter((car) => {
      const price = parseFloat(car.price) || 0;
      const year = parseInt(car.year) || MIN_YEAR;
      const mileage = parseFloat(car.mileage) || 0;
      const engineSize = parseFloat(car.engineSize) || 0;
      const engineCylinders = parseInt(car.engineCylinders) || 0;
      const horsepower = parseInt(car.engineHorsepower) || 0;

      const isPriceInRange = priceRange[0] === 0 && priceRange[1] === MAX_PRICE ? true : price >= priceRange[0] && price <= priceRange[1];
      const isYearInRange = yearRange[0] === MIN_YEAR && yearRange[1] === MAX_YEAR ? true : year >= yearRange[0] && year <= yearRange[1];
      const isMileageInRange = mileageRange[0] === 0 && mileageRange[1] === 500000 ? true : mileage >= mileageRange[0] && mileage <= mileageRange[1];
      const isEngineSizeInRange = engineSizeRange[0] === 0 && engineSizeRange[1] === 10 ? true : engineSize >= engineSizeRange[0] && engineSize <= engineSizeRange[1];
      const isCylindersInRange = engineCylindersRange[0] === 0 && engineCylindersRange[1] === 12 ? true : engineCylinders >= engineCylindersRange[0] && engineCylinders <= engineCylindersRange[1];
      const isHorsepowerInRange = horsepowerRange[0] === 0 && horsepowerRange[1] === 1000 ? true : horsepower >= horsepowerRange[0] && horsepower <= horsepowerRange[1];

      return isPriceInRange && isYearInRange && isMileageInRange && isEngineSizeInRange && isCylindersInRange && isHorsepowerInRange;
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-desc':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'newest':
          return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
        case 'mileage-low':
          return (parseFloat(a.mileage) || 0) - (parseFloat(b.mileage) || 0);
        default:
          return 0;
      }
    });

    console.log('Total cars:', cars.length);
    console.log('Filtered cars:', result.length);
    console.log('Filtered cars details:', result);
    setFilteredCars(result);
  }, [
    cars,
    selectedMake,
    selectedModel,
    selectedType,
    selectedFuel,
    selectedStatus,
    selectedColor,
    selectedTransmission,
    selectedDriveTrain,
    selectedCondition,
    priceRange,
    yearRange,
    mileageRange,
    engineSizeRange,
    engineCylindersRange,
    horsepowerRange,
    sortOrder,
    mounted,
  ]);

  // --- Handler Functions ---
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMake("any");
    setSelectedModel("any");
    setSelectedType("any");
    setSelectedFuel("any");
    setSelectedStatus("any");
    setSelectedColor("any");
    setEngineSizeRange([0, 10]);
    setEngineCylindersRange([0, 12]);
    setHorsepowerRange([0, 1000]);
    setSelectedTransmission("any");
    setSelectedDriveTrain("any");
    setSelectedCondition("any");
    setPriceRange([0, MAX_PRICE]);
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setMileageRange([0, 500000]);
    setSortOrder("newest");
    setShowAdvanced(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactForm,
          carModel: selectedCar ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})` : '',
          topic: 'Car Inquiry',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully!');
      setContactDialogOpen(false);
      setContactForm({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Add smart search handler
  const handleSmartSearch = async (query) => {
    try {
      setIsSmartSearching(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/smart-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCars(data.cars);
        toast.success(`Found ${data.count} cars matching your search`);
      } else {
        toast.error('Failed to process search query');
      }
    } catch (error) {
      console.error('Smart search error:', error);
      toast.error('Error processing search query');
    } finally {
      setIsSmartSearching(false);
    }
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
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Basic Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search" className="sr-only">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by make, model, or year"
                        className="pl-8 text-gray-900 bg-gray-50 border-gray-200 placeholder-gray-400 focus:ring-offset-white focus:ring-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Select
                      value={selectedMake}
                      onValueChange={(value) => setSelectedMake(value || "any")}
                    >
                      <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900 focus:ring-offset-white focus:ring-gray-500">
                        <SelectValue placeholder="Any Make" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900">
                        {uniqueMakes.map((make) => (
                          <SelectItem
                            key={make}
                            value={make}
                            className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                          >
                            {make === "any" ? "Any Make" : make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-start-4">
                    <Button className="w-full invisible">Placeholder</Button>
                  </div>
                </div>

                {/* Advanced Filter Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Advanced Filters</span>
                    </div>
                    <span className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </Button>

                  {/* Advanced Filters Content */}
                  {showAdvanced && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {/* Price Range */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Price Range</Label>
                            <div className="pt-2">
                              <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={MAX_PRICE}
                                step={1000}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>${priceRange[0].toLocaleString()}</span>
                              <span>
                                ${priceRange[1].toLocaleString()}
                                {priceRange[1] === MAX_PRICE ? "+" : ""}
                              </span>
                            </div>
                          </div>

                          {/* Year Range */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Year</Label>
                            <div className="pt-2">
                              <Slider
                                value={yearRange}
                                onValueChange={setYearRange}
                                min={MIN_YEAR}
                                max={MAX_YEAR}
                                step={1}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{yearRange[0]}</span>
                              <span>{yearRange[1]}</span>
                            </div>
                          </div>

                          {/* Mileage Range */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Mileage</Label>
                            <div className="pt-2">
                              <Slider
                                value={mileageRange}
                                onValueChange={setMileageRange}
                                max={500000}
                                step={10000}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{mileageRange[0].toLocaleString()} mi</span>
                              <span>
                                {mileageRange[1].toLocaleString()}
                                {mileageRange[1] === 500000 ? "+ mi" : " mi"}
                              </span>
                            </div>
                          </div>

                          {/* Model */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Model</Label>
                            <Select
                              value={selectedModel}
                              onValueChange={setSelectedModel}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Model" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {uniqueModels.map((model) => (
                                  <SelectItem
                                    key={model}
                                    value={model}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {model === "any" ? "Any Model" : model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Type */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Type</Label>
                            <Select
                              value={selectedType}
                              onValueChange={(value) => setSelectedType(value || "any")}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "sedan", "suv", "truck", "coupe", "hatchback", "convertible"].map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {type === "any" ? "Any Type" : type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Fuel Type */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Fuel Type</Label>
                            <Select
                              value={selectedFuel}
                              onValueChange={setSelectedFuel}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Fuel Type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "gasoline", "diesel", "electric", "hybrid"].map((fuel) => (
                                  <SelectItem
                                    key={fuel}
                                    value={fuel}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {fuel === "any" ? "Any Fuel Type" : fuel}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
              </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Status</Label>
                            <Select
                              value={selectedStatus}
                              onValueChange={setSelectedStatus}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "available", "sold", "reserved"].map((status) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {status === "any" ? "Any Status" : status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
            </div>

                          {/* Color */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Color</Label>
                            <Select
                              value={selectedColor}
                              onValueChange={setSelectedColor}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Color" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "black", "white", "silver", "gray", "red", "blue", "green", "yellow", "brown"].map((color) => (
                                  <SelectItem
                                    key={color}
                                    value={color}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {color === "any" ? "Any Color" : color}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Engine Size */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Engine Size (L)</Label>
                            <div className="pt-2">
                              <Slider
                                value={engineSizeRange}
                                onValueChange={setEngineSizeRange}
                                max={10}
                                step={0.1}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{engineSizeRange[0]}L</span>
                              <span>{engineSizeRange[1]}L</span>
                            </div>
                          </div>

                          {/* Engine Cylinders */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Engine Cylinders</Label>
                            <div className="pt-2">
                              <Slider
                                value={engineCylindersRange}
                                onValueChange={setEngineCylindersRange}
                                max={12}
                                step={1}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{engineCylindersRange[0]}</span>
                              <span>{engineCylindersRange[1]}</span>
                            </div>
                          </div>

                          {/* Horsepower */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Horsepower</Label>
                            <div className="pt-2">
                              <Slider
                                value={horsepowerRange}
                                onValueChange={setHorsepowerRange}
                                max={1000}
                                step={10}
                                className="[&>span:first-child]:h-1 [&>span:first-child_span]:bg-gray-300 [&>span:first-child_span]:h-1 [&>button]:bg-white [&>button]:w-4 [&>button]:h-4 [&>button]:border-2 [&>button]:border-gray-400"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{horsepowerRange[0]} HP</span>
                              <span>{horsepowerRange[1]} HP</span>
                            </div>
                          </div>

                          {/* Transmission */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Transmission</Label>
                            <Select
                              value={selectedTransmission}
                              onValueChange={setSelectedTransmission}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Transmission" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "automatic", "manual", "semi-automatic"].map((transmission) => (
                                  <SelectItem
                                    key={transmission}
                                    value={transmission}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {transmission === "any" ? "Any Transmission" : transmission}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
            </div>

                          {/* Drive Train */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Drive Train</Label>
                            <Select
                              value={selectedDriveTrain}
                              onValueChange={setSelectedDriveTrain}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Drive Train" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "FWD", "RWD", "AWD", "4WD"].map((drive) => (
                                  <SelectItem
                                    key={drive}
                                    value={drive}
                                    className="hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {drive === "any" ? "Any Drive Train" : drive}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Condition */}
                          <div className="space-y-2">
                            <Label className="text-gray-700">Condition</Label>
                            <Select
                              value={selectedCondition}
                              onValueChange={setSelectedCondition}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-900">
                                <SelectValue placeholder="Any Condition" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 text-gray-900">
                                {["any", "New", "Used"].map((condition) => (
                                  <SelectItem
                                    key={condition}
                                    value={condition}
                                    className="capitalize hover:bg-gray-100 focus:bg-gray-100"
                                  >
                                    {condition === "any" ? "Any Condition" : condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Reset Filters Button */}
                        <div className="flex justify-end pt-4">
                          <Button
                            variant="outline"
                            className="text-gray-700 hover:bg-gray-100"
                            onClick={handleResetFilters}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                  onValueChange={handleSortChange}
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
                      value="mileage-low"
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
              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCars.map((car) => (
                  <Card
                    key={car._id}
                    className="overflow-hidden border-slate-800 bg-slate-900/50"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3]">
                        <Image
                          alt={`${car.brand} ${car.model}`}
                          className="object-cover"
                          fill
                          src={car.images?.[0]?.startsWith('http') ? car.images[0] : "/car-placeholder.jpg"}
                          onError={(e) => {
                            e.target.src = "/car-placeholder.jpg";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full bg-white/25 hover:bg-white/50"
                          >
                            <Heart className="w-5 h-5 text-white" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-white">
                              {car.brand} {car.model}
                    </h3>
                            <p className="text-sm text-slate-400">
                              {car.year} · {car.mileage.toLocaleString()} km
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                              ${car.price.toLocaleString()}
                            </p>
                    </div>
                  </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="flex items-center text-slate-400">
                            <Fuel className="w-4 h-4 mr-2" />
                            <span className="text-sm">{car.fuel}</span>
                          </div>
                          <div className="flex items-center text-slate-400">
                            <Gauge className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {car.engineHorsepower} HP
                    </span>
                  </div>
                  </div>
                    </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2 p-4 border-t border-slate-800">
                      <Button
                        variant="outline"
                        className="w-full border-slate-700 hover:bg-slate-700"
                        asChild
                      >
                        <Link href={`/carlisting/${car._id}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="default"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setSelectedCar(car);
                          setContactDialogOpen(true);
                        }}
                      >
                        Contact Seller
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

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedCar && `Inquire about ${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={contactForm.fullName}
                onChange={(e) =>
                  setContactForm({ ...contactForm, fullName: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setContactDialogOpen(false)}
                className="border-slate-700 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chat Widget */}
      <ChatWidget />
      </div>
  );
}
