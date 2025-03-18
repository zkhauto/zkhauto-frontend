"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../../ui/Sidebar";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/messages");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(
    (msg) =>
      msg.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.carModel?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">User Messages</h1>
            <p className="text-slate-400 mt-2">Manage all user messages</p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-slate-900/50 border-slate-800 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={handleSearch}
                className="pl-10 w-full bg-slate-900 border-slate-800 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/50 border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Car Model</TableHead>
                  <TableHead className="text-slate-400">
                    Preferred Date
                  </TableHead>
                  <TableHead className="text-slate-400">Topic</TableHead>
                  <TableHead className="text-slate-400">Message</TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow key={msg._id} className="border-slate-800">
                    <TableCell className="text-white">{msg.fullName}</TableCell>
                    <TableCell className="text-slate-400">
                      {msg.email}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {msg.carModel}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {msg.preferredDate
                        ? new Date(msg.preferredDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {msg.topic}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(msg._id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-medium text-white">1</span> to{" "}
                    <span className="font-medium text-white">
                      {filteredMessages.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {filteredMessages.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-white bg-slate-800"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
