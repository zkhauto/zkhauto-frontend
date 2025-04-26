"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Sidebar from "../../../ui/Sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const AddCarPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
    transmission: "",
    driveTrain: "",
    description: "",
    rating: "",
    status: "available",
    condition: "",
    features: [],
  });

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      // Handle features array specifically
      if (key === "features") {
        // Sending features as a JSON string is common with FormData
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append image files (up to 3)
    const imageFiles = Array.from(e.target.images.files).slice(0, 3);
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        // Append each file with the same key 'images'
        formDataToSend.append("images", file, file.name);
      });
    } else {
      // If no images, backend will handle default
      // Optionally, append default image flags/values if needed by backend logic
      // formDataToSend.append('images', JSON.stringify(["url_to_exterior2.jpg", "url_to_interior2.jpg"]));
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars`,
        {
          method: "POST",
          // Don't set Content-Type header; browser will set it with boundary for FormData
          body: formDataToSend,
          // Add credentials if needed, e.g., credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add car");
      }

      toast({
        title: "Success",
        description: "Car has been successfully added",
        variant: "default",
      });

      router.push("/dashboard/carlisting");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      console.error("Failed to add car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Add New Car</h1>
            <p className="text-slate-400 mt-2">
              Fill in the details to add a new car listing
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
                    name="transmission"
                    value={formData.transmission}
                    onValueChange={(value) => handleSelectChange("transmission", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
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
                <div className="md:col-span-2">
                  <Label htmlFor="images" className="text-slate-400">
                    Images
                  </Label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                    max="3"
                  />
                  <p className="text-sm text-slate-400 mt-1">
                    Maximum 3 images, each under 5MB. Images will be compressed.
                  </p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <Label className="text-slate-400 text-lg">Features</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        className="text-sm font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Leather Seats
                      </label>
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
                      Adding Car...
                    </>
                  ) : (
                    "Add Car"
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

export default AddCarPage;
