"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Sidebar from "../../../../ui/Sidebar";
import Image from "next/image";
import { use } from "react";

const EditCarPage = ({ params }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Car type options
  const carTypes = [
    "SUV",
    "Sedan",
    "Truck",
    "Van",
    "Coupe",
    "Wagon",
    "Convertible",
    "Hatchback",
  ];

  // Fuel type options
  const fuelTypes = [
    "Gasoline",
    "Diesel",
    "Electric",
    "Hybrid",
    "Plug-in Hybrid",
    "Hydrogen",
  ];

  // Transmission options
  const transmissionTypes = [
    "Manual",
    "Automatic",
    "CVT",
    "DCT",
    "Semi-Automatic",
  ];

  // Drive train options
  const driveTrainTypes = ["FWD", "RWD", "AWD", "4WD"];

  // Condition options
  const conditionTypes = ["New", "Used", "Refurbished", "Remade"];

  // Status options
  const statusTypes = ["available", "sold", "reserved", "maintenance"];

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch car: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Fetched car:", data);
        
        setCar(data);
        
        // Set image preview if car has images
        if (data.images && data.images.length > 0) {
          setImagePreview(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // First, upload the image if a new one was selected
      let imageUrl = car.images && car.images.length > 0 ? car.images[0] : null;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
      
      // Prepare car data for update
      const carData = {
        ...car,
        images: imageUrl ? [imageUrl] : [],
      };
      
      // Update car in the database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carData),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to update car: ${response.status} ${response.statusText}`);
      }
      
      // Redirect back to car listing page
      router.push("/dashboard/carlisting");
    } catch (error) {
      console.error("Error updating car:", error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Loading car data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Car not found</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/carlisting")}
              className="mr-4 text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Car</h1>
              <p className="text-slate-400 mt-2">
                Update car information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6 bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-slate-300">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={car.brand}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-slate-300">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={car.model}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-slate-300">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={car.year}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-300">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={car.price}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Select
                    value={car.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {carTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-slate-300">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={car.color}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>
              
              {/* Engine Information */}
              <div className="space-y-6 bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold text-white">Engine Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="fuel" className="text-slate-300">Fuel Type</Label>
                  <Select
                    value={car.fuel}
                    onValueChange={(value) => handleSelectChange("fuel", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {fuelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="engineSize" className="text-slate-300">Engine Size</Label>
                  <Input
                    id="engineSize"
                    name="engineSize"
                    value={car.engineSize}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="engineCylinders" className="text-slate-300">Engine Cylinders</Label>
                  <Input
                    id="engineCylinders"
                    name="engineCylinders"
                    type="number"
                    value={car.engineCylinders}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="engineHorsepower" className="text-slate-300">Horsepower</Label>
                  <Input
                    id="engineHorsepower"
                    name="engineHorsepower"
                    type="number"
                    value={car.engineHorsepower}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="engineTransmission" className="text-slate-300">Transmission</Label>
                  <Select
                    value={car.engineTransmission}
                    onValueChange={(value) => handleSelectChange("engineTransmission", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {transmissionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driveTrain" className="text-slate-300">Drive Train</Label>
                  <Select
                    value={car.driveTrain}
                    onValueChange={(value) => handleSelectChange("driveTrain", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select drive train" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {driveTrainTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="space-y-6 bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold text-white">Additional Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-slate-300">Mileage</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    value={car.mileage}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-slate-300">Condition</Label>
                  <Select
                    value={car.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {conditionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select
                    value={car.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {statusTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-slate-300">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    value={car.rating}
                    onChange={handleNumberChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              
              {/* Description and Image */}
              <div className="space-y-6 bg-slate-900 p-6 rounded-lg border border-slate-800">
                <h2 className="text-xl font-semibold text-white">Description and Image</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={car.description}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-300">Car Image</Label>
                  <div className="flex flex-col space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Car preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-slate-800 border-slate-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500"
                disabled={isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCarPage; 