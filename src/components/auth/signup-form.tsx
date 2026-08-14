"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Phone, User, Bus, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PASSENGER" | "BUS_OPERATOR">("PASSENGER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg("Please enter your Bangladesh mobile number.");
      return;
    }

    if (!formData.password) {
      setErrorMsg("Please enter a password.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match. Please check again.");
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMsg("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: role,
          acceptTerms: formData.acceptTerms,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting to Sign In...");
      setIsLoading(false);

      // Redirect user to Login page with their phone pre-filled
      setTimeout(() => {
        router.push(`/login?registered=true&phone=${encodeURIComponent(formData.phone)}`);
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "An unexpected network error occurred.");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl gradient-border space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your <span className="gradient-text">Account</span>
          </h1>

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
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-bd-navy-900/80 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setRole("PASSENGER")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${role === "PASSENGER"
                ? "bg-bd-teal-500 text-bd-navy-950 shadow-md shadow-bd-teal-500/20"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <User className="h-4 w-4" />
            Passenger
          </button>
          <button
            type="button"
            onClick={() => setRole("BUS_OPERATOR")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${role === "BUS_OPERATOR"
                ? "bg-bd-teal-500 text-bd-navy-950 shadow-md shadow-bd-teal-500/20"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <Bus className="h-4 w-4" />
            Bus Operator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateAccount} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs text-slate-300 font-semibold">
              Full Name *
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="h-4 w-4 text-bd-teal-400" />
              </div>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Tanvir Hossain"
                value={formData.fullName}
                onChange={(e) => {
                  setErrorMsg(null);
                  setFormData({ ...formData, fullName: e.target.value });
                }}
                required
                className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-300 font-semibold">
                Email Address (Optional)
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="h-4 w-4 text-bd-teal-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="tanvir@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs text-slate-300 font-semibold">
                Mobile (+880) *
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-4 w-4 text-bd-teal-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01712345678"
                  value={formData.phone}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  required
                  className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs text-slate-300 font-semibold">
              Password *
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4 text-bd-teal-400" />
              </div>
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => {
                  setErrorMsg(null);
                  setFormData({ ...formData, password: e.target.value });
                }}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs text-slate-300 font-semibold">
              Confirm Password *
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4 text-bd-teal-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setErrorMsg(null);
                  setFormData({ ...formData, confirmPassword: e.target.value });
                }}
                required
                className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => {
                setErrorMsg(null);
                setFormData({ ...formData, acceptTerms: checked as boolean });
              }}
              className="mt-0.5 border-white/20 data-[state=checked]:bg-bd-teal-500 data-[state=checked]:text-bd-navy-950"
            />
            <Label htmlFor="terms" className="text-xs text-slate-400 leading-normal cursor-pointer">
              I agree to Bus Dorkar's{" "}
              <Link href="/terms" className="text-bd-teal-400 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-bd-teal-400 underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            id="signup-submit-btn"
            className="w-full h-12 gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base rounded-xl shadow-lg shadow-bd-teal-500/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-bd-navy-950" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create {role === "PASSENGER" ? "Passenger" : "Operator"} Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer link */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-bd-teal-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
