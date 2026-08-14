"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Phone, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [role, setRole] = useState<"passenger" | "operator" | "staff">("passenger");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    const isRegistered = searchParams.get("registered") === "true";
    const phoneParam = searchParams.get("phone");
    if (isRegistered) {
      setSuccessMsg("Account created! Please enter your password to sign in.");
      if (phoneParam) {
        setFormData((prev) => ({ ...prev, identifier: decodeURIComponent(phoneParam) }));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          role: role.toUpperCase(),
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || data.error || "Invalid credentials.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Login successful! Redirecting...");
      setIsLoading(false);

      setTimeout(() => {
        if (data.user.role === "BUS_OPERATOR") {
          router.push("/operator/dashboard");
        } else if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Network error. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl gradient-border space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to manage your bookings & tickets
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="bg-bd-navy-900/80 p-1 rounded-xl border border-white/5 grid grid-cols-3 gap-1">
          {[
            { id: "passenger", label: "Passenger" },
            { id: "operator", label: "Operator" },
            { id: "staff", label: "Staff / Driver" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRole(tab.id as any)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                role === tab.id
                  ? "bg-bd-teal-500 text-bd-navy-950 shadow-md shadow-bd-teal-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method toggle: Phone vs Email */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-medium text-slate-300">Login with:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`font-semibold transition-colors ${
                  loginMethod === "phone" ? "text-bd-teal-400 underline" : "hover:text-white"
                }`}
              >
                Mobile (+880)
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`font-semibold transition-colors ${
                  loginMethod === "email" ? "text-bd-teal-400 underline" : "hover:text-white"
                }`}
              >
                Email Address
              </button>
            </div>
          </div>

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-xs text-slate-300 font-semibold">
              {loginMethod === "phone" ? "Mobile Number (+880)" : "Email Address"}
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                {loginMethod === "phone" ? (
                  <Phone className="h-4 w-4 text-bd-teal-400" />
                ) : (
                  <Mail className="h-4 w-4 text-bd-teal-400" />
                )}
              </div>
              <Input
                id="identifier"
                type={loginMethod === "phone" ? "tel" : "email"}
                placeholder={
                  loginMethod === "phone" ? "+880 1712-345678" : "name@example.com"
                }
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
                className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs text-slate-300 font-semibold">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-bd-teal-400 hover:text-bd-teal-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4 text-bd-teal-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="pl-10 pr-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, rememberMe: checked as boolean })
              }
              className="border-white/20 data-[state=checked]:bg-bd-teal-500 data-[state=checked]:text-bd-navy-950"
            />
            <Label htmlFor="remember" className="text-xs font-normal text-slate-400 cursor-pointer">
              Remember me on this device
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            id="login-submit-btn"
            className="w-full h-12 gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base rounded-xl shadow-lg shadow-bd-teal-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In as {role === "passenger" ? "Passenger" : role === "operator" ? "Operator" : "Staff"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer link */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-bd-teal-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
