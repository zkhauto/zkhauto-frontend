"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/car/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch car details (Status: ${response.status})`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No car data received');
        }
        console.log('Fetched car data:', data);
        setCar(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      console.log('Fetching car with ID:', id);
      fetchCarDetails();
    }
  }, [id]);

  const handleContact = () => {
    setShowContact(!showContact);
    if (!showContact) {
      toast.success("Contact information shown below", {
        duration: 3000,
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
      Loading...
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-red-500 mb-4">Error: {error}</div>
      <Button 
        onClick={() => router.push('/carlisting')}
        className="bg-gray-800 hover:bg-gray-700 text-white"
      >
        ← Back to Listings
      </Button>
    </div>
  );
  
  if (!car) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-xl mb-4">Car not found</div>
      <Button 
        onClick={() => router.push('/carlisting')}
        className="bg-gray-800 hover:bg-gray-700 text-white"
      >
        ← Back to Listings
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Button 
            onClick={() => router.push('/carlisting')}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            ← Back to Listings
          </Button>
        </div>
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-800">
            <Image
              src={car.images?.[0]?.url || "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg"}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-contain"
              priority={true}
              quality={100}
              onError={(e) => {
                console.error('Image load error:', car.images?.[0]?.url);
                e.target.src = "https://storage.googleapis.com/zkhauto_bucket/car-images/rolls-royce/rolls-phantom-2.jpg";
              }}
              unoptimized={true}
            />
          </div>

          {/* Car Information */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{car.brand} {car.model}</h1>
                <p className="text-2xl text-blue-400 font-bold">${car.price.toLocaleString()}</p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleContact}
              >
                {showContact ? 'Hide Contact' : 'Contact Seller'}
              </Button>
            </div>

            {/* Contact Information */}
            {showContact && (
              <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <p className="flex items-center">
                    <span className="text-gray-400 w-24">Phone:</span>
                    <span>+1 (555) 123-4567</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-400 w-24">Email:</span>
                    <span>sales@zkhauto.com</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-400 w-24">Address:</span>
                    <span>123 Auto Drive, Car City, CC 12345</span>
                  </p>
                  <p className="mt-4 text-sm text-gray-400">
                    Business Hours: Monday - Saturday, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Year</h3>
                <p className="text-xl">{car.year}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Mileage</h3>
                <p className="text-xl">{car.mileage.toLocaleString()} miles</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Type</h3>
                <p className="text-xl">{car.type}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Condition</h3>
                <p className="text-xl">{car.condition}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Transmission</h3>
                <p className="text-xl">{car.transmission}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Fuel Type</h3>
                <p className="text-xl">{car.fuelType}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {car.features?.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 