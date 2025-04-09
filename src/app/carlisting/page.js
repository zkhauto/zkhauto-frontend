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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CarListingPage() {
  const [mounted, setMounted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedMake, setSelectedMake] = useState("any");
  const [availableMakes, setAvailableMakes] = useState([]);
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [yearRange, setYearRange] = useState([2000, 2030]);
  const [mileageRange, setMileageRange] = useState([0, 500000]);
  
  // Contact seller dialog state
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

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
      
      // Extract unique car makes for the filter dropdown
      const makes = [...new Set(data.map(car => car.brand?.toLowerCase() || ''))].filter(Boolean);
      setAvailableMakes(makes);
      
      return data;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  };

  // Combine both effects into one
  useEffect(() => {
    const loadCars = async () => {
      try {
        const cars = await fetchCars();
        setCars(cars);
        setFilteredCars(cars);
        console.log("Fetched cars:", cars);
      } catch (error) {
        console.error("Failed to load cars:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    setMounted(true);
    loadCars();
  }, []);

  // Filter cars based on search term, selected make, and advanced filters
  useEffect(() => {
    let filtered = [...cars];
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((car) => {
        return (
          (car.brand?.toLowerCase() || '').includes(term) ||
          (car.model?.toLowerCase() || '').includes(term) ||
          (car.year?.toString() || '').includes(term) ||
          (car.price?.toString() || '').includes(term) ||
          (car.status?.toLowerCase() || '').includes(term)
        );
      });
    }
    
    // Apply make filter
    if (selectedMake !== "any") {
      filtered = filtered.filter((car) => 
        (car.brand?.toLowerCase() || '') === selectedMake.toLowerCase()
      );
    }
    
    // Apply advanced filters if they're visible
    if (showAdvanced) {
      // Price range filter
      filtered = filtered.filter((car) => {
        const price = Number(car.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
      
      // Year range filter
      filtered = filtered.filter((car) => {
        const year = Number(car.year) || 0;
        return year >= yearRange[0] && year <= yearRange[1];
      });
      
      // Mileage range filter
      filtered = filtered.filter((car) => {
        const mileage = Number(car.mileage) || 0;
        return mileage >= mileageRange[0] && mileage <= mileageRange[1];
      });
    }

    console.log(`Filtered ${filtered.length} cars for search term: ${searchTerm}, make: ${selectedMake}`);
    setFilteredCars(filtered);
  }, [searchTerm, cars, selectedMake, showAdvanced, priceRange, yearRange, mileageRange]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle make selection change
  const handleMakeChange = (value) => {
    setSelectedMake(value);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };
  
  // Handle year range change
  const handleYearRangeChange = (value) => {
    setYearRange(value);
  };
  
  // Handle mileage range change
  const handleMileageRangeChange = (value) => {
    // Ensure the value is within bounds and properly formatted
    const minValue = Math.max(0, value[0]);
    const maxValue = Math.min(500000, value[1]);
    
    // Only update if values are valid
    if (!isNaN(minValue) && !isNaN(maxValue) && minValue <= maxValue) {
      setMileageRange([minValue, maxValue]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMake("any");
    setPriceRange([0, 1000000]);
    setYearRange([2000, 2030]);
    setMileageRange([0, 500000]);
  };

  // Handle contact seller button click
  const handleContactSeller = (car) => {
    setSelectedCar(car);
    setContactDialogOpen(true);
  };
  
  // Handle contact form input change
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the message data
      const messageData = {
        fullName: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || "",
        carModel: selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "",
        topic: "Car Inquiry",
        message: contactForm.message
      };
      
      // Send the message to the backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      // Show success message
      alert("Your message has been sent to the seller. They will contact you soon!");
      
      // Reset form and close dialog
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setContactDialogOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Navbar />
      <main className="container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Find your perfect car
            </h1>
            <p className="text-slate-400 mt-2">
              Browse our collection of luxury vehicles
            </p>
          </div>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search" className="sr-only">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by make, model, or keyword"
                        className="pl-8 text-white placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Select value={selectedMake} onValueChange={handleMakeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Make</SelectItem>
                        {availableMakes.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make.charAt(0).toUpperCase() + make.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>
                  <div>
                    <Button className="w-full">Search</Button>
            </div>
            </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal flex items-center gap-1 text-slate-400"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {showAdvanced ? "Hide" : "Show"} Advanced Filters
                  </Button>
                  {showAdvanced && (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal text-slate-400"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
            )}
          </div>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-400">Price Range</Label>
                      <div className="pt-2">
                        <Slider
                          value={priceRange}
                          onValueChange={handlePriceRangeChange}
                          max={1000000}
                          step={10000}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
          </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Year</Label>
                      <div className="pt-2">
                        <Slider
                          value={yearRange}
                          onValueChange={handleYearRangeChange}
                          min={2000}
                          max={2030}
                          step={1}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                  </div>
                </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Mileage</Label>
                      <div className="pt-2">
                        <Slider
                          value={mileageRange}
                          onValueChange={handleMileageRangeChange}
                          max={500000}
                          step={10000}
                          min={0}
                          minStepsBetweenThumbs={1}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{mileageRange[0].toLocaleString()} mi</span>
                        <span>{mileageRange[1].toLocaleString()}+ mi</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Available Cars
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Sort by:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="mileage">
                      Mileage: Low to High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card
                  key={car._id}
                  className="overflow-hidden bg-slate-900/50 border-slate-800"
                >
                  <div className="relative">
                    <Image
                      src={
                        car.images && car.images.length > 0
                          ? car.images[0]
                          : "/placeholder.jpg"
                      }
                      alt="Car"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Add to favorites</span>
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate text-white">
                          {car.brand} {car.model}
                        </h3>
                        <span className="font-bold text-lg text-white">
                          ${car.price}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="flex flex-col items-center p-2 bg-slate-800 rounded-md">
                          <Gauge className="h-4 w-4 mb-1 text-slate-400" />
                          <span className="te xt-xs text-slate-400">
                            {car.mileage} mi
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-slate-800 rounded-md">
                          <Calendar className="h-4 w-4 mb-1 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {car.year}
                          </span>
                    </div>
                        <div className="flex flex-col items-center p-2 bg-slate-800 rounded-md">
                          <Fuel className="h-4 w-4 mb-1 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {car.fuel}
                          </span>
                  </div>
                </div>
              </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button className="w-full" asChild>
                      <Link href={`/cars/${car._id}`}>View Details</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleContactSeller(car)}
                    >
                      Contact Seller
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Load More
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Contact Seller Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send a message to the seller of this {selectedCar?.brand} {selectedCar?.model}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleContactFormChange}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactFormChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-300">Message</Label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                className="w-full min-h-[100px] p-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                placeholder="I'm interested in this car. Is it still available?"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
  );
}
