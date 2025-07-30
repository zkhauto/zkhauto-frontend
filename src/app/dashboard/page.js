"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Package, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../ui/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [testDriveData, setTestDriveData] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [filter, setFilter] = useState("last_30_days");

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [soldCars, monthlyData] = await Promise.all([
          fetch("http://localhost:5000/api/cars/sold").then(res => res.json()),
          fetch("http://localhost:5000/api/cars/sales/monthly").then(res => res.json())
        ]);

        setSalesData(soldCars);
        setMonthlySales(monthlyData.map(item => ({
          month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
          sales: item.totalSales,
          count: item.count
        })));
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    const fetchTestDriveData = async () => {
      try {
        const data = await fetch("http://localhost:5000/api/test-drives/approve");
      const jsonData = await data.json();
      setTestDriveData(jsonData);
      } catch (error) {
        console.error("Error fetching test drive data:", error);
      }
    };

    fetchSalesData();
    fetchTestDriveData();
  }, [filter]);

  // total price calculation
  const totalPrice = salesData.reduce((acc, car) => acc + car.price, 0);
  const totalCarsSold = salesData.length;
  const totalTestDrives = testDriveData.length;

  return (
    <main>
      <Sidebar />
      <section className="min-h-screen bg-slate-950 p-6 ml-64">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customers Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Total Car Sold</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white">
                      {totalCarsSold}
                    </h2>
                    <span className="text-sm font-medium text-emerald-500"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Revenue Generated</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white">
                      {`€${totalPrice.toLocaleString()}`}
                    </h2>
                    <span className="text-sm font-medium text-red-500"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Drives Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Test Drives Booked</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white">
                      {totalTestDrives}
                    </h2>
                    <span className="text-sm font-medium text-red-500"></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Sales Chart */}
          <Card className="bg-slate-900/50 border-slate-800 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-white">
                  Monthly Sales
                </h3>
                <p className="text-sm text-slate-400">
                  Sales performance over the last 12 months
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <TrendingUp className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlySales}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(value) => `€${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        color: '#e2e8f0'
                      }}
                      formatter={(value) => [`€${value.toLocaleString()}`, 'Sales']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
