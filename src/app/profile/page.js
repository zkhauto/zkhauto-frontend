"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Star,
  Package,
  Save,
  Trash2,
  Key,
  LogOut,
  Edit2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "../ui/Navbar";
import user_img from "../../../public/img/user_img.png";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function UserProfileEdit() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        {/* Top Navigation Bar */}
        <div className="bg-slate-900/50 border-b border-slate-800 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-semibold text-white">
              Account Settings
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="mb-8 flex items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-slate-800 overflow-hidden">
                <AvatarImage
                  src={user.profilePhoto || "/img/user_img.png"}
                  alt="Profile"
                  className="aspect-square w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
                <AvatarFallback className="bg-slate-800 text-xl">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-500 w-8 h-8 flex items-center justify-center"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-6 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">
                  {user.displayName || `${user.firstName} ${user.lastName}`}
                </h2>
              </div>
              <div className="mt-1 flex items-center text-slate-400">
                <MapPin className="mr-1 h-4 w-4" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="flex items-center p-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-sm text-slate-400">Cars Listed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="flex items-center p-4">
                <div className="rounded-full bg-emerald-500/10 p-3">
                  <Car className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">89</p>
                  <p className="text-sm text-slate-400">Cars Sold</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="flex items-center p-4">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">4.9</p>
                  <p className="text-sm text-slate-400">Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Content */}
          <div className="grid gap-6">
            {/* Contact Information */}
            <Card className="bg-slate-900/50 border-slate-800">
              <div className="border-b border-slate-800 p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Personal Information
                </h3>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-500 hover:bg-green-500/10 hover:text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Full Name</label>
                    <Input
                      defaultValue={`${user.firstName} ${user.lastName}`}
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">
                      Display Name
                    </label>
                    <Input
                      defaultValue={user.displayName}
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Email</label>
                    <Input
                      defaultValue={user.email}
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">
                      Phone Number
                    </label>
                    <Input
                      defaultValue="+1 (555) 123-4567"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Language</label>
                    <Input
                      defaultValue="English"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Preferences */}
            <Card className="bg-slate-900/50 border-slate-800">
              <div className="border-b border-slate-800 p-4">
                <h3 className="text-lg font-medium text-white">
                  Car Preferences & Interests
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Make</label>
                    <Input
                      defaultValue="Toyota"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Model</label>
                    <Input
                      defaultValue="Camry"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Type</label>
                    <Input
                      defaultValue="Sedan"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Steering</label>
                    <Input
                      defaultValue="Left"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Year</label>
                    <Input
                      defaultValue="2022"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">
                      Price Range
                    </label>
                    <Input
                      defaultValue="$25,000"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Mileage</label>
                    <Input
                      defaultValue="15,000 mi"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Location</label>
                    <Input
                      defaultValue="New York, NY"
                      className="border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-slate-900/50 border-slate-800">
              <div className="border-b border-slate-800 p-4">
                <h3 className="text-lg font-medium text-white">
                  Account Settings
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex-1 border-blue-600/50 text-blue-500 hover:bg-blue-600/10 hover:border-blue-500 transition-colors hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-900/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
