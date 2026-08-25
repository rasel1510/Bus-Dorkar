"use client";

import { useState } from "react";
import { ShieldCheck, Lock, AlertTriangle, Terminal, RefreshCw, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
}

const mockAuditLogs: AuditItem[] = [
  {
    id: "aud-001",
    timestamp: "2026-08-21 17:58:11",
    actor: "SYSTEM_AUTO_SEED",
    action: "ROLE_ELEVATION",
    resource: "User: admin@busdorkar.com -> ADMIN SUPERUSER",
    ip: "127.0.0.1",
    severity: "CRITICAL",
  },
  {
    id: "aud-002",
    timestamp: "2026-08-21 17:55:04",
    actor: "Admin (admin@busdorkar.com)",
    action: "OPERATOR_APPROVAL",
    resource: "Operator: Green Line Paribahan (Status: APPROVED)",
    ip: "103.220.10.4",
    severity: "SUCCESS",
  },
  {
    id: "aud-003",
    timestamp: "2026-08-21 17:42:19",
    actor: "REDIS_SHARD_ENGINE",
    action: "LOCK_CLEANUP",
    resource: "Seat reservation lock released for Trip #TRIP-9921",
    ip: "10.0.4.12",
    severity: "INFO",
  },
  {
    id: "aud-004",
    timestamp: "2026-08-21 17:30:00",
    actor: "RATE_LIMITER",
    action: "THROTTLE_TRIGGERED",
    resource: "IP 180.211.90.12 exceeded 1,000 req/sec limit during Eid sale",
    ip: "180.211.90.12",
    severity: "WARNING",
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditItem[]>(mockAuditLogs);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase())
  );

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-purple-50 text-purple-800 border-purple-200 font-bold";
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
      case "WARNING":
        return "bg-amber-50 text-amber-800 border-amber-200 font-bold";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200 font-bold";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-teal-600" /> Security Event Inspector & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Immutable system logs recording administrative privilege changes, operator approvals, and thread concurrency state.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end border-b border-slate-200 pb-4">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-72 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-3 rounded-xl focus:outline-none focus:border-teal-600 font-medium"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Resource Details</th>
                <th className="px-5 py-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-slate-500 font-medium whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityStyle(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">{log.actor}</td>
                  <td className="px-5 py-4 font-bold text-teal-700">{log.action}</td>
                  <td className="px-5 py-4 text-slate-800 font-sans font-medium">{log.resource}</td>
                  <td className="px-5 py-4 text-right text-slate-400 font-medium">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
