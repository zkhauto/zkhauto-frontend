"use client";

import { useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
// Sample data for demonstration
const demodata = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    type: "Sedan",
    steering: "Left",
    year: 2022,
    price: 25000,
    mileage: 15000,
    image: "/placeholder.svg?height=200&width=300",
    location: "New York, NY",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    type: "Sedan",
    steering: "Left",
    year: 2021,
    price: 22000,
    mileage: 18000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Los Angeles, CA",
    rating: 4.6,
    status: "Active",
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    type: "Sedan",
    steering: "Left",
    year: 2023,
    price: 45000,
    mileage: 5000,
    image: "/placeholder.svg?height=200&width=300",
    location: "San Francisco, CA",
    rating: 4.9,
    status: "Pending",
  },
  {
    id: 4,
    make: "BMW",
    model: "X5",
    type: "SUV",
    steering: "Left",
    year: 2022,
    price: 62000,
    mileage: 12000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Chicago, IL",
    rating: 4.7,
    status: "Active",
  },
  {
    id: 5,
    make: "Mercedes",
    model: "C-Class",
    type: "Sedan",
    steering: "Left",
    year: 2021,
    price: 48000,
    mileage: 20000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Miami, FL",
    rating: 4.5,
    status: "Sold",
  },
  {
    id: 6,
    make: "Audi",
    model: "Q7",
    type: "SUV",
    steering: "Right",
    year: 2023,
    price: 70000,
    mileage: 8000,
    image: "/placeholder.svg?height=200&width=300",
    location: "Seattle, WA",
    rating: 4.8,
    status: "Active",
  },
];

const CarListing = () => {
  const [cars, setCars] = useState(demodata);
  const [search, setSearch] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      car.location.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setCurrentCar(null);
    setIsEditing(false);
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

  const handleDelete = () => {
    if (currentCar) {
      setCars(cars.filter((car) => car.id !== currentCar.id));
      setIsDeleteModalOpen(false);
      // In a real app, you would make an API call here
    }
  };

  const handleAddEdit = (e) => {
    e.preventDefault();

    // In a real app, you would make an API call here
    // For demo purposes, we'll just update the local state

    if (isEditing && currentCar) {
      // Update existing car
      setCars(cars.map((car) => (car.id === currentCar.id ? currentCar : car)));
    } else if (currentCar) {
      // Add new car
      setCars([
        ...cars,
        { ...currentCar, id: Math.max(...cars.map((c) => c.id)) + 1 },
      ]);
    }

    setIsAddEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!currentCar) {
      // If adding a new car, initialize with default values
      setCurrentCar({
        id: 0,
        make: "",
        model: "",
        type: "Sedan",
        steering: "Left",
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        image: "/placeholder.svg?height=200&width=300",
        location: "",
        rating: 5.0,
        status: "Active",
        [name]: value,
      });
    } else {
      // Update existing car
      setCurrentCar({
        ...currentCar,
        [name]:
          name === "price" || name === "mileage" || name === "year"
            ? Number.parseInt(value)
            : value,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Car Inventory</h1>
            <p className="text-slate-400 mt-2">
              Manage your vehicle listings and inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-slate-900/50 border-slate-800 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={handleSearch}
                className="pl-10 w-full bg-slate-900 border-slate-800 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              onClick={openAddModal}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Car
            </Button>
          </div>

          <div className="bg-slate-900/50 border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
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
                {filteredCars.map((car) => (
                  <TableRow key={car.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-16 flex-shrink-0 mr-4">
                          <Image
                            className="h-10 w-16 rounded object-cover"
                            src={car.image || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            width={64}
                            height={40}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {car.make} {car.model}
                          </div>
                          <div className="text-sm text-slate-400">
                            {car.year}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{car.type}</div>
                      <div className="text-sm text-slate-400">
                        {car.steering} Hand • {car.mileage.toLocaleString()} mi
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
                          car.status === "Active"
                            ? "default"
                            : car.status === "Pending"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          car.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : car.status === "Pending"
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
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-800 text-slate-400 hover:bg-slate-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-800 text-slate-400 hover:bg-slate-800"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-medium text-white">1</span> to{" "}
                    <span className="font-medium text-white">
                      {filteredCars.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {filteredCars.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-white bg-slate-800"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditing ? "Edit Car" : "Add New Car"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEdit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="image" className="text-slate-400">
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={currentCar?.image || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  name="make"
                  required
                  value={currentCar?.make || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  required
                  value={currentCar?.model || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  value={currentCar?.type || "Sedan"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "type", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="steering">Steering</Label>
                <Select
                  name="steering"
                  value={currentCar?.steering || "Left"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "steering", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select steering" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={currentCar?.year || new Date().getFullYear()}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.price || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  required
                  min="0"
                  value={currentCar?.mileage || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={currentCar?.status || "Active"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "status", value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  value={currentCar?.location || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEditModalOpen(false)}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
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
              Are you sure you want to delete {currentCar?.make}{" "}
              {currentCar?.model} ({currentCar?.year})? This action cannot be
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
    </div>
  );
};

export default CarListing;
