"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Sidebar from "../../ui/Sidebar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const CarListingPage = () => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const carsPerPage = 10;
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [selectedCars, setSelectedCars] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching cars from:", `${process.env.NEXT_PUBLIC_API_URL}/api/cars`);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Fetched cars:", data);
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of cars");
      }
      
      setCars(data);
      setTotalCars(data.length);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (car) => {
    router.push(`/dashboard/carlisting/edit/${car._id}`);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    console.log("Search value:", searchValue);
    setSearch(searchValue);
    setCurrentPage(1);
  };

  // Filter cars based on search term
  const filteredCars = cars.filter((car) => {
    if (!search) return true;
    
    const searchTerm = search.toLowerCase().trim();
    console.log("Filtering cars with term:", searchTerm);
    
    // Check if any of the car's fields match the search term
    return (
      (car.brand?.toLowerCase() || '').includes(searchTerm) ||
      (car.model?.toLowerCase() || '').includes(searchTerm) ||
      (car.year?.toString() || '').includes(searchTerm) ||
      (car.price?.toString() || '').includes(searchTerm) ||
      (car.status?.toLowerCase() || '').includes(searchTerm)
    );
  });

  // Log the filtered results for debugging
  useEffect(() => {
    console.log("Search term:", search);
    console.log("Total cars:", cars.length);
    console.log("Filtered cars:", filteredCars.length);
  }, [search, cars, filteredCars]);

  // Calculate pagination values using filtered cars
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Handle delete car
  const handleDelete = async (car) => {
    try {
      setIsDeleting(true);
      setCarToDelete(car._id);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${car._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to delete car: ${response.status} ${response.statusText}`);
      }
      
      // Remove the deleted car from the state
      setCars((prevCars) => prevCars.filter((c) => c._id !== car._id));
      setTotalCars((prev) => prev - 1);
      
      // If we're on the last page and delete the last item, go to previous page
      if (currentCars.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      setError(error.message);
    } finally {
      setIsDeleting(false);
      setCarToDelete(null);
    }
  };

  // Handle select all cars on current page
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCars(currentCars.map(car => car._id));
    } else {
      setSelectedCars([]);
    }
  };

  // Handle select a single car
  const handleSelectCar = (carId, checked) => {
    if (checked) {
      setSelectedCars(prev => [...prev, carId]);
    } else {
      setSelectedCars(prev => prev.filter(id => id !== carId));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCars.length === 0) return;
    
    try {
      setIsBulkDeleting(true);
      
      // Delete each selected car
      for (const carId of selectedCars) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${carId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          console.error(`Failed to delete car ${carId}: ${response.status} ${response.statusText}`);
        }
      }
      
      // Refresh the car list
      await fetchCars();
      
      // Clear selection
      setSelectedCars([]);
      
      // If we're on the last page and delete all items, go to previous page
      if (currentCars.length === selectedCars.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error bulk deleting cars:", error);
      setError(error.message);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Car Management</h1>
            <p className="text-white mt-2">
              Manage car listings and inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-800 border border-gray-700 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by brand, model, year, price, or status..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                style={{ 
                  color: 'white',
                  WebkitTextFillColor: 'white',
                  caretColor: 'white'
                }}
                aria-label="Search cars"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedCars.length > 0 && (
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                >
                  {isBulkDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Selected ({selectedCars.length})
                </Button>
              )}
              <Button
                className="bg-blue-600 hover:bg-blue-500"
                onClick={() => router.push("/dashboard/carlisting/add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-white font-semibold w-10">
                    <Checkbox 
                      checked={currentCars.length > 0 && selectedCars.length === currentCars.length}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableHead>
                  <TableHead className="text-white font-semibold">Car</TableHead>
                  <TableHead className="text-white font-semibold">Price</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Added Date</TableHead>
                  <TableHead className="text-white font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-white py-8"
                    >
                      Loading cars...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-red-400 py-8"
                    >
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : currentCars.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-white py-8"
                    >
                      No cars found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCars.map((car) => (
                    <TableRow key={car._id} className="border-gray-700">
                      <TableCell>
                        <Checkbox 
                          checked={selectedCars.includes(car._id)}
                          onCheckedChange={(checked) => handleSelectCar(car._id, checked)}
                          className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-4">
                            <Image
                              className="h-10 w-10 rounded-lg object-cover"
                              src={
                                car.images?.[0] || "/img/car-placeholder.jpg"
                              }
                              alt={`${car.brand} ${car.model}`}
                              width={40}
                              height={40}
                              priority
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-sm text-white">
                              {car.year}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          ${car.price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`
                            ${
                              car.status === "available"
                                ? "bg-green-500/10 text-green-500"
                                : ""
                            }
                            ${
                              car.status === "sold"
                                ? "bg-red-500/10 text-red-500"
                                : ""
                            }
                            ${
                              car.status === "reserved"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : ""
                            }
                            ${
                              car.status === "maintenance"
                                ? "bg-blue-500/10 text-blue-500"
                                : ""
                            }
                          `}
                        >
                          {car.status.charAt(0).toUpperCase() +
                            car.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-white">
                          {new Date(car.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(car)}
                            className="text-white hover:text-white hover:bg-gray-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(car)}
                            className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                            disabled={isDeleting && carToDelete === car._id}
                          >
                            {isDeleting && carToDelete === car._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-white">
                    Showing{" "}
                    <span className="font-medium text-white">
                      {startIndex + 1}
                    </span>
                    to
                    <span className="font-medium text-white">
                      {Math.min(endIndex, totalCars)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">{totalCars}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`border-gray-700 ${
                            currentPage === page
                              ? "text-white bg-gray-800"
                              : "text-white hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarListingPage;
