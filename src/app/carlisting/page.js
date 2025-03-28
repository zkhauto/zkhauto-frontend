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
} from "lucide-react";
import Navbar from "../ui/Navbar";
import Link from "next/link";

export default function CarListingPage() {
  const [mounted, setMounted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);

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
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Make</SelectItem>
                        <SelectItem value="audi">Audi</SelectItem>
                        <SelectItem value="bmw">BMW</SelectItem>
                        <SelectItem value="mercedes">Mercedes</SelectItem>
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
                          defaultValue={[0, 75000]}
                          max={100000}
                          step={1000}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>$0</span>
                        <span>$100,000+</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Year</Label>
                      <div className="pt-2">
                        <Slider
                          defaultValue={[2015, 2024]}
                          min={2000}
                          max={2024}
                          step={1}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>2000</span>
                        <span>2024</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Mileage</Label>
                      <div className="pt-2">
                        <Slider
                          defaultValue={[0, 75000]}
                          max={200000}
                          step={5000}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>0 mi</span>
                        <span>200,000+ mi</span>
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
              {cars.map((car) => (
                <Card
                  key={car.id}
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
                    <Button variant="outline" className="w-full">
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
    </div>
  );
}
