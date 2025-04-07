"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Car,
  Edit2,
  Key,
  LogOut,
  MapPin,
  Package,
  Save,
  Star,
  Trash2,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import Navbar from "../ui/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";

export default function UserProfileEdit() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/logout", {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/users/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: user.email,
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(false);
      toast.success("Password updated successfully");
    } catch (error) {
      setPasswordError(error.message);
      toast.error(error.message);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", user.email);

      // Make sure this URL matches your backend URL from your environment variables
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/users/update-profile-photo",
        {
          method: "PUT",
          body: formData,
          credentials: "include", // Include cookies if you're using session-based auth
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      setUser((prev) => ({ ...prev, profilePhoto: data.profilePhoto }));
    } catch (error) {
      console.error("Error uploading image:", error);
      // Add more detailed error feedback
      alert(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950">
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#fff",
            },
          }}
        />
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
              <Avatar className="h-24 w-24 border-4 border-slate-800 overflow-hidden group">
                <AvatarImage
                  src={user?.profilePhoto || "/img/user_img.png"}
                  alt={`${user?.firstName || "User"}'s profile`}
                  className="aspect-square w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
                <AvatarFallback className="bg-slate-800 text-xl">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>

                {/* Add edit button overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Camera className="h-5 w-5" />
                    <span className="sr-only">Change profile picture</span>
                  </Button>
                </div>
              </Avatar>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />

              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
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
                    onClick={() => setIsChangePasswordOpen(true)}
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

        <Dialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        >
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Change Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordChange}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-slate-400">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                    minLength={6}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-slate-400">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                    minLength={6}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError(null);
                  }}
                  className="border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                  Update Password
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
