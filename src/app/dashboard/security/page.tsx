"use client";

import { useState } from "react";
import { Lock, ShieldCheck, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to update password.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Security & Privacy</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Manage your password and security settings
        </p>
      </div>

      {/* Password Change Form */}
      <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-teal-600" />
          <h2 className="text-sm font-extrabold text-slate-900">Change Password</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Current Password *</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">New Password *</Label>
            <Input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Confirm New Password *</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <CheckCircle2 className="h-4 w-4" /> Password updated successfully!
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="gradient-teal text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
            Update Password
          </Button>
        </div>
      </form>

      {/* Security Status Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Account Security Status
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Your account is secured with Argon2 password hashing and HttpOnly session cookie authentication with SameSite protection.
        </p>
      </div>
    </div>
  );
}
