"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Sidebar from "../../ui/Sidebar";

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    type: "all",
    status: "all"
  });
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add filtered cars state
  const [filteredCars, setFilteredCars] = useState([]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cars', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cars');
      }
      
      const data = await response.json();
      console.log('Raw data from API:', data);
      console.log('Number of cars:', data.length);
      console.log('First few cars:', data.slice(0, 3));
      
      setCars(data);
      // Don't set filteredCars here, let the useEffect handle it
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again later.');
      setCars([]);
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  // Apply filters whenever search or filters change
  useEffect(() => {
    if (!cars.length) {
      setFilteredCars([]);
      return;
    }

    console.log('Starting filtering with:', {
      totalCars: cars.length,
      search: search,
      filters: filters,
      firstCar: cars[0] ? `${cars[0].brand} ${cars[0].model}` : 'none'
    });

    let filtered = [...cars];

    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      
      // Split into words and filter out empty strings
      const searchWords = searchTerm
        .split(/[\s,-]+/)
        .filter(word => word.length > 0)
        .map(word => word.replace(/[^\w\s-]/g, '')); // Remove special characters except hyphen
      
      console.log('Search terms:', searchWords);
      
      filtered = filtered.filter(car => {
        // Create a combined string of all searchable fields
        const searchableText = `${car.brand} ${car.model} ${car.type || ''} ${car.year || ''}`.toLowerCase();
        const searchableWords = searchableText.split(/[\s,-]+/).map(word => word.replace(/[^\w\s-]/g, ''));
        
        // Check if all search words are found in the searchable text
        const matches = searchWords.every(searchWord => 
          searchableWords.some(word => word.includes(searchWord))
        );

        console.log('Checking car:', {
          car: `${car.brand} ${car.model} ${car.year}`,
          searchableText,
          searchableWords,
          searchWords,
          matches
        });
        
        return matches;
      });
    }

    // Apply price filters
    if (filters.minPrice !== "") {
      const minPrice = parseFloat(filters.minPrice);
      console.log('Before minPrice filter:', {
        minPrice,
        beforeCount: filtered.length,
        carPrices: filtered.map(car => ({ id: car._id, brand: car.brand, price: parseFloat(car.price) }))
      });
      filtered = filtered.filter(car => {
        const carPrice = parseFloat(car.price);
        const passes = !isNaN(carPrice) && !isNaN(minPrice) && carPrice >= minPrice;
        console.log('Car price check (min):', { 
          car: `${car.brand} ${car.model}`,
          carPrice, 
          minPrice, 
          passes
        });
        return passes;
      });
    }

    if (filters.maxPrice !== "") {
      const maxPrice = parseFloat(filters.maxPrice);
      console.log('Before maxPrice filter:', {
        maxPrice,
        beforeCount: filtered.length,
        carPrices: filtered.map(car => ({ id: car._id, brand: car.brand, price: parseFloat(car.price) }))
      });
      filtered = filtered.filter(car => {
        const carPrice = parseFloat(car.price);
        const passes = !isNaN(carPrice) && !isNaN(maxPrice) && carPrice <= maxPrice;
        console.log('Car price check (max):', { 
          car: `${car.brand} ${car.model}`,
          carPrice, 
          maxPrice, 
          passes
        });
        return passes;
      });
    }

    // Apply year filters
    if (filters.minYear !== "" || filters.maxYear !== "") {
      console.log('Before year filter:', {
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        cars: filtered.map(car => ({
          brand: car.brand,
          model: car.model,
          year: car.year,
          yearType: typeof car.year
        }))
      });

      filtered = filtered.filter(car => {
        // Convert car year to string for comparison
        const carYear = String(car.year).trim();
        
        console.log('Checking car:', {
          car: `${car.brand} ${car.model}`,
          carYear,
          minYear: filters.minYear,
          maxYear: filters.maxYear
        });

        if (!carYear) {
          console.log('No year found for car:', car.brand, car.model);
          return false;
        }

        let passes = true;

        if (filters.minYear !== "") {
          passes = passes && carYear >= filters.minYear;
          console.log('Min year check:', {
            car: `${car.brand} ${car.model}`,
            carYear,
            minYear: filters.minYear,
            passes
          });
        }

        if (filters.maxYear !== "") {
          passes = passes && carYear <= filters.maxYear;
          console.log('Max year check:', {
            car: `${car.brand} ${car.model}`,
            carYear,
            maxYear: filters.maxYear,
            passes
          });
        }

        return passes;
      });

      console.log('After year filter:', {
        count: filtered.length,
        cars: filtered.map(car => ({
          car: `${car.brand} ${car.model}`,
          year: car.year
        }))
      });
    }

    // Apply type filter
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(car => car.type === filters.type);
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(car => car.status === filters.status);
    }

    console.log('Final filtering results:', {
      originalCount: cars.length,
      filteredCount: filtered.length,
      activeFilters: Object.entries(filters).filter(([_, value]) => value).length,
      searchTerm: search,
      firstFilteredCar: filtered[0] ? `${filtered[0].brand} ${filtered[0].model}` : 'none'
    });

    setFilteredCars(filtered);
  }, [cars, search, filters]);

  const handleSearch = (e) => {
    const value = e.target.value;
    console.log('Search submitted:', value);
    setSearch(value);
  };

  const handleFilterChange = (name, value) => {
    console.log('Filter changed:', { name, value, type: typeof value });
    
    let processedValue = value;
    
    // Handle empty values
    if (value === "" || value === null || value === undefined) {
      processedValue = "";
    } else if (["minYear", "maxYear"].includes(name)) {
      // Convert to integer and validate year
      processedValue = parseInt(value, 10);
      console.log('Processing year value:', {
        original: value,
        parsed: processedValue,
        type: typeof processedValue,
        stringValue: String(processedValue)
      });
      
      if (!isNaN(processedValue)) {
        const currentYear = new Date().getFullYear();
        
        // Validate year range
        if (processedValue < 1900) processedValue = 1900;
        if (processedValue > currentYear + 1) processedValue = currentYear + 1;
        
        // Ensure maxYear is not less than minYear
        if (name === "maxYear" && filters.minYear !== "") {
          const minYear = parseInt(filters.minYear, 10);
          if (!isNaN(minYear) && processedValue < minYear) {
            processedValue = minYear;
          }
        }
        // Ensure minYear is not greater than maxYear
        if (name === "minYear" && filters.maxYear !== "") {
          const maxYear = parseInt(filters.maxYear, 10);
          if (!isNaN(maxYear) && processedValue > maxYear) {
            processedValue = maxYear;
          }
        }

        // Convert back to string to ensure exact matching
        processedValue = String(processedValue);
      } else {
        processedValue = "";
      }
      
      console.log('Final year value:', {
        name,
        value: processedValue,
        type: typeof processedValue
      });
    } else if (["minPrice", "maxPrice"].includes(name)) {
      processedValue = parseFloat(value);
      if (!isNaN(processedValue)) {
        if (processedValue < 0) processedValue = 0;
        
        // Ensure maxPrice is not less than minPrice
        if (name === "maxPrice" && filters.minPrice !== "") {
          const minPrice = parseFloat(filters.minPrice);
          if (!isNaN(minPrice) && processedValue < minPrice) {
            processedValue = minPrice;
          }
        }
        // Ensure minPrice is not greater than maxPrice
        if (name === "minPrice" && filters.maxPrice !== "") {
          const maxPrice = parseFloat(filters.maxPrice);
          if (!isNaN(maxPrice) && processedValue > maxPrice) {
            processedValue = maxPrice;
          }
        }
      } else {
        processedValue = "";
      }
    }
    
    console.log('Setting filter value:', { 
      name, 
      originalValue: value, 
      processedValue,
      type: typeof processedValue
    });
    
    setFilters(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Update the price input fields to handle changes properly
  const handlePriceChange = (name, value) => {
    console.log('Price input change:', { name, value });
    handleFilterChange(name, value === "" ? "" : Number(value));
  };

  const clearFilters = () => {
    console.log('Clearing filters');
    setSearch('');
    document.querySelector('input[type="text"]').value = '';
    setFilters({
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      type: "all",
      status: "all"
    });
  };

  // Get unique values for filters
  const uniqueTypes = [...new Set(cars.filter(car => car?.type).map(car => car.type))];
  const uniqueStatuses = [...new Set(cars.filter(car => car?.status).map(car => car.status))];

  const openAddModal = () => {
    const currentYear = new Date().getFullYear();
    setCurrentCar({
      brand: "",
      model: "",
      type: "Sedan",
      steering: "Left",
      transmission: "Automatic",
      fuel: "Gasoline",
      color: "Black",
      year: currentYear.toString(),
      price: "",
      mileage: "",
      image: "",
      location: "",
      status: "available",
      description: "",
      driveTrain: "FWD",
      engineTransmission: "Automatic",
      engineHorsepower: 0,
      engineCylinders: 4,
      engineSize: 2.0,
      rating: 0
    });
    setIsEditing(false);
    setError(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (car) => {
    setCurrentCar(car);
    setIsEditing(true);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (car) => {
    setCurrentCar(car);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentCar) {
      try {
        const response = await fetch(`http://localhost:5000/api/car/${currentCar._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete car');
        }

        await fetchCars(); // Refresh the list after successful deletion
      setIsDeleteModalOpen(false);
      } catch (err) {
        console.error('Error deleting car:', err);
        setError(err.message || 'Failed to delete car. Please try again.');
      }
    }
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();

    try {
      console.log("Current car data:", currentCar);

      // Ensure all numeric fields are properly converted and set default image
      const carData = {
        ...currentCar,
        image: currentCar.image?.trim() || "/placeholder.svg", // Default image if none provided
        brand: currentCar.brand.trim(),
        price: Number(currentCar.price),
        year: Number(currentCar.year),
        mileage: Number(currentCar.mileage),
        engineCylinders: Number(currentCar.engineCylinders),
        engineHorsepower: Number(currentCar.engineHorsepower),
        rating: Number(currentCar.rating)
      };

      console.log("Processed car data:", carData);

      const isEditing = Boolean(currentCar._id);
      const url = isEditing 
        ? `http://localhost:5000/api/car/${currentCar._id}`
        : "http://localhost:5000/api/cars";

      console.log("Making request to:", url, "with method:", isEditing ? "PUT" : "POST");

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text}`);
      }

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to save car");
      }

      await fetchCars();
      setIsAddEditModalOpen(false);
      setCurrentCar(null);
      setError(null);
      
      toast.success(isEditing ? "Car has been successfully updated" : "New car has been added");

    } catch (err) {
      console.error("Error saving car:", err);
      setError(err.message || "Failed to save car. Please try again.");
      toast.error(err.message || "Failed to save car. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === "year") {
      const yearValue = value === "" ? "" : Number(value);
      const currentYear = new Date().getFullYear();
      
      // Validate year range
      if (yearValue !== "") {
        if (yearValue < 1900) return;
        if (yearValue > currentYear + 1) return;
      }
      
      setCurrentCar(prev => ({
        ...prev,
        year: yearValue
      }));
      return;
    }
    
    setCurrentCar(prev => ({
      ...prev,
      [name]:
        name === "price" || name === "mileage"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Add a function to handle image errors
  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg"; // Fallback to placeholder image
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Car Inventory</h1>
            <p className="text-slate-400 mt-2">
              Manage your vehicle listings and inventory
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading cars...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-slate-900/50 border-slate-800 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={handleSearch}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                      className="w-24 bg-slate-800 border-slate-700 text-white"
                      min="0"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                      className="w-24 bg-slate-800 border-slate-700 text-white"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min Year"
                      value={filters.minYear}
                      onChange={(e) => {
                        console.log('Min year input change:', { value: e.target.value });
                        handleFilterChange("minYear", e.target.value);
                      }}
                      className="w-24 bg-slate-800 border-slate-700 text-white"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max Year"
                      value={filters.maxYear}
                      onChange={(e) => {
                        console.log('Max year input change:', { value: e.target.value });
                        handleFilterChange("maxYear", e.target.value);
                      }}
                      className="w-24 bg-slate-800 border-slate-700 text-white"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:text-white"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
            <Button
              onClick={openAddModal}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Car
                </Button>
              </div>

              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-slate-400">
                  {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
                </div>
              </div>

              <div className="bg-slate-900/50 border-slate-800 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Car</TableHead>
                      <TableHead className="text-slate-400">Details</TableHead>
                      <TableHead className="text-slate-400">Price</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Location</TableHead>
                      <TableHead className="text-slate-400 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                        {filteredCars.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                              No cars found matching your filters
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCars.map((car) => (
                            <TableRow key={car._id} className="border-slate-800">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-16 flex-shrink-0 mr-4">
                              <Image
                                className="h-10 w-16 rounded object-cover bg-slate-800"
                                src={car.image || "/placeholder.svg"}
                                alt={`${car.brand} ${car.model}`}
                                width={64}
                                height={40}
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg";
                                  e.target.onerror = null;
                                }}
                                priority={false}
                                loading="lazy"
                                quality={75}
                                sizes="64px"
                                fetchPriority="auto"
                              />
                            </div>
                            <div>
                                    <div className="font-medium text-white text-lg">
                                      {car.brand.charAt(0).toUpperCase() + car.brand.slice(1)} {car.model}
                            </div>
                                    <div className="text-base text-blue-400 font-semibold">
                                      Year: {car.year}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                              <div className="text-white font-medium mb-1">
                                {car.type} • {car.year}
                              </div>
                            <div className="text-sm text-slate-400">
                                    {car.steering} Hand • {car.mileage?.toLocaleString() || 0} mi
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    Transmission: {car.transmission || 'N/A'}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    Fuel Type: {car.fuel || 'N/A'}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    Color: {car.color || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-white">
                            {formatPrice(car.price)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                                    car.status === "available"
                                ? "default"
                                      : car.status === "reserved"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                                    car.status === "available"
                                ? "bg-emerald-500/10 text-emerald-500"
                                      : car.status === "reserved"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-slate-800 text-slate-400"
                            }
                          >
                            {car.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-slate-400">
                            {car.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(car)}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteModal(car)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                          ))
                        )}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Showing <span className="font-medium text-white">1</span> to{" "}
                        <span className="font-medium text-white">
                          {filteredCars.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-white">
                          {filteredCars.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-800 text-slate-400 hover:bg-slate-800"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-800 text-white bg-slate-800"
                        >
                          1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-800 text-slate-400 hover:bg-slate-800"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next</span>
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditing ? "Edit Car" : "Add New Car"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {isEditing ? "Edit car details in your inventory" : "Add a new car to your inventory"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEdit}>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="image" className="text-slate-400">
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={currentCar?.image || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="brand" className="text-slate-400">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  required
                  value={currentCar?.brand || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Enter car brand name"
                />
                <p className="text-sm text-slate-500 mt-1">Enter the brand name </p>
              </div>

              <div>
                <Label htmlFor="model" className="text-slate-400">Model</Label>
                <Input
                  id="model"
                  name="model"
                  required
                  value={currentCar?.model || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-slate-400">Type</Label>
                <Select
                  name="type"
                  value={currentCar?.type || "Sedan"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "type", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="steering" className="text-slate-400">Steering</Label>
                <Select
                  name="steering"
                  value={currentCar?.steering || "Left"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "steering", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select steering" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transmission" className="text-slate-400">Transmission</Label>
                <Select
                  name="transmission"
                  value={currentCar?.transmission || "Automatic"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "transmission", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="DCT">DCT</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fuel" className="text-slate-400">Fuel Type</Label>
                <Select
                  name="fuel"
                  value={currentCar?.fuel || "Gasoline"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "fuel", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color" className="text-slate-400">Color</Label>
                <Input
                  id="color"
                  name="color"
                  required
                  value={currentCar?.color || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="year" className="text-slate-400">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={currentCar?.year || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-slate-400">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  placeholder="Enter price"
                  value={currentCar?.price || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="mileage" className="text-slate-400">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  required
                  min="0"
                  placeholder="Enter mileage"
                  value={currentCar?.mileage || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="driveTrain" className="text-slate-400">Drive Train</Label>
                <Select
                  name="driveTrain"
                  value={currentCar?.driveTrain || "FWD"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "driveTrain", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select drive train" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FWD">FWD</SelectItem>
                    <SelectItem value="RWD">RWD</SelectItem>
                    <SelectItem value="AWD">AWD</SelectItem>
                    <SelectItem value="4WD">4WD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="engineTransmission" className="text-slate-400">Engine Transmission</Label>
                <Select
                  name="engineTransmission"
                  value={currentCar?.engineTransmission || "Automatic"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "engineTransmission", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select engine transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="DCT">DCT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="engineHorsepower" className="text-slate-400">Engine Horsepower</Label>
                <Input
                  id="engineHorsepower"
                  name="engineHorsepower"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.engineHorsepower || "0"}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="engineCylinders" className="text-slate-400">Engine Cylinders</Label>
                <Input
                  id="engineCylinders"
                  name="engineCylinders"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.engineCylinders || "4"}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="engineSize" className="text-slate-400">Engine Size (L)</Label>
                <Input
                  id="engineSize"
                  name="engineSize"
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={currentCar?.engineSize || "2.0"}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-slate-400">Status</Label>
                <Select
                  name="status"
                  value={currentCar?.status || "available"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "status", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description" className="text-slate-400">Description</Label>
                <Input
                  id="description"
                  name="description"
                  required
                  placeholder="Enter car description"
                  value={currentCar?.description || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="location" className="text-slate-400">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Enter car location"
                  value={currentCar?.location || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEditModalOpen(false)}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6"
              >
                {isEditing ? "Save Changes" : "Add Car"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Car</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete {currentCar?.model} ({currentCar?.year})? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarListing;


