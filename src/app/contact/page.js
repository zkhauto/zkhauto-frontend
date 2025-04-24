"use client";

import {
  AlertCircle,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import Navbar from "../ui/Navbar";

const ContactUs = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.target);
    const data = {
      fullName: user?.firstName + " " + user?.lastName,
      email: user?.email,
      phone: formData.get("phone"),
      carModel: formData.get("carModel"),
      preferredDate: formData.get("preferredDate"),
      topic: selectedTopic,
      message: formData.get("message"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        e.target.reset();
        setSelectedTopic("");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to send message. Please try again."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-gray-900">
      <Navbar />
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => router.back()}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          ← Back
        </Button>
      </div>
      {/* Header Section */}
      <div className="relative bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          {/* <img
            src="/placeholder.svg?height=400&width=1920&text=Car+Background"
            alt="Car background"
            className="h-full w-full object-cover opacity-10"
          /> */}
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-teal-50">
            We&apos;re here to help with your car-buying needs. Our team is
            ready to assist you with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6 lg:col-span-1">
            {/* Business Hours */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-gray-300 py-3 px-6">
                <CardTitle className="flex items-center ">
                  <Clock className="mr-2 h-5 w-5" />
                  Business Hours
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium">Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium">Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="font-medium">Sunday</span>
                    <span>Closed</span>
                  </div>
                  <p className="pt-2 text-xs text-muted-foreground">
                    All times are in Eastern Time (ET)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Physical Address */}
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-gray-300 py-3 px-6">
                <CardTitle className="flex items-center ">
                  <MapPin className="mr-2 h-5 w-5" />
                  Our Location
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <p className="mb-4 text-gray-700">
                  123 Car Avenue
                  <br />
                  Automotive District
                  <br />
                  New York, NY 10001
                </p>
                <div className="h-48 w-full overflow-hidden rounded-md bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d375.1180555349635!2d24.74536070259399!3d60.18301814664866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df4513942a187%3A0x3d6f85b6b9d49f7!2sKokinniitty%209%2C%2002250%20Espoo!5e1!3m2!1sen!2sfi!4v1740767950217!5m2!1sen!2sfi"
                    width="600"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full hover:bg-gray-900 hover:text-gray-50"
                >
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Information */}
            <Alert className="border-2 border-red-200 bg-red-50 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-lg font-bold text-red-700">
                Emergency Information
              </AlertTitle>
              <AlertDescription className="mt-2 text-red-700">
                For car emergencies, please call{" "}
                <span className="font-bold">911</span> or contact your nearest
                car service center immediately.
              </AlertDescription>
            </Alert>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gray-300 pb-6">
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within
                  24-48 business hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 py-16 text-center">
                    <div className="rounded-full bg-teal-100 p-4">
                      <svg
                        className="h-8 w-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium text-slate-900">
                      Thank you for your message!
                    </h3>
                    <p className="text-lg text-slate-600">
                      We&apos;ve received your inquiry and will respond as soon
                      as possible.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    key="contact-form"
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* {JSON.stringify(user)} */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          defaultValue={`${
                            user ? user?.firstName + " " + user?.lastName : ""
                          }`}
                          readOnly={!!user}
                          className="border-gray-200 focus-visible:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={user?.email}
                          readOnly
                          required
                          className="border-gray-200 focus-visible:ring-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(212) 555-1234"
                          className="border-gray-200 focus-visible:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="carModel"
                          className="text-sm font-medium"
                        >
                          Car Model
                        </Label>
                        <Input
                          id="carModel"
                          name="carModel"
                          placeholder="e.g. Volvo XC60"
                          className="border-gray-200 focus-visible:ring-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="preferredDate"
                        className="text-sm font-medium"
                      >
                        Preferred Date
                      </Label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        className="border-gray-200 focus-visible:ring-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-sm font-medium">
                        Subject/Topic <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedTopic}
                        onValueChange={setSelectedTopic}
                      >
                        <SelectTrigger
                          id="topic"
                          className="border-gray-200 focus-visible:ring-gray-500"
                        >
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="testDrive">
                            Test Drive Request
                          </SelectItem>
                          <SelectItem value="pricing">
                            Pricing Inquiry
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your inquiry in detail..."
                        className="min-h-[150px] border-gray-200 focus-visible:ring-gray-500"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-3 rounded-md bg-slate-50 p-4">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                        required
                      />
                      <Label
                        htmlFor="consent"
                        className="text-sm text-slate-600"
                      >
                        I consent to having this website store my submitted
                        information so they can respond to my inquiry. See our{" "}
                        <Link
                          href="#"
                          className="text-gray-600 underline hover:text-gray-800"
                        >
                          privacy policy
                        </Link>{" "}
                        to learn more about how we use data.
                      </Label>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gray-800 text-white hover:bg-gray-900"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Submit Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="mt-16 grid gap-8 rounded-xl bg-slate-50 p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          {/* Phone Numbers */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Phone className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Phone Numbers
            </h3>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Main Reception
                </div>
                <a
                  href="tel:+12125551234"
                  className="text-lg font-medium text-gray-600 hover:underline"
                >
                  +1 (212) 555-1234
                </a>
              </div>
            </div>
          </div>

          {/* Email Addresses */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Mail className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Email Addresses
            </h3>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  General Inquiries
                </div>
                <a
                  href="mailto:info@carselling.com"
                  className="text-lg font-medium text-gray-600 hover:underline"
                >
                  info@carselling.com
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="mb-4 text-slate-600">
              Find quick answers to common questions about our services,
              appointments, and policies.
            </p>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            >
              <Link href="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-16 text-center">
          <h3 className="mb-6 text-xl font-semibold text-slate-900">
            Connect With Us
          </h3>
          <div className="flex justify-center space-x-8">
            <a href="#" className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-gray-100">
                <Facebook className="h-6 w-6 text-slate-600 transition-colors group-hover:text-gray-600" />
              </div>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-gray-100">
                <Twitter className="h-6 w-6 text-slate-600 transition-colors group-hover:text-gray-600" />
              </div>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-gray-100">
                <Linkedin className="h-6 w-6 text-slate-600 transition-colors group-hover:text-gray-600" />
              </div>
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-gray-100">
                <Instagram className="h-6 w-6 text-slate-600 transition-colors group-hover:text-gray-600" />
              </div>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
