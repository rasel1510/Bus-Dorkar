"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Server,
  Database,
  Layers,
  Play,
  Pause,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Flame,
  Radio,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParallelOperationsPage() {
  const [isSurgeSimulated, setIsSurgeSimulated] = useState(false);
  const [opsPerSec, setOpsPerSec] = useState(48200);
  const [activeThreads, setActiveThreads] = useState(128);
  const [lockWaitMs, setLockWaitMs] = useState(0.42);
  const [circuitBreakerActive, setCircuitBreakerActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSurgeSimulated) {
        setOpsPerSec(Math.floor(280000 + Math.random() * 90000));
        setActiveThreads(512);
        setLockWaitMs(Number((1.2 + Math.random() * 0.8).toFixed(2)));
      } else {
        setOpsPerSec(Math.floor(45000 + Math.random() * 8000));
        setActiveThreads(128);
        setLockWaitMs(Number((0.35 + Math.random() * 0.25).toFixed(2)));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isSurgeSimulated]);

  const toggleSurgeSimulation = () => {
    setIsSurgeSimulated(!isSurgeSimulated);
  };

  const toggleCircuitBreaker = () => {
    setCircuitBreakerActive(!circuitBreakerActive);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Cpu className="h-6 w-6 text-teal-400" /> High-Throughput Parallel Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              DISTRIBUTED QUEUE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Handles millions of parallel passenger bookings, counter check-ins & operator route updates concurrently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleSurgeSimulation}
            className={`h-9 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isSurgeSimulated
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/30 animate-pulse"
                : "bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30"
            }`}
          >
            <Flame className="h-4 w-4 mr-1.5" />
            {isSurgeSimulated ? "Simulating Eid High Surge (350K TPS)" : "Trigger Peak Surge Test"}
          </Button>

          <Button
            onClick={toggleCircuitBreaker}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              circuitBreakerActive
                ? "bg-red-500 text-white font-black animate-pulse"
                : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5 mr-1.5 text-red-400" />
            {circuitBreakerActive ? "Circuit Breaker ENGAGED" : "Emergency Throttle"}
          </Button>
        </div>
      </div>

      {circuitBreakerActive && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            <span>TRAFFIC THROTTLE ACTIVE: Concurrency restricted to 5,000 req/sec to prioritize seat booking lock stability.</span>
          </div>
          <Button onClick={toggleCircuitBreaker} size="sm" className="bg-red-500 text-white font-bold text-[10px]">
            Disengage
          </Button>
        </div>
      )}

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">Active Parallel TPS</span>
          <p className="text-3xl font-black text-teal-400 font-mono tracking-tight">{opsPerSec.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 font-mono">Operations per second</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">Worker Pool Allocation</span>
          <p className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{activeThreads} Nodes</p>
          <p className="text-[10px] text-slate-500 font-mono">Multi-core worker threads active</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">Lock Wait Overhead</span>
          <p className="text-3xl font-black text-cyan-400 font-mono tracking-tight">{lockWaitMs} ms</p>
          <p className="text-[10px] text-slate-500 font-mono">Optimistic seat lock validation</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold">Partition Integrity</span>
          <p className="text-3xl font-black text-purple-400 font-mono tracking-tight">100.0%</p>
          <p className="text-[10px] text-slate-500 font-mono">Zero race conditions detected</p>
        </div>
      </div>

      {/* Cluster Worker Partition Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-400" /> Active Worker Cluster Partitions
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Real-time state of partitioned ticket processing pipelines across Bangladesh divisions.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-lg">
            Redis Cluster Mode: SHARDED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { region: "Dhaka Central Division", shard: "shard-dhaka-01", load: "78%", status: "HEALTHY" },
            { region: "Chittagong Corridor", shard: "shard-ctg-02", load: "62%", status: "HEALTHY" },
            { region: "Sylhet Express Line", shard: "shard-sylhet-03", load: "45%", status: "HEALTHY" },
            { region: "Rajshahi & Rangpur Shard", shard: "shard-north-04", load: "84%", status: "HEALTHY" },
          ].map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{p.region}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Shard: {p.shard}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Shard Capacity</span>
                  <span className="text-teal-400 font-bold">{p.load}</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full"
                    style={{ width: p.load }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
