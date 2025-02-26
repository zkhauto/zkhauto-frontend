import {
  Users,
  Package,
  MoreVertical,
  Car,
  Calendar,
  BarChart,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {
  return (
    <main>
      <aside className="w-64 bg-slate-900 shadow-xl h-screen fixed border-r border-slate-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ZKHAUTO Admin
          </h1>
        </div>
        <nav className="mt-2">
          <ul className="space-y-1 px-3">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <Users className="w-5 h-5 mr-3 text-slate-400" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/carlisting"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <Car className="w-5 h-5 mr-3 text-slate-400" />
                Car Listing
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <Users className="w-5 h-5 mr-3 text-slate-400" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/bookings"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                Bookings
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/analytics"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <BarChart className="w-5 h-5 mr-3 text-slate-400" />
                Analytics
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/chatbotlogs"
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                <Bot className="w-5 h-5 mr-3 text-slate-400" />
                Chatbot Logs
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="min-h-screen bg-slate-950 p-6 ml-64">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customers Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Customers</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white">3,782</h2>
                    <span className="text-sm font-medium text-emerald-500">
                      ↑ 11.01%
                    </span>
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
                  <p className="text-sm text-slate-400">Bookings</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-white">5,359</h2>
                    <span className="text-sm font-medium text-red-500">
                      ↓ 9.05%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Target Card */}
          <Card className="bg-slate-900/50 border-slate-800 lg:row-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-white">
                  Monthly Target
                </h3>
                <p className="text-sm text-slate-400">
                  Target you&apos;ve set for each month
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray="282.7"
                      strokeDashoffset="69.2"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      75.55%
                    </span>
                    <span className="text-sm font-medium text-emerald-500">
                      +10%
                    </span>
                  </div>
                </div>
                <p className="text-center text-slate-400">
                  You earn $3287 today, it&apos;s higher than last month. Keep
                  up your good work!
                </p>
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Target</p>
                    <p className="text-lg font-semibold text-white">$20K ↓</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Revenue</p>
                    <p className="text-lg font-semibold text-white">$20K ↑</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Today</p>
                    <p className="text-lg font-semibold text-white">$20K ↑</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Sales Chart */}
          <Card className="bg-slate-900/50 border-slate-800 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-xl font-medium text-white">Monthly Sales</h3>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end gap-2 relative">
                {[
                  { month: "Jan", value: 150, change: "+12%" },
                  { month: "Feb", value: 380, change: "+25%" },
                  { month: "Mar", value: 180, change: "-15%" },
                  { month: "Apr", value: 280, change: "+20%" },
                  { month: "May", value: 170, change: "-8%" },
                  { month: "Jun", value: 170, change: "0%" },
                  { month: "Jul", value: 270, change: "+15%" },
                  { month: "Aug", value: 90, change: "-30%" },
                  { month: "Sep", value: 190, change: "+25%" },
                  { month: "Oct", value: 380, change: "+28%" },
                  { month: "Nov", value: 260, change: "-5%" },
                  { month: "Dec", value: 100, change: "-20%" },
                ].map((data, i) => (
                  <div
                    key={i}
                    className="group relative flex items-end w-full h-full"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-blue-600 rounded-t transition-all duration-200 hover:bg-blue-500 cursor-pointer"
                      style={{ height: `${(data.value / 380) * 100}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        <div className="font-medium">${data.value}K</div>
                        <div
                          className={`text-xs ${
                            data.change.startsWith("+")
                              ? "text-emerald-400"
                              : data.change === "0%"
                              ? "text-slate-400"
                              : "text-red-400"
                          }`}
                        >
                          {data.change}
                        </div>
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
