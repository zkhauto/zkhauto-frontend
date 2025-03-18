import { BarChart, Bot, Calendar, Car, Home, Users } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const sidebarLinks = [
    {
      href: "/dashboard",
      icon: <Home className="h-6 w-6" />,
      text: "Dashboard",
    },
    {
      href: "/dashboard/carlisting",
      icon: <Car className="h-6 w-6" />,
      text: "Car Listing",
    },
    {
      href: "/dashboard/users",
      icon: <Users className="h-6 w-6" />,
      text: "Users",
    },
    {
      href: "/dashboard/bookings",
      icon: <Calendar className="h-6 w-6" />,
      text: "Bookings",
    },
    {
      href: "/dashboard/analytics",
      icon: <BarChart className="h-6 w-6" />,
      text: "Analytics",
    },
    {
      href: "/dashboard/messages",
      icon: <Bot className="h-6 w-6" />,
      text: "Users Messages",
    },
    {
      href: "/dashboard/chatbotlogs",
      icon: <Bot className="h-6 w-6" />,
      text: "Chatbot Logs",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 shadow-xl h-screen fixed border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ZKHAUTO Admin
        </h1>
      </div>
      <nav className="mt-2 flex flex-col h-[calc(100vh-120px)] justify-between">
        <ul className="space-y-1 px-3">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-800/50 text-slate-200 transition-colors duration-200"
              >
                {link.icon}
                <span className="ml-3">{link.text}</span>
              </Link>
            </li>
          ))}
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
