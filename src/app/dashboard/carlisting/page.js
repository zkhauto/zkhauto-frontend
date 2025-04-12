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
import { Edit, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../ui/Sidebar";
import { Input } from "@/components/ui/input";

const CarListingPage = () => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const carsPerPage = 10;
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }
      const data = await response.json();
      setCars(data);
      setTotalCars(data.length);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (car) => {
    router.push(`/dashboard/carlisting/edit/${car._id}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Calculate pagination values
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = cars.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalCars / carsPerPage);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Car Management</h1>
            <p className="text-slate-400 mt-2">
              Manage car listings and inventory
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
              className="bg-blue-600 hover:bg-blue-500"
              onClick={() => router.push("/dashboard/carlisting/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </div>

          <div className="bg-slate-900/50 border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Car</TableHead>
                  <TableHead className="text-slate-400">Price</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Added Date</TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-400 py-8"
                    >
                      Loading cars...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-red-400 py-8"
                    >
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : currentCars.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-400 py-8"
                    >
                      No cars found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCars.map((car) => (
                    <TableRow key={car._id} className="border-slate-800">
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
                            <div className="text-sm text-slate-400">
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
                        <div className="text-sm text-slate-400">
                          {new Date(car.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(car)}
                          className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
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
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
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
                          className={`border-slate-800 ${
                            currentPage === page
                              ? "text-white bg-slate-800"
                              : "text-slate-400 hover:bg-slate-800"
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
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
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
