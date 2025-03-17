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

const TEMPLATE_IMAGE = "/template-car.svg"; // Update template image path
const DEFAULT_IMAGE_ERROR_TEXT = "Car preview not available";

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
  const [currentCar, setCurrentCar] = useState({
    brand: "",
    model: "",
    type: "Sedan",
    steering: "Left",
    transmission: "Automatic",
    fuel: "Gasoline",
    color: "Black",
    year: new Date().getFullYear().toString(),
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
  const [isEditing, setIsEditing] = useState(false);

  // Add filtered cars state
  const [filteredCars, setFilteredCars] = useState([]);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 10; // Show 10 cars per page in admin view

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
  }, [filteredCars]);

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
    setCurrentCar({
      brand: "",
      model: "",
      type: "Sedan",
      steering: "Left",
      transmission: "Automatic",
      fuel: "Gasoline",
      color: "Black",
      year: new Date().getFullYear().toString(),
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

      // Ensure all numeric fields are properly converted and image is properly handled
      const carData = {
        ...currentCar,
        // Enhanced image URL handling
        image: currentCar.image?.trim() ? getImageSrc(currentCar.image?.trim()) : TEMPLATE_IMAGE,
        brand: currentCar.brand.trim(),
        price: Number(currentCar.price) || 0,
        year: Number(currentCar.year) || new Date().getFullYear(),
        mileage: Number(currentCar.mileage) || 0,
        engineCylinders: Number(currentCar.engineCylinders) || 0,
        engineHorsepower: Number(currentCar.engineHorsepower) || 0,
        engineSize: Number(currentCar.engineSize) || 0,
        rating: Number(currentCar.rating) || 0
      };

      console.log("Processed car data:", carData);

      const url = isEditing && currentCar._id
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
      // Reset the current car to initial state instead of null
      setCurrentCar({
        brand: "",
        model: "",
        type: "Sedan",
        steering: "Left",
        transmission: "Automatic",
        fuel: "Gasoline",
        color: "Black",
        year: new Date().getFullYear().toString(),
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

  // Enhanced image handling function with state management
  const ImageWithFallback = ({ src, alt, ...props }) => {
    // If no image source or it's the template, don't render the image component
    if (!src || src === TEMPLATE_IMAGE) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No Image
        </div>
      );
    }

    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    useEffect(() => {
      setImgSrc(src);
      setError(false);
    }, [src]);

    const handleError = () => {
      if (!error) {
        console.error('Image load error:', imgSrc);
        setError(true);
        setImgSrc(null);
      }
    };

    if (!imgSrc || error) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No Image
        </div>
      );
    }

    return (
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        unoptimized={!imgSrc.startsWith('/')}
      />
    );
  };

  // Enhanced image source getter with better validation
  const getImageSrc = (imageUrl, carInfo = '') => {
    // Return null for any invalid or missing image URL
    if (!imageUrl || 
        imageUrl.trim() === "" || 
        imageUrl === "/placeholder.svg" || 
        imageUrl.includes('undefined') ||
        imageUrl === "null") {
      console.log(`No image available for ${carInfo}`);
      return null;
    }

    // Handle relative and absolute URLs
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      console.log(`Invalid URL format for ${carInfo}`);
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Update the car state with the new image URL
      setCurrentCar(prev => ({
        ...prev,
        image: data.imageUrl
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
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

          <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-white">
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
                          {currentCars.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                                No cars found matching your filters
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentCars.map((car) => (
                              <TableRow key={car._id} className="border-slate-800">
                        <TableCell>
                          <div className="flex items-center">
                                <div className="h-10 w-16 flex-shrink-0 mr-4 bg-slate-800 rounded">
                                  <div className="h-10 w-16 flex items-center justify-center text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
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
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredCars.length > 0 && (
              <div className="p-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  {/* Results Counter */}
                  <div className="text-gray-400">
                    Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length} cars
                  </div>

                  <div className="flex items-center space-x-2">
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
                </div>
              </div>
            )}

            {/* No Results Message */}
            {filteredCars.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No cars found matching your criteria.
              </div>
            )}
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
            <div className="grid gap-4 py-4">
              {/* Image URL input */}
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-white">
                  Car Image
                </Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                <Input
                  id="image"
                  name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="bg-slate-800 border-slate-700 text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                      />
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      {uploadingImage ? "Uploading image..." : "Supported formats: JPG, PNG, GIF, WebP (max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Brand input */}
                <div className="grid gap-2">
                  <Label htmlFor="brand" className="text-white">
                    Brand
                  </Label>
                <Input
                    id="brand"
                    name="brand"
                    type="text"
                    placeholder="Enter brand"
                    value={currentCar.brand || ""}
                  onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

                {/* Model input */}
                <div className="grid gap-2">
                  <Label htmlFor="model" className="text-white">
                    Model
                  </Label>
                <Input
                  id="model"
                  name="model"
                    type="text"
                    placeholder="Enter model"
                    value={currentCar.model || ""}
                  onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type input */}
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-white">
                    Type
                  </Label>
                <Select
                    id="type"
                  name="type"
                    value={currentCar.type || "Sedan"}
                    onValueChange={(value) => handleInputChange({ target: { name: "type", value } })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Wagon">Wagon</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                {/* Year input */}
                <div className="grid gap-2">
                  <Label htmlFor="year" className="text-white">
                    Year
                  </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                    placeholder="Enter year"
                    value={currentCar.year || ""}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price input */}
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-white">
                    Price
                  </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                    placeholder="Enter price"
                    value={currentCar.price || ""}
                  onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                />
              </div>

                {/* Mileage input */}
                <div className="grid gap-2">
                  <Label htmlFor="mileage" className="text-white">
                    Mileage
                  </Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                    placeholder="Enter mileage"
                    value={currentCar.mileage || ""}
                  onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                />
                </div>
              </div>

              {/* Status input */}
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-white">
                  Status
                </Label>
                <Select
                  id="status"
                  name="status"
                  value={currentCar.status || "available"}
                  onValueChange={(value) => handleInputChange({ target: { name: "status", value } })}
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

              {/* Transmission input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="transmission" className="text-white">
                    Transmission
                  </Label>
                  <Select
                    id="transmission"
                    name="transmission"
                    value={currentCar.transmission || "Automatic"}
                    onValueChange={(value) => handleInputChange({ target: { name: "transmission", value } })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type input */}
                <div className="grid gap-2">
                  <Label htmlFor="fuel" className="text-white">
                    Fuel Type
                  </Label>
                  <Select
                    id="fuel"
                    name="fuel"
                    value={currentCar.fuel || "Petrol"}
                    onValueChange={(value) => handleInputChange({ target: { name: "fuel", value } })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color and Steering input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="color" className="text-white">
                    Color
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    type="text"
                    placeholder="Enter color"
                    value={currentCar.color || ""}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="steering" className="text-white">
                    Steering
                  </Label>
                  <Select
                    id="steering"
                    name="steering"
                    value={currentCar.steering || "Left"}
                    onValueChange={(value) => handleInputChange({ target: { name: "steering", value } })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select steering" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Left">Left Hand Drive</SelectItem>
                      <SelectItem value="Right">Right Hand Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description input */}
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter description"
                  value={currentCar.description || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              {/* Location input */}
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter location"
                  value={currentCar.location || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white"
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


