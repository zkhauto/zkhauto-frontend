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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "../../ui/Sidebar";

const AnalyticsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [testDriveData, setTestDriveData] = useState([]);
  const [filter, setFilter] = useState("last_30_days");

  // Fetch sales data (mock data for example)
  useEffect(() => {
    const fetchSalesData = async () => {
      // Replace with actual API call
      const data = [
        { name: "Volvo XC60", sales: 12 },
        { name: "Audi Q5", sales: 8 },
        { name: "BMW X3", sales: 15 },
        { name: "Tesla Model 3", sales: 20 },
      ];
      setSalesData(data);
    };

    const fetchTestDriveData = async () => {
      // Replace with actual API call
      const data = [
        { name: "Volvo XC60", testDrives: 25 },
        { name: "Audi Q5", testDrives: 18 },
        { name: "BMW X3", testDrives: 30 },
        { name: "Tesla Model 3", testDrives: 40 },
      ];
      setTestDriveData(data);
    };

    fetchSalesData();
    fetchTestDriveData();
  }, [filter]);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 mt-2">
              Insights into your car sales and customer behavior
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="last_7_days" className="hover:bg-slate-700">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="last_30_days" className="hover:bg-slate-700">
                  Last 30 Days
                </SelectItem>
                <SelectItem value="last_year" className="hover:bg-slate-700">
                  Last Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Total Cars Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">55</p>
                <p className="text-sm text-slate-400">Last 30 Days</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">€1,250,000</p>
                <p className="text-sm text-slate-400">Last 30 Days</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Test Drives Booked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">120</p>
                <p className="text-sm text-slate-400">Last 30 Days</p>
              </CardContent>
            </Card>
          </div>

          {/* Sales Chart */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Car Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={600} height={300} data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#CBD5E0" />
                <YAxis stroke="#CBD5E0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    border: "1px solid #4A5568",
                    borderRadius: "6px",
                  }}
                />
                <Legend wrapperStyle={{ color: "#CBD5E0" }} />
                <Bar dataKey="sales" fill="#4299E1" />
              </BarChart>
            </CardContent>
          </Card>

          {/* Test Drives Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Test Drives by Car Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={400} height={300}>
                <Pie
                  data={testDriveData}
                  dataKey="testDrives"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {testDriveData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D3748",
                    border: "1px solid #4A5568",
                    borderRadius: "6px",
                  }}
                />
                <Legend wrapperStyle={{ color: "#CBD5E0" }} />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
