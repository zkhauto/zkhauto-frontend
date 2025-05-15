"use client";

import { Badge } from "@/components/ui/badge";
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
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../../ui/Sidebar";

const AdminTestDrives = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch test drives from backend
  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/test-drives");
        if (!response.ok) {
          throw new Error("Failed to fetch test drives");
        }
        const data = await response.json();
        setTestDrives(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestDrives();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter test drives based on search
  const filteredTestDrives = testDrives.filter(
    (drive) =>
      drive.name?.toLowerCase().includes(search.toLowerCase()) ||
      drive.email?.toLowerCase().includes(search.toLowerCase()) ||
      drive.carModel?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle status update (approve/reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/test-drives/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const updatedTestDrive = await response.json();
      setTestDrives((prev) =>
        prev.map((drive) =>
          drive._id === updatedTestDrive._id ? updatedTestDrive : drive
        )
      );
    } catch (error) {
      console.error("Error updating test drive status:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log("Deleting test drive with id:", id);
    try {
      await fetch(`http://localhost:5000/api/test-drives/${id}`, {
        method: "DELETE",
      });
      setTestDrives((prev) => prev.filter((drive) => drive._id !== id));
    } catch (error) {
      console.error("Error deleting test drive:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Test Drive Bookings
            </h1>
            <p className="text-gray-600 mt-2">Manage all test drive bookings</p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search test drives..."
                value={search}
                onChange={handleSearch}
                className="pl-10 w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-900">Name</TableHead>
                  <TableHead className="text-gray-900">Email</TableHead>
                  <TableHead className="text-gray-900">Car Model</TableHead>
                  <TableHead className="text-gray-900">Date & Time</TableHead>
                  <TableHead className="text-gray-900">Notes</TableHead>
                  <TableHead className="text-gray-900">Status</TableHead>
                  <TableHead className="text-gray-900 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestDrives.map((drive) => (
                  <TableRow key={drive._id} className="border-gray-200">
                    <TableCell className="text-gray-900">
                      {drive.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {drive.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {drive.carModel}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {drive.date} at {drive.time}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {drive.notes}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          drive.status === "approved"
                            ? "default"
                            : drive.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {drive.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusUpdate(drive._id, "approved")
                          }
                          className="text-green-600 hover:text-green-700 hover:bg-gray-200"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusUpdate(drive._id, "rejected")
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(drive._id)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">1</span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-900">
                      {filteredTestDrives.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900">
                      {filteredTestDrives.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-500 hover:bg-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-900 bg-gray-200"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-500 hover:bg-gray-200"
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

export default AdminTestDrives;
