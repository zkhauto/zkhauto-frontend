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
    type: "",
    status: "",
    make: "",
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
    if (filters.type) {
      filtered = filtered.filter(car => car.type === filters.type);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(car => car.status === filters.status);
    }

    // Apply make/brand filter
    if (filters.make) {
      filtered = filtered.filter(car => car.brand === filters.make);
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
      type: "",
      status: "",
      make: "",
    });
  };

  // Get unique values for filters
  const uniqueTypes = [...new Set(cars.filter(car => car?.type).map(car => car.type))];
  const uniqueStatuses = [...new Set(cars.filter(car => car?.status).map(car => car.status))];
  const uniqueMakes = [...new Set(cars.filter(car => car?.brand).map(car => car.brand))];

  const openAddModal = () => {
    setCurrentCar(null);
    setIsEditing(false);
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
      if (isEditing && currentCar) {
        // Update existing car
        const response = await fetch(`http://localhost:5000/api/car/${currentCar._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentCar),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update car');
        }
      } else if (currentCar) {
        // Add new car
        const response = await fetch('http://localhost:5000/api/cars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentCar),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add car');
        }
      }

      await fetchCars(); // Refresh the list after successful add/edit
      setIsAddEditModalOpen(false);
    } catch (err) {
      console.error('Error saving car:', err);
      setError(err.message || 'Failed to save car. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!currentCar) {
      // If adding a new car, initialize with default values
      setCurrentCar({
        brand: "",
        model: "",
        type: "Sedan",
        steering: "Left",
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        image: "/placeholder.svg?height=200&width=300",
        location: "",
        status: "Active",
        [name]: value,
      });
    } else {
      // Update existing car
      setCurrentCar({
        ...currentCar,
        [name]:
          name === "price" || name === "mileage" || name === "year"
            ? Number(value)
            : value,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
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
                      <SelectItem value="">All Types</SelectItem>
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
                      <SelectItem value="">All Statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={filters.make} 
                    onValueChange={(value) => handleFilterChange("make", value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Brands</SelectItem>
                      {uniqueMakes.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
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
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Car
                </Button>
              </div>

              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-slate-400">
                  {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
                </div>
                <Button
                  onClick={openAddModal}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Car
                </Button>
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
                                  className="h-10 w-16 rounded object-cover"
                                  src={car.image || "/placeholder.svg"}
                                  alt={`${car.brand} ${car.model}`}
                                  width={64}
                                  height={40}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-white text-lg">
                                  {car.brand} {car.model}
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
                                car.status === "Active"
                                  ? "default"
                                  : car.status === "Pending"
                                  ? "secondary"
                                  : "outline"
                              }
                              className={
                                car.status === "Active"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : car.status === "Pending"
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
          </DialogHeader>
          <form onSubmit={handleAddEdit}>
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
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  required
                  value={currentCar?.brand || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  required
                  value={currentCar?.model || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  value={currentCar?.type || "Sedan"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "type", value } })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="steering">Steering</Label>
                <Select
                  name="steering"
                  value={currentCar?.steering || "Left"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "steering", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select steering" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  name="transmission"
                  value={currentCar?.transmission || ""}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "transmission", value } })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="fuel">Fuel Type</Label>
                <Select
                  name="fuel"
                  value={currentCar?.fuel || ""}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "fuel", value } })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={currentCar?.color || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={currentCar?.year || new Date().getFullYear()}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.price || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.mileage || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={currentCar?.status || "Active"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "status", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  value={currentCar?.location || ""}
                  onChange={handleInputChange}
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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
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
              Are you sure you want to delete {currentCar?.brand}{" "}
              {currentCar?.model} ({currentCar?.year})? This action cannot be
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


