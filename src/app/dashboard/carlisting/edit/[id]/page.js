"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "../../../../ui/Sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon, X } from "lucide-react";
import Link from "next/link";

const EditCarPage = () => {
  const router = useRouter();
  const params = useParams();
  const carId = params.id;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImagesSelected, setNewImagesSelected] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    type: "",
    fuel: "",
    mileage: "",
    color: "",
    engineSize: "",
    engineCylinders: "",
    engineHorsepower: "",
    engineTransmission: "",
    driveTrain: "",
    description: "",
    rating: "",
    status: "available",
    condition: "",
    features: [],
  });

  // Fetch car data on component mount
  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId) {
        toast({
          title: "Error",
          description: "No car ID provided",
          variant: "destructive",
        });
        router.push("/dashboard/carlisting");
        return;
      }

      try {
        setIsFetching(true);
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/cars/${carId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch car: ${response.status}`);
        }

        const carData = await response.json();
        console.log("Fetched car data:", carData);

        // Save existing images
        setExistingImages(carData.images || []);

        // Convert to appropriate format for form
        setFormData({
          brand: carData.brand || "",
          model: carData.model || "",
          year: carData.year?.toString() || "",
          price: carData.price?.toString() || "",
          type: carData.type || "",
          fuel: carData.fuel || "",
          mileage: carData.mileage?.toString() || "",
          color: carData.color || "",
          engineSize: carData.engineSize || "",
          engineCylinders: carData.engineCylinders?.toString() || "",
          engineHorsepower: carData.engineHorsepower?.toString() || "",
          engineTransmission: carData.engineTransmission || "",
          driveTrain: carData.driveTrain || "",
          description: carData.description || "",
          rating: carData.rating?.toString() || "",
          status: carData.status || "available",
          condition: carData.condition || "",
          features: carData.features || [],
        });
      } catch (error) {
        console.error("Error fetching car:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch car data",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchCarData();
  }, [carId, router, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (featureId, checked) => {
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, featureId]
        : prev.features.filter((f) => f !== featureId),
    }));
  };

  const handleRemoveImage = (imageUrl) => {
    // If this is the last image and no new images are selected, prevent removal
    if (getRetainedImages().length === 1 && !newImagesSelected) {
      toast({
        title: "Cannot remove all images",
        description: "Please select new images before removing the last one",
        variant: "destructive",
      });
      return;
    }
    setImagesToRemove([...imagesToRemove, imageUrl]);
  };

  const handleImageInputChange = (e) => {
    // Track if new images have been selected
    setNewImagesSelected(e.target.files.length > 0);
  };

  const getRetainedImages = () => {
    return existingImages.filter((url) => !imagesToRemove.includes(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      // Handle features array specifically
      if (key === "features") {
        // Sending features as a JSON string
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append retained images list
    formDataToSend.append(
      "retainedImages",
      JSON.stringify(getRetainedImages())
    );

    // Append image files (up to 3) if new images are selected
    const imageFiles = e.target.images?.files
      ? Array.from(e.target.images.files).slice(0, 3)
      : [];
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        // Append each file with the same key 'images'
        formDataToSend.append("images", file, file.name);
      });
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/cars/${carId}`, {
        method: "PUT",
        // Don't set Content-Type header; browser will set it with boundary for FormData
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update car");
      }

      toast({
        title: "Success",
        description: "Car has been successfully updated",
        variant: "default",
      });

      router.push("/dashboard/carlisting");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Failed to update car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <p className="text-white">Loading car data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex items-center gap-2">
            <Link
              href="/dashboard/carlisting"
              className="text-slate-400 hover:text-slate-300 flex items-center gap-2 bg-slate-800/50 p-2 rounded-md"
            >
              <ArrowLeftIcon className="w-4 h-4 text-slate-400" />
              <span>Back to Listings</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Edit Car</h1>
            <p className="text-slate-400 mt-2">
              Update the details for this car listing
            </p>
          </div>

          <div className="bg-slate-900/50 border-slate-800 rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="text-slate-400">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model" className="text-slate-400">
                    Model
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-slate-400">
                    Year
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-slate-400">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-slate-400">
                    Type
                  </Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Wagon">Wagon</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuel" className="text-slate-400">
                    Fuel Type
                  </Label>
                  <Select
                    name="fuel"
                    value={formData.fuel}
                    onValueChange={(value) => handleSelectChange("fuel", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-in Hybrid">
                        Plug-in Hybrid
                      </SelectItem>
                      <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mileage" className="text-slate-400">
                    Mileage
                  </Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-slate-400">
                    Status
                  </Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color" className="text-slate-400">
                    Color
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="engineSize" className="text-slate-400">
                    Engine Size
                  </Label>
                  <Input
                    id="engineSize"
                    name="engineSize"
                    value={formData.engineSize}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="engineCylinders" className="text-slate-400">
                    Engine Cylinders
                  </Label>
                  <Input
                    id="engineCylinders"
                    name="engineCylinders"
                    value={formData.engineCylinders}
                    onChange={handleInputChange}
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="engineHorsepower" className="text-slate-400">
                    Horsepower
                  </Label>
                  <Input
                    id="engineHorsepower"
                    name="engineHorsepower"
                    value={formData.engineHorsepower}
                    onChange={handleInputChange}
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="transmission" className="text-slate-400">
                    Transmission
                  </Label>
                  <Select
                    name="engineTransmission"
                    value={formData.engineTransmission}
                    onValueChange={(value) =>
                      handleSelectChange("engineTransmission", value)
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="DCT">DCT</SelectItem>
                      <SelectItem value="Semi-Automatic">
                        Semi-Automatic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="driveTrain" className="text-slate-400">
                    Drive Train
                  </Label>
                  <Select
                    name="driveTrain"
                    value={formData.driveTrain}
                    onValueChange={(value) =>
                      handleSelectChange("driveTrain", value)
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select drive train" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FWD">FWD</SelectItem>
                      <SelectItem value="RWD">RWD</SelectItem>
                      <SelectItem value="AWD">AWD</SelectItem>
                      <SelectItem value="4WD">4WD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition" className="text-slate-400">
                    Condition
                  </Label>
                  <Select
                    name="condition"
                    value={formData.condition}
                    onValueChange={(value) =>
                      handleSelectChange("condition", value)
                    }
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Refurbished">Refurbished</SelectItem>
                      <SelectItem value="Remade">Remade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rating" className="text-slate-400">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.2"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-slate-400">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full h-32 bg-slate-800 border-slate-700 text-white rounded-md p-2"
                    placeholder="Enter car description..."
                    required
                  />
                </div>
                <div className="md:col-span-2 mb-4">
                  {existingImages.length > 0 && (
                    <>
                      <Label className="text-slate-400 block mb-2">
                        Current Images
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        {existingImages.map(
                          (imageUrl, index) =>
                            !imagesToRemove.includes(imageUrl) && (
                              <div
                                key={index}
                                className="relative w-32 h-32 group"
                              >
                                <Image
                                  src={imageUrl}
                                  alt={`Car image ${index + 1}`}
                                  width={128}
                                  height={128}
                                  className="object-cover w-full h-full rounded-md border border-slate-700"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(imageUrl)}
                                  className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 transition-opacity ${
                                    getRetainedImages().length === 1 &&
                                    !newImagesSelected
                                      ? "opacity-30 cursor-not-allowed"
                                      : "opacity-0 group-hover:opacity-100"
                                  }`}
                                  aria-label="Remove image"
                                  disabled={
                                    getRetainedImages().length === 1 &&
                                    !newImagesSelected
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )
                        )}
                      </div>
                      {imagesToRemove.length > 0 && (
                        <p className="text-amber-500 text-sm mt-2">
                          {imagesToRemove.length} image(s) marked for removal.
                          Changes will apply when you update the car.
                        </p>
                      )}
                      {existingImages.length === imagesToRemove.length && (
                        <p className="text-red-500 text-sm mt-2">
                          All images are marked for removal. Please upload at
                          least one new image or restore an existing one.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="images" className="text-slate-400">
                    {existingImages.length > 0
                      ? "Upload New Images (Optional)"
                      : "Upload Images"}
                  </Label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png"
                    className="bg-slate-800 border-slate-700 text-white"
                    max="3"
                    required={getRetainedImages().length === 0}
                    onChange={handleImageInputChange}
                  />
                  <p className="text-sm text-slate-400 mt-1">
                    {existingImages.length > 0
                      ? "Upload new images to add to or replace the current ones. Up to 3 files, each under 5MB."
                      : "Upload up to 3 images, each under 5MB. Images will be compressed."}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-400 text-lg">Features</Label>
                    <span className="text-sm text-slate-400">
                      Features from this car are already checked
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border border-slate-800 rounded-md p-4 bg-slate-900/30">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="adaptive-cruise"
                        checked={formData.features.includes("adaptive-cruise")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("adaptive-cruise", checked)
                        }
                      />
                      <label
                        htmlFor="adaptive-cruise"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("adaptive-cruise")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Adaptive Cruise Control
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="lane-keeping"
                        checked={formData.features.includes("lane-keeping")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("lane-keeping", checked)
                        }
                      />
                      <label
                        htmlFor="lane-keeping"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("lane-keeping")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Lane Keeping Assist
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="apple-carplay"
                        checked={formData.features.includes("apple-carplay")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("apple-carplay", checked)
                        }
                      />
                      <label
                        htmlFor="apple-carplay"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("apple-carplay")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Apple CarPlay
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="heated-seats"
                        checked={formData.features.includes("heated-seats")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("heated-seats", checked)
                        }
                      />
                      <label
                        htmlFor="heated-seats"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("heated-seats")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Heated Seats
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="bluetooth"
                        checked={formData.features.includes("bluetooth")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("bluetooth", checked)
                        }
                      />
                      <label
                        htmlFor="bluetooth"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("bluetooth")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Bluetooth
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="navigation"
                        checked={formData.features.includes("navigation")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("navigation", checked)
                        }
                      />
                      <label
                        htmlFor="navigation"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("navigation")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Navigation System
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="sunroof"
                        checked={formData.features.includes("sunroof")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("sunroof", checked)
                        }
                      />
                      <label
                        htmlFor="sunroof"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("sunroof")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Sunroof
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="leather-seats"
                        checked={formData.features.includes("leather-seats")}
                        onCheckedChange={(checked) =>
                          handleFeatureChange("leather-seats", checked)
                        }
                      />
                      <label
                        htmlFor="leather-seats"
                        className={`text-sm font-medium leading-none ${
                          formData.features.includes("leather-seats")
                            ? "text-white font-semibold"
                            : "text-slate-400"
                        } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                      >
                        Leather Seats
                      </label>
                    </div>
                  </div>
                  <div className="col-span-full mt-4 p-3 border border-slate-800 rounded-md bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        Selected Features:
                      </span>
                      {formData.features.length === 0 ? (
                        <span className="text-slate-500 italic">
                          None selected
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.features.map((feature) => (
                            <span
                              key={feature}
                              className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1"
                            >
                              {feature
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                              <button
                                type="button"
                                onClick={() =>
                                  handleFeatureChange(feature, false)
                                }
                                className="text-blue-400 hover:text-blue-200"
                                aria-label={`Remove ${feature}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/carlisting")}
                  className="border-slate-700 text-slate-400 hover:bg-slate-800"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating Car...
                    </>
                  ) : (
                    "Update Car"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCarPage;
