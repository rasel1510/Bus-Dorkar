"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Phone, User, Bus, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/context/auth-context";

export function SignUpForm() {
  const router = useRouter();
  const { login } = useAuth();
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

  const handleCreateAccount = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

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

    const cleanPhone = formData.phone.replace(/\s+/g, "");
    if (!/^(?:\+8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid Bangladesh mobile number (e.g. 01712345678 or +8801712345678).");
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

    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setErrorMsg("Password must contain at least one letter and one number.");
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

      if (data.user) {
        login(data.user);
      }

      setSuccessMsg("Account created successfully! Redirecting to Home page...");

      // Smooth redirect to Home page
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "An unexpected network error occurred.");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Your <span className="gradient-text">Account</span>
          </h1>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole("PASSENGER")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === "PASSENGER"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="h-4 w-4" />
            Passenger
          </button>
          <button
            type="button"
            onClick={() => setRole("BUS_OPERATOR")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === "BUS_OPERATOR"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bus className="h-4 w-4" />
            Bus Operator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateAccount} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-xs text-slate-800 font-bold">
              Full Name *
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="h-4 w-4 text-teal-600" />
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
                className="pl-10 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-teal-600 focus:ring-teal-600/20 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs text-slate-800 font-bold">
                Email Address (Optional)
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="h-4 w-4 text-teal-600" />
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
                  className="pl-10 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-teal-600 focus:ring-teal-600/20 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs text-slate-800 font-bold">
                Mobile (+880) *
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-4 w-4 text-teal-600" />
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
                  className="pl-10 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-teal-600 focus:ring-teal-600/20 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="signup-password" className="text-xs text-slate-800 font-bold">
                Password *
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4 text-teal-600" />
                </div>
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars"
                  value={formData.password}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  required
                  className="pl-10 pr-9 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-teal-600 focus:ring-teal-600/20 text-xs sm:text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs text-slate-800 font-bold">
                Confirm Password *
              </Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4 text-teal-600" />
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
                  className="pl-10 h-11 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-teal-600 focus:ring-teal-600/20 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2 pt-0.5">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => {
                setErrorMsg(null);
                setFormData({ ...formData, acceptTerms: checked as boolean });
              }}
              className="mt-0.5 border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white"
            />
            <Label htmlFor="terms" className="text-xs text-slate-600 leading-normal font-medium cursor-pointer">
              I agree to Bus Dorkar's{" "}
              <Link href="/terms" className="text-teal-700 font-bold underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-teal-700 font-bold underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            id="signup-submit-btn"
            className="w-full h-11 gradient-teal hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-white" />
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
        <div className="text-center text-xs text-slate-600 font-medium pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-700 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
