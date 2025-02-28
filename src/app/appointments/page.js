"use client";

import { useState } from "react";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Navbar from "../ui/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    period: "AM",
    reason: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prev) => [
      ...prev,
      {
        ...formData,
        time: `${formData.time} ${formData.period}`,
        id: Date.now(),
      },
    ]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      period: "AM",
      reason: "",
      notes: "",
    });
    setDate(undefined);
    setTime("");
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4 bg-gray-900 text-white min-h-screen mt-12">
        <div className="flex flex-col items-center mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            Appointments Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Schedule and manage patient appointments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-lg p-4">
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gray-300">
              <CardTitle>Schedule New Appointment</CardTitle>
              <CardDescription>
                Fill out the form to create a new appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Patient Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="patient@example.com"
                        required
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
                      <div className="flex gap-2">
                        <Select
                          value={formData.period}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "period", value },
                            })
                          }
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">12:00 AM</SelectItem>
                            <SelectItem value="PM">12:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Input
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Brief description of visit reason"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information or special requirements"
                      rows={3}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Schedule Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gray-300">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Manage scheduled appointments
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-gray-800 text-white">
                    {appointments.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No appointments scheduled
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the form to create your first appointment
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {appointment.name}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(appointment.id)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {appointment.date}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.time}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Reason:</span>{" "}
                              {appointment.reason}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span>{" "}
                              {appointment.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span>{" "}
                              {appointment.phone}
                            </div>
                            {appointment.notes && (
                              <>
                                <Separator className="my-2" />
                                <div>
                                  <span className="font-medium">Notes:</span>{" "}
                                  {appointment.notes}
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

export default Appointments;
