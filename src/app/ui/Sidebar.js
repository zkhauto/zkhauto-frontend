import Link from "next/link";
import { Users, Car, Calendar, BarChart, Bot, Home } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 shadow-xl h-screen fixed border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ZKHAUTO Admin
        </h1>
      </div>
      <nav className="mt-2 flex flex-col h-[calc(100vh-120px)] justify-between">
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

        <div className="px-3 mb-6">
          <Link
            href="/"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-3 text-slate-400" />
            Back to Home
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
