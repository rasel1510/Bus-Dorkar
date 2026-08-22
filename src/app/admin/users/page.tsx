"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Ticket,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface UserRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: "PASSENGER" | "BUS_OPERATOR" | "COUNTER_STAFF" | "DRIVER" | "ADMIN";
  status?: string;
  createdAt?: string;
}

const roleTabs = [
  { key: "ALL", label: "All Accounts" },
  { key: "PASSENGER", label: "Passengers" },
  { key: "BUS_OPERATOR", label: "Bus Operators" },
  { key: "COUNTER_STAFF", label: "Counter Staff" },
  { key: "DRIVER", label: "Drivers" },
  { key: "ADMIN", label: "System Admins" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Promote custom user state
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteRole, setPromoteRole] = useState<any>("ADMIN");
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/users?role=${selectedRole}&query=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const updateUserRole = async (userId: string, email: string | null, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`User role updated to ${newRole}`);
        fetchUsers();
        setTimeout(() => setActionSuccess(""), 4000);
      }
    } catch {
      alert("Failed to update user role");
    }
  };

  const handleCustomPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail) return;
    setPromoting(true);
    try {
      await updateUserRole("", promoteEmail, promoteRole);
      setPromoteEmail("");
    } finally {
      setPromoting(false);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40 font-black";
      case "BUS_OPERATOR":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "COUNTER_STAFF":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "DRIVER":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-400" /> User Directory & RBAC
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Manage system roles, elevate permissions, and administer Passengers, Operators, Staff & Admins.
          </p>
        </div>

        <Button
          onClick={fetchUsers}
          variant="outline"
          className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white text-xs font-semibold h-9 px-3 rounded-xl cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-teal-400" /> Refresh Directory
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {actionSuccess}
        </div>
      )}

      {/* Role Elevation Quick Box for rasel4897981@gmail.com */}
      <div className="bg-slate-900/90 border border-teal-500/30 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <h2 className="text-sm font-extrabold text-white">Instant Role Promotion Tool</h2>
        </div>
        <p className="text-xs text-slate-400">
          Enter any registered email address (e.g. <strong className="text-teal-300">rasel4897981@gmail.com</strong>) to immediately assign or modify their system role.
        </p>

        <form onSubmit={handleCustomPromotion} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Input
            type="email"
            placeholder="Enter user email (e.g. rasel4897981@gmail.com)"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            required
            className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-200 rounded-xl flex-1"
          />

          <select
            value={promoteRole}
            onChange={(e) => setPromoteRole(e.target.value)}
            className="h-10 bg-slate-950 border border-slate-800 text-xs font-bold text-teal-400 rounded-xl px-3 focus:outline-none"
          >
            <option value="ADMIN">ADMIN SUPERUSER</option>
            <option value="BUS_OPERATOR">BUS_OPERATOR</option>
            <option value="COUNTER_STAFF">COUNTER_STAFF</option>
            <option value="DRIVER">DRIVER</option>
            <option value="PASSENGER">PASSENGER</option>
          </select>

          <Button
            type="submit"
            disabled={promoting}
            className="h-10 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs px-5 rounded-xl shadow-md cursor-pointer shrink-0"
          >
            {promoting ? "Promoting..." : "Assign Role"}
          </Button>

          <Button
            type="button"
            onClick={() => updateUserRole("", "rasel4897981@gmail.com", "ADMIN")}
            className="h-10 bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 font-bold text-xs px-4 rounded-xl cursor-pointer shrink-0"
          >
            Make rasel4897981@gmail.com Admin
          </Button>
        </form>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedRole(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRole === tab.key
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-extrabold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 pl-9 pr-3 rounded-xl focus:outline-none focus:border-teal-500/50"
            />
          </div>
          <Button type="submit" variant="outline" className="h-9 px-3 bg-slate-900 border-slate-800 text-xs text-slate-300">
            Filter
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Current Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-300">
                      <div>{u.email || <span className="text-slate-500">No Email</span>}</div>
                      <div className="text-[11px] text-slate-400">{u.phone}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${getRoleBadgeStyle(u.role)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                        ACTIVE
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" />
                          }
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 text-xs w-48 p-1">
                          <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase font-mono">Change Role</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateUserRole(u.id, u.email, "ADMIN")} className="hover:bg-slate-800 cursor-pointer text-teal-300 font-bold">
                            Elevate to ADMIN
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(u.id, u.email, "BUS_OPERATOR")} className="hover:bg-slate-800 cursor-pointer text-amber-300">
                            Set as BUS_OPERATOR
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(u.id, u.email, "COUNTER_STAFF")} className="hover:bg-slate-800 cursor-pointer text-blue-300">
                            Set as COUNTER_STAFF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(u.id, u.email, "DRIVER")} className="hover:bg-slate-800 cursor-pointer text-purple-300">
                            Set as DRIVER
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(u.id, u.email, "PASSENGER")} className="hover:bg-slate-800 cursor-pointer">
                            Set as PASSENGER
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
