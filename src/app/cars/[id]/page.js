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
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        console.log('Fetching car with ID:', id);
        
        const response = await fetch(`${backendUrl}/api/cars/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(errorData?.message || 'Failed to fetch car details');
        }

        const data = await response.json();
        if (!data) {
          throw new Error('No car data received');
        }
        
        // Add detailed logging of car data
        console.log('Fetched car data:', {
          id: data._id,
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          images: data.images,
          specifications: {
            type: data.type,
            transmission: data.transmission,
            fuel: data.fuel,
            color: data.color,
            steering: data.steering,
            mileage: data.mileage,
            status: data.status,
            location: data.location
          },
          engine: {
            driveTrain: data.driveTrain,
            transmission: data.engineTransmission,
            horsepower: data.engineHorsepower,
            cylinders: data.engineCylinders,
            size: data.engineSize
          }
        });

        // Validate images array
        if (!data.images) {
          console.log('No images array found in car data');
          data.images = [];
        } else if (!Array.isArray(data.images)) {
          console.log('Images is not an array, converting to array:', data.images);
          data.images = [data.images].filter(Boolean);
        }

        // Log image validation results
        data.images.forEach((img, index) => {
          console.log(`Image ${index + 1}:`, {
            exists: img?.exists,
            url: img?.url,
            isValid: !!(img?.exists && img?.url)
          });
        });

        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError(error.message);
        toast.error('Failed to fetch car details. Please try again later.');
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

  // Enhanced image source getter with better validation
  const getImageSrc = (car) => {
    if (!car.images || !Array.isArray(car.images) || car.images.length === 0) {
      console.log('No images array found for car:', car.brand, car.model);
      return null;
    }

    // Find the first valid image
    const validImage = car.images.find(img => img && img.exists && img.url);
    if (!validImage) {
      console.log('No valid image found for car:', car.brand, car.model);
      return null;
    }

    const imageUrl = validImage.url;

    // Return null for any invalid or missing image URL
    if (!imageUrl || 
        imageUrl.trim() === "" || 
        imageUrl === "/placeholder.svg" || 
        imageUrl.includes('undefined') ||
        imageUrl === "null") {
      console.log('Invalid image URL for car:', car.brand, car.model);
      return null;
    }

    // Handle Google Cloud Storage URLs
    if (imageUrl.startsWith('https://storage.googleapis.com/')) {
      console.log('Using Google Cloud Storage URL:', imageUrl);
      return imageUrl;
    }

    // Handle relative and absolute URLs
    if (imageUrl.startsWith('/')) {
      console.log('Using relative URL:', imageUrl);
      return imageUrl;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
      console.log('Using absolute URL:', imageUrl);
      return imageUrl;
    } catch {
      console.log('Invalid URL format:', imageUrl);
      return null;
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
            {car.images?.length > 0 ? (
              car.images[0]?.exists && car.images[0]?.url ? (
                <Image
                  src={car.images[0].url}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain object-center w-full h-full"
                  priority={true}
                  quality={90}
                  onError={(e) => {
                    console.error('Image load error for:', {
                      brand: car.brand,
                      model: car.model,
                      imageData: car.images[0],
                      error: e.target.error
                    });
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      const div = document.createElement('div');
                      div.className = 'flex items-center justify-center h-full text-gray-500';
                      div.innerHTML = `
                        <div class="text-center">
                          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p>Failed to load image</p>
                          <p class="text-sm mt-1">${car.images[0].url}</p>
                        </div>
                      `;
                      parent.appendChild(div);
                    }
                  }}
                  unoptimized={true}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Image marked as not available</p>
                    {car.images[0]?.url && (
                      <p className="text-sm mt-1">URL: {car.images[0].url}</p>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No images available for this vehicle</p>
                </div>
              </div>
            )}
          </div>

          {/* Car Information */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {car.brand.charAt(0).toUpperCase() + car.brand.slice(1)} {car.model}
                </h1>
                <p className="text-2xl text-blue-400 font-bold">
                  ${(car.price || 0).toLocaleString()}
                </p>
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
                <p className="text-xl">{car.year || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Mileage</h3>
                <p className="text-xl">{(car.mileage || 0).toLocaleString()} miles</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Type</h3>
                <p className="text-xl">{car.type || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Status</h3>
                <p className="text-xl capitalize">{car.status || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Transmission</h3>
                <p className="text-xl">{car.transmission || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Fuel Type</h3>
                <p className="text-xl">{car.fuel || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Color</h3>
                <p className="text-xl">{car.color || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Steering</h3>
                <p className="text-xl">{car.steering || 'N/A'} Hand Drive</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400 mb-1">Location</h3>
                <p className="text-xl">{car.location || 'N/A'}</p>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            {/* Additional Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {car.driveTrain && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    Drive Train: {car.driveTrain}
                  </div>
                )}
                {car.engineTransmission && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    Engine Transmission: {car.engineTransmission}
                  </div>
                )}
                {car.engineHorsepower && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    Horsepower: {car.engineHorsepower}
                  </div>
                )}
                {car.engineCylinders && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    Cylinders: {car.engineCylinders}
                  </div>
                )}
                {car.engineSize && (
                  <div className="flex items-center text-gray-300">
                    <span className="mr-2">•</span>
                    Engine Size: {car.engineSize}L
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 