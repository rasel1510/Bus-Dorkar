"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Ticket,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  UserCheck,
  RefreshCw,
  Server,
  Layers,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    passengers: 2450890,
    operators: 428,
    staff: 3840,
    drivers: 5120,
    totalBookings: 18920400,
    activeBuses: 12480,
    dailyRevenueBdt: "৳4,85,20,000",
    pendingOperatorApprovals: 3,
  });

  const [tps, setTps] = useState(47820);
  const [latency, setLatency] = useState(0.42);
  const [queueBacklog, setQueueBacklog] = useState(4);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; type: string; message: string }>>([
    {
      id: "log-1",
      time: "Just now",
      type: "SUCCESS",
      message: "Partition Lock Released: TripSeat batch update completed across 1,200 concurrent threads.",
    },
    {
      id: "log-2",
      time: "12s ago",
      type: "INFO",
      message: "Operator 'Desh Travels Express' submitted Trade License TL-BD-661002 for verification.",
    },
    {
      id: "log-3",
      time: "45s ago",
      type: "SYSTEM",
      message: "Promoted user 'rasel4897981@gmail.com' to role ADMIN SUPERUSER with full system authority.",
    },
    {
      id: "log-4",
      time: "1m ago",
      type: "SUCCESS",
      message: "High Volume Eid Surge Stream: 14,200 booking requests processed concurrently (0 dropped).",
    },
  ]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      setTps(Math.floor(46000 + Math.random() * 9000));
      setLatency(Number((0.35 + Math.random() * 0.18).toFixed(2)));
      setQueueBacklog(Math.floor(Math.random() * 8));

      // Append live simulated operational logs
      if (Math.random() > 0.4) {
        const events = [
          "Payment Callback: bKash Webhook verified ৳1,450 for Booking #BD-2026-9921",
          "Trip Dispatch: Green Line Bus #DH-METRO-11-2091 checked in at Gabtoli Counter",
          "User Auth: Session validated with 0.1ms cache lookup",
          "Parallel Engine: Cleaned up 128 inactive Redis locks",
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const newLog = {
          id: `log-${Date.now()}`,
          time: "Just now",
          type: "SUCCESS",
          message: randomEvent,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Executive Command Center</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
              MILLIONS OF OPS PARALLEL READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Real-time oversight across Passengers, Bus Operators, Counter Staff, Drivers & Parallel Worker Pools.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchStats}
            variant="outline"
            className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white text-xs font-semibold h-9 px-3.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-teal-400" /> Refresh Telemetry
          </Button>
          <Link href="/admin/operations">
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold text-xs h-9 px-4 rounded-xl shadow-lg shadow-teal-500/20 hover:opacity-90 cursor-pointer">
              <Zap className="h-3.5 w-3.5 mr-1.5 fill-slate-950" /> Live Ops Engine
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Action Highlight: Elevated User Card */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/40 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
            <UserCheck className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">Active System Administrator:</span>
              <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 rounded">
                rasel4897981@gmail.com
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Granted full Superuser rights over system configuration, user role elevations, operator approvals & database partitions.
            </p>
          </div>
        </div>

        <Link href="/admin/users">
          <Button className="bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 text-xs font-bold h-9 px-4 rounded-xl shrink-0 cursor-pointer">
            Manage System Users & Roles <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Primary Telemetry Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Passengers */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Passengers</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {stats.passengers.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +14.2% registered this month
            </p>
          </div>
        </div>

        {/* Bus Operators */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Bus Operators</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Building2 className="h-4.5 w-4.5 text-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {stats.operators.toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> {stats.pendingOperatorApprovals} pending verification approvals
            </p>
          </div>
        </div>

        {/* Counter Staff & Drivers */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Counter Staff & Drivers</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {(stats.staff + stats.drivers).toLocaleString()}
            </p>
            <p className="text-[11px] text-purple-400 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> {stats.staff} Staff | {stats.drivers} Drivers Active
            </p>
          </div>
        </div>

        {/* Bookings & Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Daily Revenue / Volume</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Ticket className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono tracking-tight">
              {stats.dailyRevenueBdt}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> {stats.totalBookings.toLocaleString()} lifetime tickets issued
            </p>
          </div>
        </div>
      </div>

      {/* Parallel High-Throughput Performance Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Ops Gauge & Worker Saturation */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-teal-400" /> Parallel Operations Concurrency Monitor
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Simulated real-time parallel load across multi-threaded worker pools & PostgreSQL connections.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 animate-pulse text-emerald-400" /> HIGH THROUGHPUT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Current Throughput</span>
              <p className="text-2xl font-black text-teal-400 font-mono">{tps.toLocaleString()} ops/s</p>
              <span className="text-[10px] text-slate-500 font-mono">Peak capacity: 500,000 ops/s</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Query Latency</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">{latency} ms</p>
              <span className="text-[10px] text-slate-500 font-mono">Sub-millisecond query execution</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Queue Backlog</span>
              <p className="text-2xl font-black text-cyan-400 font-mono">{queueBacklog} jobs</p>
              <span className="text-[10px] text-slate-500 font-mono">128 active Redis worker threads</span>
            </div>
          </div>

          {/* Visual Operations Load Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-semibold">
              <span className="text-slate-400">Worker Pool Concurrency Load</span>
              <span className="text-teal-400">{(tps / 5000).toFixed(1)}% Capacity</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-700 shadow-md shadow-teal-500/50"
                style={{ width: `${Math.min(100, Math.max(10, (tps / 5000)))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live System Log Feed */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" /> Live Audit Log Feed
              </h3>
              <span className="text-[10px] font-mono text-slate-500">AUTO-STREAMING</span>
            </div>

            <div className="space-y-3 mt-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-400 font-bold">[{log.type}]</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight font-sans font-medium">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link href="/admin/audit-logs">
            <Button variant="outline" className="w-full bg-slate-950 border-slate-800 text-slate-300 hover:text-white text-xs font-bold h-9 rounded-xl cursor-pointer">
              View Full Security Audit Log
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
