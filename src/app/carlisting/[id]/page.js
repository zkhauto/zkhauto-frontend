"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Gauge,
  MapPin,
  Mail,
  Phone,
  Fuel,
  Car,
  Settings,
  Users,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../../ui/Navbar";
import Link from "next/link";

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

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
          carModel: car ? `${car.brand} ${car.model} (${car.year})` : '',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="container px-4 py-6 mx-auto md:px-6 md:py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-slate-400">Loading car details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="container px-4 py-6 mx-auto md:px-6 md:py-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-xl text-red-400">
              {error || "Car not found"}
            </p>
            <Link href="/carlisting">
              <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                Back to Listings
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="container px-4 py-6 mx-auto md:px-6 md:py-8">
        <div className="flex flex-col gap-8">
          {/* Back Button */}
          <Link href="/carlisting">
            <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
              Back to Listings
            </Button>
          </Link>

          {/* Car Images */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[4/3]">
              <Image
                alt={`${car.brand} ${car.model}`}
                className="object-cover rounded-lg"
                fill
                src={car.images?.[0] || "/placeholder-car.jpg"}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {car.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    alt={`${car.brand} ${car.model} - Image ${index + 2}`}
                    className="object-cover rounded-lg"
                    fill
                    src={image}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {car.brand} {car.model}
                  </h1>
                  <p className="mt-2 text-xl text-slate-400">
                    ${car.price.toLocaleString()}
                  </p>
                </div>

                {/* Quick Facts */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Year</p>
                          <p className="font-medium text-white">{car.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Mileage</p>
                          <p className="font-medium text-white">
                            {car.mileage.toLocaleString()} mi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Fuel</p>
                          <p className="font-medium text-white">{car.fuel}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Type</p>
                          <p className="font-medium text-white">{car.type}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Specifications */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Technical Specifications
                  </h2>
                  
                  {/* Engine & Performance */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Engine & Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Engine Size</p>
                        <p className="font-medium text-white">{car.engineSize}L</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Power</p>
                        <p className="font-medium text-white">{car.engineHorsepower} HP</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Transmission</p>
                        <p className="font-medium text-white">{car.engineTransmission}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Drive Train</p>
                        <p className="font-medium text-white">{car.driveTrain}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dimensions & Capacity */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Dimensions & Capacity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Body Type</p>
                        <p className="font-medium text-white">{car.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Doors</p>
                        <p className="font-medium text-white">{car.doors || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Seats</p>
                        <p className="font-medium text-white">{car.seats || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Color</p>
                        <p className="font-medium text-white">{car.color}</p>
                      </div>
                    </div>
                  </div>

                  {/* Efficiency */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Efficiency</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Fuel Type</p>
                        <p className="font-medium text-white">{car.fuel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Consumption</p>
                        <p className="font-medium text-white">{car.fuelConsumption || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">CO2 Emissions</p>
                        <p className="font-medium text-white">{car.co2Emissions || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Identification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">VIN</p>
                        <p className="font-medium text-white">{car.vin || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Condition</p>
                        <p className="font-medium text-white">{car.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">Description</h2>
                  <p className="text-slate-400">{car.description || "No description available."}</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="space-y-6">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Contact Seller</h3>
                      <p className="text-sm text-slate-400">
                        Interested in this {car.brand} {car.model}? Contact the seller for more information.
                      </p>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setContactDialogOpen(true)}
                    >
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Listed</p>
                          <p className="font-medium text-white">
                            {new Date(car.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Location</p>
                          <p className="font-medium text-white">{car.location || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Warranty</p>
                          <p className="font-medium text-white">{car.warranty || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Service History</p>
                          <p className="font-medium text-white">{car.serviceHistory || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription className="text-slate-400">
              {`Inquire about ${car.brand} ${car.model} (${car.year})`}
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
    </div>
  );
} 