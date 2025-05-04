"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../../ui/Sidebar";
import { ImageIcon, Brain, TrendingUp, AlertCircle, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AIPredictionPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [predictions, setPredictions] = useState({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    reservedCars: 0,
    avgPrice: 0,
    avgMileage: 0,
    demandData: [],
    damageAnalysis: []
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [filter, setFilter] = useState("last_30_days");
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loading) {
      return; // Wait for auth check to complete
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch cars data
        const carsResponse = await fetch('http://localhost:5000/api/cars', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!carsResponse.ok) {
          throw new Error('Failed to fetch cars data');
        }

        const cars = await carsResponse.json();

        // Calculate analytics based on real data
        const totalCars = cars.length;
        const availableCars = cars.filter(car => car.status === 'available').length;
        const soldCars = cars.filter(car => car.status === 'sold').length;
        const reservedCars = cars.filter(car => car.status === 'reserved').length;

        // Calculate average price and mileage
        const totalPrice = cars.reduce((sum, car) => sum + car.price, 0);
        const totalMileage = cars.reduce((sum, car) => sum + car.mileage, 0);
        const avgPrice = totalPrice / totalCars;
        const avgMileage = totalMileage / totalCars;

        // Calculate demand based on car status and time on market
        const demandData = cars.map(car => ({
          model: `${car.brand} ${car.model}`,
          demand: calculateDemandScore(car),
          status: car.status,
          price: car.price,
          mileage: car.mileage,
          brand: car.brand,
          year: car.year,
          condition: car.condition
        }));

        // Sort by demand score
        demandData.sort((a, b) => b.demand - a.demand);

        // Calculate damage analysis based on real car data
        const damageAnalysis = cars.map(car => ({
          model: `${car.brand} ${car.model}`,
          condition: car.condition,
          mileage: car.mileage,
          risk: calculateDamageRisk(car),
          images: car.images || [],
          brand: car.brand,
          price: car.price,
          year: car.year,
          status: car.status,
          features: car.features || [],
          description: car.description
        }));

        // Sort by risk score
        damageAnalysis.sort((a, b) => b.risk - a.risk);

        setPredictions({
          totalCars,
          availableCars,
          soldCars,
          reservedCars,
          avgPrice,
          avgMileage,
          demandData,
          damageAnalysis
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to fetch car data. Please try again later.');
      }
    };

    fetchData();
  }, [filter, user, loading, router]);

  // Helper function to calculate demand score
  const calculateDemandScore = (car) => {
    let score = 0;
    
    // Base score on status
    if (car.status === 'sold') score += 100;
    else if (car.status === 'reserved') score += 80;
    else if (car.status === 'available') score += 50;

    // Adjust based on price (lower price = higher demand)
    const priceScore = Math.max(0, 100 - (car.price / 10000));
    score += priceScore;

    // Adjust based on mileage (lower mileage = higher demand)
    const mileageScore = Math.max(0, 100 - (car.mileage / 10000));
    score += mileageScore;

    // Adjust based on condition
    if (car.condition === 'New') score += 50;
    else if (car.condition === 'Used') score += 30;

    // Adjust based on year (newer cars = higher demand)
    const currentYear = new Date().getFullYear();
    const yearScore = Math.max(0, 50 - ((currentYear - car.year) * 5));
    score += yearScore;

    return Math.min(100, score);
  };

  // Helper function to calculate damage risk
  const calculateDamageRisk = (car) => {
    let risk = 0;

    // Base risk on condition
    if (car.condition === 'Used') risk += 50;
    else if (car.condition === 'New') risk += 20;

    // Adjust based on mileage
    const mileageRisk = Math.min(50, car.mileage / 10000);
    risk += mileageRisk;

    // Adjust based on year (older cars = higher risk)
    const currentYear = new Date().getFullYear();
    const yearRisk = Math.min(30, (currentYear - car.year) * 2);
    risk += yearRisk;

    return Math.min(100, risk);
  };

  // Helper function to format car model
  const formatCarModel = (car) => {
    // Fix common brand typos
    const brand = car.brand === 'Buggati' ? 'Bugatti' : car.brand;
    return `${brand} ${car.model}`;
  };

  // Colors for charts with better contrast
  const COLORS = [
    "#1f77b4", // Blue
    "#ff7f0e", // Orange
    "#2ca02c", // Green
    "#d62728", // Red
    "#9467bd", // Purple
    "#8c564b", // Brown
    "#e377c2", // Pink
    "#7f7f7f", // Gray
    "#bcbd22", // Yellow-green
    "#17becf"  // Cyan
  ];

  const analyzeCarImage = async (car) => {
    if (!car || !car.images || car.images.length === 0) {
      setAnalysisError('No images available for this car');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setSelectedCar(car);

    try {
      const response = await fetch('http://localhost:5000/api/cars/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: car.images[0] }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const analysis = await response.json();
      console.log('Image analysis result:', analysis);

      // Format the analysis data for display
      const formattedAnalysis = {
        damageScore: analysis.damageScore || '0.00',
        detectedIssues: analysis.detectedIssues || [],
        overallCondition: analysis.overallCondition || 'Unknown',
        recommendedActions: analysis.recommendedActions || [],
        detectedObjects: analysis.analysisDetails?.detectedObjects?.map(obj => ({
          name: obj.name,
          confidence: obj.confidence
        })) || [],
        detectedLabels: analysis.analysisDetails?.detectedLabels?.map(label => ({
          name: label.description,
          confidence: label.confidence
        })) || []
      };

      console.log('Formatted analysis:', formattedAnalysis);
      setImageAnalysis(formattedAnalysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Predictions</h1>
            <p className="text-gray-600 mt-2">
              AI-powered insights and predictions for your car inventory
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200 text-gray-900">
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="last_7_days" className="hover:bg-gray-50">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="last_30_days" className="hover:bg-gray-50">
                  Last 30 Days
                </SelectItem>
                <SelectItem value="last_year" className="hover:bg-gray-50">
                  Last Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-gray-900">Demand Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {predictions.demandData.length > 0 
                    ? `${Math.round(predictions.demandData[0].demand)}%` 
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Average Demand Score</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-gray-900">Market Trends</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {predictions.soldCars > 0 
                    ? `${Math.round((predictions.soldCars / predictions.totalCars) * 100)}%` 
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Sales Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-gray-900">Damage Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {predictions.damageAnalysis.length > 0 
                    ? `${Math.round(predictions.damageAnalysis[0].risk)}%` 
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Highest Risk Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Total Cars</h3>
              <p className="text-2xl font-bold text-gray-800">{predictions.totalCars}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Available Cars</h3>
              <p className="text-2xl font-bold text-green-600">{predictions.availableCars}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Sold Cars</h3>
              <p className="text-2xl font-bold text-blue-600">{predictions.soldCars}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Reserved Cars</h3>
              <p className="text-2xl font-bold text-yellow-600">{predictions.reservedCars}</p>
            </div>
          </div>

          {/* Average Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Average Price</h3>
              <p className="text-2xl font-bold text-gray-800">${predictions.avgPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Average Mileage</h3>
              <p className="text-2xl font-bold text-gray-800">{predictions.avgMileage.toLocaleString()} miles</p>
            </div>
          </div>

          {/* Demand Analysis */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Top 5 Cars by Demand</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">
                  {predictions.demandData.filter(car => 
                    formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                  ).length} cars found
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Model</th>
                    <th className="text-left py-2">Demand Score</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Mileage</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.demandData
                    .filter(car => 
                      formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((car, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{formatCarModel(car)}</td>
                      <td className="py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${car.demand}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          car.status === 'available' ? 'bg-green-100 text-green-800' :
                          car.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="py-2">${car.price.toLocaleString()}</td>
                      <td className="py-2">{car.mileage.toLocaleString()} miles</td>
                      <td className="py-2">
                        <button
                          onClick={() => analyzeCarImage(car)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Damage Risk Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Top 5 Cars by Damage Risk</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">
                  {predictions.damageAnalysis.filter(car => 
                    formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                  ).length} cars found
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Model</th>
                    <th className="text-left py-2">Risk Score</th>
                    <th className="text-left py-2">Condition</th>
                    <th className="text-left py-2">Mileage</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.damageAnalysis
                    .filter(car => 
                      formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((car, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{formatCarModel(car)}</td>
                      <td className="py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-red-600 h-2.5 rounded-full" 
                            style={{ width: `${car.risk}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          car.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {car.condition}
                        </span>
                      </td>
                      <td className="py-2">{car.mileage.toLocaleString()} miles</td>
                      <td className="py-2">
                        <button
                          onClick={() => analyzeCarImage(car)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Analysis Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Image Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Car Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Select Car to Analyze</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search cars..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">
                      {predictions.damageAnalysis.filter(car => 
                        formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                      ).length} cars available
                    </span>
                  </div>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {predictions.damageAnalysis
                    .filter(car => 
                      formatCarModel(car).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((car, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedCar?.model === car.model 
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                          : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                      onClick={() => analyzeCarImage(car)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">{formatCarModel(car)}</h4>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              car.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {car.condition}
                            </span>
                            <span className="text-gray-600">
                              {car.mileage.toLocaleString()} miles
                            </span>
                            <span className="text-gray-600">
                              ${car.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {isAnalyzing && selectedCar?.model === car.model ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        ) : (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Results */}
              <div className="space-y-6">
                {analysisError && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{analysisError}</AlertDescription>
                  </Alert>
                )}

                {imageAnalysis && selectedCar && (
                  <div className="space-y-6">
                    {/* Car Preview */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Car Preview</h3>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {selectedCar.images && selectedCar.images[0] ? (
                          <img 
                            src={selectedCar.images[0]} 
                            alt={formatCarModel(selectedCar)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Damage Assessment */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Damage Assessment</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Overall Condition</span>
                          <span className="font-medium text-gray-900">{imageAnalysis.overallCondition}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Damage Score</span>
                          <span className="font-medium text-gray-900">{imageAnalysis.damageScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              parseFloat(imageAnalysis.damageScore) < 30 ? 'bg-green-500' :
                              parseFloat(imageAnalysis.damageScore) < 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${imageAnalysis.damageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Detected Objects */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Detected Objects</h3>
                      <div className="space-y-3">
                        {imageAnalysis.detectedObjects && imageAnalysis.detectedObjects.length > 0 ? (
                          imageAnalysis.detectedObjects.map((obj, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-900">{obj.name}</span>
                              <span className="text-sm text-gray-600">{obj.confidence}% confidence</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No objects detected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detected Labels */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Detected Labels</h3>
                      <div className="space-y-3">
                        {imageAnalysis.detectedLabels && imageAnalysis.detectedLabels.length > 0 ? (
                          imageAnalysis.detectedLabels.map((label, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-900">{label.name}</span>
                              <span className="text-sm text-gray-600">{label.confidence}% confidence</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No labels detected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                      <ul className="space-y-2">
                        {imageAnalysis.recommendedActions && imageAnalysis.recommendedActions.length > 0 ? (
                          imageAnalysis.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No recommended actions
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionPage;