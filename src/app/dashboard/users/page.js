"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Sidebar from "../../ui/Sidebar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentAuthUser } = useAuth();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setCurrentUser({
      firstName: "",
      lastName: "",
      email: "",
      displayName: "",
      role: "user",
      password: "",
      profilePhoto: "/img/user_img.png",
    });
    setIsEditing(false);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({
      ...user,
      password: "", // Don't show existing password
    });
    setIsEditing(true);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentUser) {
      try {
        const response = await fetch(
          `http://localhost:5000/users/${currentUser._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers(users.filter((user) => user._id !== currentUser._id));
        setIsDeleteModalOpen(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing user
        const response = await fetch(
          `http://localhost:5000/users/${currentUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
              displayName: currentUser.displayName,
              role: currentUser.role,
              ...(currentUser.password && { password: currentUser.password }),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
      } else {
        // Add new user
        const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            displayName:
              currentUser.displayName ||
              `${currentUser.firstName} ${currentUser.lastName}`,
            password: currentUser.password,
            role: currentUser.role,
            profilePhoto: currentUser.profilePhoto,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const newUser = await response.json();
        setUsers([...users, newUser]);
      }

      setIsAddEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400 mt-2">
              Manage user accounts and permissions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-slate-900/50 border-slate-800 p-4 rounded-lg">
            <div className="relative w-full sm:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className="pl-10 w-full bg-slate-900 border-slate-800 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              onClick={openAddModal}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </div>

          <div className="bg-slate-900/50 border-slate-800 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Location</TableHead>
                  <TableHead className="text-slate-400">Join Date</TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-4">
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profilePhoto || "/img/user_img.png"}
                            alt={`${user.firstName || ""} ${
                              user.lastName || ""
                            }`}
                            width={40}
                            height={40}
                            priority
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-400">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className={
                          user.role === "admin"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-blue-500/10 text-blue-500"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-400">
                        {user.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-400">
                        {user.joinDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(user)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(user)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Showing <span className="font-medium text-white">1</span> to{" "}
                    <span className="font-medium text-white">
                      {filteredUsers.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {filteredUsers.length}
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

      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditing ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEdit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-400">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={currentUser?.firstName || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-slate-400">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={currentUser?.lastName || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="email" className="text-slate-400">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentUser?.email || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="displayName" className="text-slate-400">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={currentUser?.displayName || ""}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              {!isEditing && (
                <div className="col-span-2">
                  <Label htmlFor="password" className="text-slate-400">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={currentUser?.password || ""}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required={!isEditing}
                  />
                </div>
              )}

              {isEditing && (
                <div className="col-span-2">
                  <Label htmlFor="password" className="text-slate-400">
                    New Password (leave blank to keep current)
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={currentUser?.password || ""}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="role" className="text-slate-400">
                  Role
                </Label>
                <Select
                  name="role"
                  value={currentUser?.role || "user"}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "role", value } })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEditModalOpen(false)}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                {isEditing ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete {currentUser?.firstName}{" "}
              {currentUser?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-slate-700 text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
