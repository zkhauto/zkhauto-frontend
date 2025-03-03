"use client";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    // Trigger Google login
    console.log("Google login triggered");
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";
    window.location.href = `${backendUrl}auth/google`;
  };

  //login the get user if the user already exists if not redirect it to signup page
  const handleLogin = async (e) => {
    e.preventDefault(); // Add this to prevent form submission
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // Set user in context
        router.push("/");
      } else {
        // Handle login error
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 p-8">
        <div className="relative w-full h-full">
          <Image
            src="/img/login.jpg"
            alt="Car at sunset"
            fill
            className="object-cover rounded-3xl border-2 border-gray-700"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/30 rounded-3xl" />
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-400">
              Your dream car is just a login away
            </p>
          </div>

          {/* Add error message display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-3">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-500 focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-4 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleLogin} // Triggers Google login
                className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
              >
                <Image
                  src="/img/Google_Logo_Primary.png"
                  alt="Google"
                  width={30}
                  height={30}
                />
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors">
                <Image
                  src="/img/Facebook_Logo_Primary.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                Continue with Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
