"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../ui/Navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarDetailsPage() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/cars/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="container px-4 py-6 md:px-6 md:py-8">
        <Button variant="outline" className="mb-4" asChild>
          <Link href="/carlisting">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {car?.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image || "/img/car-placeholder.jpg"}
                        alt={`${car?.brand || "Car"} ${
                          car?.model || ""
                        } - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized={!image}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-slate-900/50 hover:bg-slate-900/75 border-slate-800" />
              <CarouselNext className="right-4 bg-slate-900/50 hover:bg-slate-900/75 border-slate-800" />
            </Carousel>

            {/* Thumbnails */}
            {Array.isArray(car?.images) && car.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-lg overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={image || "/img/car-placeholder.jpg"}
                      alt={`${car?.brand || "Car"} ${
                        car?.model || ""
                      } - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity"
                      unoptimized={!image}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {car.brand} {car.model}
              </h1>
              <p className="text-2xl font-semibold text-white mt-2">
                ${car.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-slate-800">
                  {car.condition}
                </Badge>
                <Badge variant="secondary" className="bg-slate-800">
                  {car.status}
                </Badge>
                <Badge variant="secondary" className="bg-slate-800">
                  {car.type}
                </Badge>
              </div>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.mileage} mi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">{car.driveTrain}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Description
                </h2>
                <p className="text-slate-400">{car.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Engine Size:</span>
                    <span className="text-white ml-2">{car.engineSize}L</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Cylinders:</span>
                    <span className="text-white ml-2">
                      {car.engineCylinders}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Horsepower:</span>
                    <span className="text-white ml-2">
                      {car.engineHorsepower} hp
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Drive Train:</span>
                    <span className="text-white ml-2">{car.driveTrain}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Color:</span>
                    <span className="text-white ml-2">{car.color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Features
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {car.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Contact Seller
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">Phone Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-400">Email</span>
                  </div>
                  <Button className="w-full">Contact Seller</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
