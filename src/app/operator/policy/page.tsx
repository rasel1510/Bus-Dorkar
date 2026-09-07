"use client";

import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  DollarSign,
  Clock,
  ShieldCheck,
  Calculator,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function OperatorPolicyPage() {
  const [tier1Pct, setTier1Pct] = useState(90); // > 48h
  const [tier2Pct, setTier2Pct] = useState(70); // 24-48h
  const [tier3Pct, setTier3Pct] = useState(40); // 6-24h
  const [tier4Pct] = useState(0);              // < 6h fixed by BRTA
  const [processingFee, setProcessingFee] = useState(50);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulator state
  const [simTicketFare, setSimTicketFare] = useState(1800);
  const [simHoursBefore, setSimHoursBefore] = useState(30);

  const calculateSimRefund = () => {
    let refundPct = 0;
    if (simHoursBefore >= 48) refundPct = tier1Pct;
    else if (simHoursBefore >= 24) refundPct = tier2Pct;
    else if (simHoursBefore >= 6) refundPct = tier3Pct;
    else refundPct = tier4Pct;

    const grossRefund = Math.round((simTicketFare * refundPct) / 100);
    const netRefund = Math.max(0, grossRefund - processingFee);
    const operatorRetention = simTicketFare - netRefund;

    return { refundPct, grossRefund, netRefund, operatorRetention };
  };

  const simResult = calculateSimRefund();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cancellation & Refund Policy Architecture
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Aligned with Section 27 of Project Spec: Configurable refund percentage tiers and gateway terms.
          </p>
        </div>

        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono self-start sm:self-auto">
          Section 27 Compliant
        </Badge>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Cancellation policy updated and published live across all public booking channels.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Configuration Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Tiered Refund Matrix Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the refund percentage returned to passenger based on hours prior to scheduled departure.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Tier 1: > 48 Hours */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Tier 1: Greater than 48 Hours Before Trip
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Maximum refund window for early travel plan cancellations.
                  </span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono">
                  {tier1Pct}% Refund
                </Badge>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min={80}
                  max={95}
                  value={tier1Pct}
                  onChange={(e) => setTier1Pct(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="w-14 text-right font-mono font-bold text-xs text-slate-900">
                  {tier1Pct}%
                </span>
              </div>
            </div>

            {/* Tier 2: 24 - 48 Hours */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Tier 2: Between 24 and 48 Hours Before Trip
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mid-term cancellation deduction fee.
                  </span>
                </div>
                <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-mono">
                  {tier2Pct}% Refund
                </Badge>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min={50}
                  max={80}
                  value={tier2Pct}
                  onChange={(e) => setTier2Pct(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="w-14 text-right font-mono font-bold text-xs text-slate-900">
                  {tier2Pct}%
                </span>
              </div>
            </div>

            {/* Tier 3: 6 - 24 Hours */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Tier 3: Between 6 and 24 Hours Before Trip
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Late notice cancellation tier before seat freeze.
                  </span>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-mono">
                  {tier3Pct}% Refund
                </Badge>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min={20}
                  max={50}
                  value={tier3Pct}
                  onChange={(e) => setTier3Pct(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="w-14 text-right font-mono font-bold text-xs text-slate-900">
                  {tier3Pct}%
                </span>
              </div>
            </div>

            {/* Tier 4: < 6 Hours */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-rose-900 block">
                    Tier 4: Less than 6 Hours Before Trip
                  </span>
                  <span className="text-[11px] text-rose-600">
                    Non-refundable lockout window according to National Transport guidelines.
                  </span>
                </div>
                <Badge className="bg-rose-100 text-rose-800 border-rose-200 font-mono">
                  0% (No Refund)
                </Badge>
              </div>
            </div>

            {/* Processing Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Payment Gateway Settlement Fee (৳)
                </label>
                <Input
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  className="h-9 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Deducted to cover bank & mobile wallet interchange.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" className="gradient-teal text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-xs flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                Save & Apply Policy
              </Button>
            </div>
          </form>
        </div>

        {/* Live Simulator & Breakdown */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Refund Calculation Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Simulate exact payout and operator retention for any ticket fare.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Sample Ticket Fare (৳)</label>
                <Input
                  type="number"
                  value={simTicketFare}
                  onChange={(e) => setSimTicketFare(Number(e.target.value))}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Hours Before Departure</label>
                <Input
                  type="number"
                  value={simHoursBefore}
                  onChange={(e) => setSimHoursBefore(Number(e.target.value))}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Simulated Result Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Applicable Tier:</span>
                <span className="font-mono font-bold text-slate-800">
                  {simResult.refundPct}% Tier
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Gross Calculated:</span>
                <span className="font-mono text-slate-800">৳{simResult.grossRefund}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Interchange Fee:</span>
                <span className="font-mono text-slate-800">- ৳{processingFee}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-slate-900">
                <span>Net Passenger Refund:</span>
                <span className="text-emerald-700 font-mono text-sm">
                  ৳{simResult.netRefund}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pt-1">
                <span>Operator Retained:</span>
                <span className="font-mono font-bold text-teal-800">
                  ৳{simResult.operatorRetention}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-900 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Info className="w-4 h-4 text-blue-600" />
              Automated Gateway Processing
            </div>
            <p className="text-blue-800 leading-relaxed text-[11px]">
              When passenger clicks &ldquo;Cancel Booking&rdquo; on their dashboard, the system verifies timestamp server-side, calculates the exact deduction tier, and invokes the payment provider API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
