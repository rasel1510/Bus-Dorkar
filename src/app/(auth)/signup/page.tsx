"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Phone, User, Bus, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PASSENGER" | "BUS_OPERATOR">("PASSENGER");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Calculate simple password strength (0 to 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passStrength = calculateStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.acceptTerms) {
      alert("Please accept the Terms & Conditions.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Demo Sign Up Triggered for ${formData.fullName} as ${role}`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl gradient-border space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your <span className="gradient-text">Account</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Join Bus Dorkar for instant inter-district ticketing across Bangladesh
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-bd-navy-900/80 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setRole("PASSENGER")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === "PASSENGER"
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
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === "BUS_OPERATOR"
                ? "bg-bd-teal-500 text-bd-navy-950 shadow-md shadow-bd-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bus className="h-4 w-4" />
            Bus Operator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs text-slate-300 font-semibold">
              Full Name
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
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                Email Address
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs text-slate-300 font-semibold">
                Mobile (+880)
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="pl-10 h-12 bg-bd-navy-900/80 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-bd-teal-500 focus:ring-bd-teal-500/20"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-password" className="text-xs text-slate-300 font-semibold">
              Password
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

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-all ${
                        step <= passStrength
                          ? passStrength <= 1
                            ? "bg-red-500"
                            : passStrength === 2
                            ? "bg-amber-500"
                            : passStrength === 3
                            ? "bg-bd-teal-400"
                            : "bg-bd-emerald-400"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {passStrength <= 1
                    ? "Weak"
                    : passStrength === 2
                    ? "Medium"
                    : passStrength === 3
                    ? "Strong"
                    : "Very Strong"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs text-slate-300 font-semibold">
              Confirm Password
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
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptTerms: checked as boolean })
              }
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
            className="w-full h-12 gradient-teal hover:opacity-95 text-bd-navy-950 font-bold text-base rounded-xl shadow-lg shadow-bd-teal-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Creating Account...</span>
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

