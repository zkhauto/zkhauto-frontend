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
import { Slider } from "@/components/ui/slider";
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
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
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

  // Add new state for selected cars
  const [selectedCars, setSelectedCars] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isMultiDeleteModalOpen, setIsMultiDeleteModalOpen] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      console.log('Fetching cars from:', `${backendUrl}/api/cars`);
      
      const response = await fetch(`${backendUrl}/api/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || 'Failed to fetch cars');
      }

      const data = await response.json();
      console.log('Fetched cars:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from server');
      }

      // Sort cars by year in descending order
      const sortedCars = data.sort((a, b) => b.year - a.year);
      console.log('Sorted cars:', sortedCars);
      
      setCars(sortedCars);
      setFilteredCars(sortedCars);
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err.message);
      toast.error('Failed to fetch cars. Please try again later.');
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/cars/${currentCar._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const url = isEditing 
        ? `${backendUrl}/api/cars/${currentCar._id}`
        : `${backendUrl}/api/cars`;
      
      // Ensure rating is included and is a valid number
      const carData = {
        ...currentCar,
        rating: Number(currentCar.rating) || 0 // Default to 0 if not set or invalid
      };

      console.log('Submitting car data:', {
        url,
        method: isEditing ? 'PUT' : 'POST',
        carId: currentCar._id,
        data: carData
      });
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(carData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} car`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          // Try to get the raw text if JSON parsing fails
          const rawText = await response.text().catch(() => null);
          console.error('Raw error response:', rawText);
          throw new Error(`${errorMessage} - Server returned ${response.status} ${response.statusText}`);
        }
        throw new Error(errorMessage);
      }

      const savedCar = await response.json();
      console.log('Car saved successfully:', savedCar);
      
      // Close the modal first
    setIsAddEditModalOpen(false);

      // Reset the current car state
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
        rating: 0 // Add default rating here too
      });
      
      // Reset editing state
      setIsEditing(false);
      
      // Show success message
      toast.success(isEditing ? 'Car updated successfully' : 'Car added successfully');
      
      // Fetch updated car list
      await fetchCars();
      
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'add'} car`);
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
  const getImageSrc = (car, carInfo = '') => {
    // Check if car has images array with valid entries
    if (!car.images || !Array.isArray(car.images) || car.images.length === 0) {
      console.log(`No images array for ${carInfo}`);
      return null;
    }

    // Find the first valid image
    const validImage = car.images.find(img => img && img.exists && img.url);
    if (!validImage) {
      console.log(`No valid image found for ${carInfo}`);
      return null;
    }

    const imageUrl = validImage.url;

    // Return null for any invalid or missing image URL
    if (!imageUrl || 
        imageUrl.trim() === "" || 
        imageUrl === "/placeholder.svg" || 
        imageUrl.includes('undefined') ||
        imageUrl === "null") {
      console.log(`Invalid image URL for ${carInfo}`);
      return null;
    }

    // Handle Google Cloud Storage URLs
    if (imageUrl.startsWith('https://storage.googleapis.com/')) {
      return imageUrl;
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
      console.log(`Invalid URL format for ${carInfo}: ${imageUrl}`);
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Log the raw response for debugging
      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      // Try to parse the response as JSON
      let data;
      try {
        const text = await response.text();
        console.log('Raw response text:', text);
        
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid server response format');
        }
      } catch (error) {
        console.error('Error reading response:', error);
        throw new Error('Failed to read server response');
      }

      if (!response.ok) {
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        // Construct a more descriptive error message
        let errorMessage = 'Failed to upload image';
        if (data && typeof data === 'object') {
          if (data.error) {
            errorMessage = data.error;
            if (data.details) {
              errorMessage += `: ${data.details}`;
            }
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        
        // Log the error details for debugging
        console.error('Upload error details:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          errorMessage: errorMessage
        });
        
        throw new Error(errorMessage);
      }

      if (!data || !data.success || !data.url) {
        console.error('Invalid response data:', data);
        throw new Error(data?.error || 'No image URL received from server');
      }

      console.log('Upload successful:', data.url);
      setCurrentCar(prev => ({
        ...prev,
        image: data.url
      }));
      
      // Refresh the car list to show the updated image
      await fetchCars();
      
      toast.success(data.message || 'Image uploaded successfully');
    } catch (error) {
      // Log the error for debugging
      console.error('Upload error:', {
        message: error.message,
        stack: error.stack,
        error: error
      });
      
      // Show a user-friendly error message
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
    setFilters(prev => ({
      ...prev,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString()
    }));
  };

  const handleYearRangeChange = (values) => {
    setYearRange(values);
    setFilters(prev => ({
      ...prev,
      minYear: values[0].toString(),
      maxYear: values[1].toString()
    }));
  };

  // Add handler for selecting/deselecting all cars
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedCars(currentCars.map(car => car._id));
    } else {
      setSelectedCars([]);
    }
  };

  // Add handler for selecting individual cars
  const handleSelectCar = (carId) => {
    setSelectedCars(prev => {
      if (prev.includes(carId)) {
        const newSelected = prev.filter(id => id !== carId);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, carId];
        if (newSelected.length === currentCars.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  // Add handler for deleting multiple cars
  const handleMultiDelete = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      console.log('Sending delete request to:', `${backendUrl}/api/cars/bulk-delete`);
      
      const response = await fetch(`${backendUrl}/api/cars/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ carIds: selectedCars }),
      });

      console.log('Bulk delete response status:', response.status);
      console.log('Selected car IDs:', selectedCars);

      if (!response.ok) {
        let errorMessage = 'Failed to delete cars';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          // Try to get the raw text if JSON parsing fails
          const rawText = await response.text().catch(() => null);
          console.error('Raw error response:', rawText);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Bulk delete successful:', data);

      await fetchCars(); // Refresh the list
      setSelectedCars([]);
      setSelectAll(false);
      setIsMultiDeleteModalOpen(false);
      toast.success(data.message || 'Selected cars deleted successfully');
    } catch (err) {
      console.error('Error deleting cars:', err);
      toast.error(err.message || 'Failed to delete cars');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header with Add New Car and Delete Selected buttons */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Car Inventory</h1>
            <div className="flex gap-4">
              {selectedCars.length > 0 && (
                <Button 
                  onClick={() => setIsMultiDeleteModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selectedCars.length})
                </Button>
              )}
              <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add New Car
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            {/* Search Bar */}
            <div className="relative w-full max-w-xl mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={handleSearch}
                className="pl-10 bg-slate-900 border-slate-800 text-white w-full placeholder:text-white/70"
              />
            </div>

            {/* Filters Section */}
            <div className="grid gap-6">
              {/* Price Range Slider */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <Label className="text-white mb-2 block">Price Range</Label>
                <div className="px-3">
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={1000000}
                    step={1000}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="my-4"
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Year Range Slider */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <Label className="text-white mb-2 block">Year Range</Label>
                <div className="px-3">
                  <Slider
                    defaultValue={[1990, new Date().getFullYear()]}
                    min={1990}
                    max={new Date().getFullYear()}
                    step={1}
                    value={yearRange}
                    onValueChange={handleYearRangeChange}
                    className="my-4"
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>

              {/* Type and Status Filters */}
              <div className="flex flex-wrap gap-4">
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-40 bg-slate-900 border-slate-800 text-white">
                    <SelectValue placeholder="Type" className="text-white/70" />
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
                  <SelectTrigger className="w-40 bg-slate-900 border-slate-800 text-white">
                    <SelectValue placeholder="Status" className="text-white/70" />
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
                  onClick={clearFilters}
                  className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            >
                  Clear Filters
            </Button>
              </div>
            </div>
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
              {/* Results Count */}
              <div className="text-sm text-slate-400 mb-6">
                {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
              </div>

              <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400 w-12">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-800 text-blue-600"
                    />
                  </TableHead>
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
                          <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                            No cars found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentCars.map((car) => (
                          <TableRow key={car._id} className="border-slate-800">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(car._id)}
                        onChange={() => handleSelectCar(car._id)}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-16 flex-shrink-0 mr-4 bg-slate-800 rounded overflow-hidden">
                          <ImageWithFallback
                            src={getImageSrc(car, `${car.brand} ${car.model}`)}
                            alt={`${car.brand} ${car.model}`}
                            width={64}
                            height={40}
                            className="w-full h-full object-cover"
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
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredCars.length > 0 && (
                  <div className="p-4 border-t border-gray-800">
                    <div className="flex justify-between items-center">
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
                            .filter(num => num === 1 || num === totalPages || num === currentPage || num === currentPage - 1 || num === currentPage + 1)
                            .map((number) => {
                              if (number > 1 && number < totalPages && ![currentPage - 1, currentPage, currentPage + 1].includes(number)) {
                                return <span key={`ellipsis-${number}`} className="text-gray-400">...</span>;
                              }
                              return (
                <Button
                                  key={number}
                                  onClick={() => paginate(number)}
                                  className={`px-4 py-2 ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Image URL input */}
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-white">
                  Car Image
                </Label>
                <div className="flex gap-4 items-start">
                  {/* Image Preview */}
                  <div className="w-48 h-32 border-2 border-dashed border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
                    {currentCar.image ? (
                      <ImageWithFallback
                        src={currentCar.image}
                        alt="Car preview"
                        width={192}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="flex-1">
                    <div className="relative">
                <Input
                  id="image"
                  name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <Label
                        htmlFor="image"
                        className={`flex items-center justify-center w-full h-10 px-4 rounded-lg cursor-pointer transition-colors ${
                          uploadingImage
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Choose Image
                          </>
                        )}
                      </Label>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Supported formats: JPG, PNG, GIF, WebP (max 5MB)
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
                type="button"
                variant="outline"
                onClick={() => setIsAddEditModalOpen(false)}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
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

      {/* Add new modal for multiple delete confirmation */}
      <Dialog open={isMultiDeleteModalOpen} onOpenChange={setIsMultiDeleteModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Multiple Cars</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete {selectedCars.length} selected cars? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMultiDeleteModalOpen(false)}
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleMultiDelete}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarListing;


