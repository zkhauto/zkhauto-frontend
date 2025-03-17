"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import Navbar from "../ui/Navbar";

const TestDriveBooking = () => {
  const { user } = useAuth();
  const [testDrives, setTestDrives] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({
    name: user?.firstName + " " + user?.lastName,
    email: user?.email,
    phone: "",
    date: "",
    time: "",
    carModel: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    }));
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
    setFormData((prev) => ({
      ...prev,
      time: selectedTime,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    try {
      const response = await fetch("http://localhost:5000/api/test-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newTestDrive = await response.json();

        setTestDrives((prev) => [...prev, newTestDrive]);
        toast.success("Test drive booked successfully");
        setFormData({
          name: user?.firstName + " " + user?.lastName,
          email: user?.email,
          phone: "",
          date: "",
          time: "",
          carModel: "",
          notes: "",
        });
        setDate(undefined);
        setTime("");
      } else if (response.status === 400) {
        toast.error(
          `This carModel is already booked for the selected date and time`
        );
      } else {
        alert("Error booking test drive");
      }
    } catch (error) {
      console.error("Error booking test drive:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/test-drives/${id}`, {
        method: "DELETE",
      });
      setTestDrives((prev) => prev.filter((drive) => drive._id !== id));
    } catch (error) {
      console.error("Error deleting test drive:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Toaster position="top-right" />
      <Navbar />
      <div className="container mx-auto py-8 px-4 bg-gray-900 text-white min-h-screen mt-12">
        <div className="flex flex-col items-center mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Test Drive Booking
          </h1>
          <p className="text-xl text-muted-foreground">
            Schedule and manage car test drives
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-lg p-4">
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gray-300">
              <CardTitle>Book a Test Drive</CardTitle>
              <CardDescription>
                Fill out the form to schedule a test drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      // id="name"
                      // name="name"
                      defaultValue={`${user?.firstName} ${user?.lastName}  `}
                      // onChange={handleInputChange}
                      placeholder="Enter your name"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        // id="email"
                        // name="email"
                        type="email"
                        defaultValue={user?.email}
                        // onChange={handleInputChange}
                        placeholder="example@example.com"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carModel">Car Model</Label>
                    <Input
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleInputChange}
                      placeholder="Enter car model"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requests or notes"
                      rows={3}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Book Test Drive
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Test Drives</CardTitle>
                    <CardDescription>
                      Manage scheduled test drives
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-gray-800 text-white">
                    {testDrives.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {testDrives.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No test drives scheduled
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the form to book your first test drive
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testDrives.map((drive) => (
                      <Card key={drive._id} className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {drive.name}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(drive._id)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {drive.date}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {drive.time}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Car Model:</span>{" "}
                              {drive.carModel}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span>{" "}
                              {drive.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span>{" "}
                              {drive.phone}
                            </div>
                            {drive.notes && (
                              <>
                                <Separator className="my-2" />
                                <div>
                                  <span className="font-medium">Notes:</span>{" "}
                                  {drive.notes}
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveBooking;
