"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Bus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MailCheck,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth-context";

export function SignUpForm() {
  const router = useRouter();
  const { login } = useAuth();

  // Wizard Step: 1 = Form Input, 2 = Email OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"PASSENGER" | "BUS_OPERATOR">("PASSENGER");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 60-second countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Client Validation & Send OTP
  const handleInitiateSignup = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // Form Validations
    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address for OTP verification.");
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
      // Dispatch OTP to email
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || data.error || "Failed to send verification email.");
        setIsLoading(false);
        return;
      }

      setDemoCode(data.demoOtp || "489791");
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
      setSuccessMsg(`A 6-digit OTP code has been sent to ${formData.email}`);

      // Auto-focus first digit input box
      setTimeout(() => {
        digitRefs[0].current?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDemoCode(data.demoOtp || "489791");
        setResendTimer(60);
        setCanResend(false);
        setSuccessMsg(`New OTP sent to ${formData.email}!`);
      } else {
        setErrorMsg(data.message || "Failed to resend OTP.");
      }
    } catch {
      setErrorMsg("Failed to resend OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Digit Keying in OTP boxes
  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);

    // Handle Paste of complete 6-digit code
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newDigits = [...otpDigits];
      pastedDigits.forEach((d, i) => {
        newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      if (pastedDigits.length === 6) {
        digitRefs[5].current?.focus();
      }
      return;
    }

    const cleanVal = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance focus to next digit box
    if (cleanVal && index < 5) {
      digitRefs[index + 1].current?.focus();
    }
  };

  // Handle Backspace Key Navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    }
  };

  // Step 2: Verify OTP & Complete Account Creation
  const handleVerifyOtpAndCreateAccount = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join("");

    if (fullOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg(null);

    try {
      // 1. Verify OTP
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: fullOtp,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setErrorMsg(verifyData.message || verifyData.error || "Invalid OTP code.");
        setIsVerifyingOtp(false);
        return;
      }

      // 2. Finalize Account Creation
      const signupRes = await fetch("/api/auth/signup", {
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

      const signupData = await signupRes.json();

      if (!signupRes.ok || !signupData.success) {
        setErrorMsg(signupData.message || signupData.error || "Account creation failed.");
        setIsVerifyingOtp(false);
        return;
      }

      if (signupData.user) {
        login(signupData.user);
      }

      setSuccessMsg("Email verified successfully! Creating account...");

      // Smooth redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setErrorMsg(err.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xl space-y-4">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl gradient-teal text-white flex items-center justify-center font-extrabold text-xs">
              {step === 1 ? "1/2" : "2/2"}
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">
                {step === 1 ? "Passenger Registration" : "Email Verification"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {step === 1 ? "Step 1: Account Information" : "Step 2: 6-Digit Email OTP"}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
            {role === "PASSENGER" ? "PASSENGER MODE" : "OPERATOR MODE"}
          </span>
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

        {/* STEP 1: Registration Inputs */}
        {step === 1 && (
          <>
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
                Passenger Account
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
            <form onSubmit={handleInitiateSignup} className="space-y-3">
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
                {/* Email (Required for OTP) */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-slate-800 font-bold">
                    Email Address * <span className="text-[10px] text-teal-700 font-normal">(Receives OTP)</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-4 w-4 text-teal-600" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. tanvir@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setErrorMsg(null);
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      required
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
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Create {role === "PASSENGER" ? "Passenger" : "Operator"} Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}

        {/* STEP 2: Email OTP Verification Screen */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
                <MailCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Verify Your Email Address</h2>
              <p className="text-xs text-slate-500 font-medium">
                We sent a 6-digit verification code to{" "}
                <strong className="text-slate-900 font-bold">{formData.email}</strong>
              </p>
            </div>

            {/* Test Demo OTP Banner */}
            {demoCode && (
              <div className="p-3 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl border border-teal-500/40 text-center space-y-1 shadow-lg">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-400">
                  <Sparkles className="h-3.5 w-3.5" /> Email Verification OTP Code
                </div>
                <p className="text-2xl font-black font-mono tracking-widest text-teal-300">
                  {demoCode}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Enter this 6-digit code below to complete account registration.
                </p>
              </div>
            )}

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOtpAndCreateAccount} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 text-center block">
                  Enter 6-Digit Code *
                </Label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={digitRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 sm:w-12 h-12 sm:h-13 bg-slate-50 border-2 border-slate-300 text-slate-900 font-mono font-black text-xl text-center rounded-xl focus:border-teal-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend Option */}
              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Edit Email / Details
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-teal-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Resend Code
                  </button>
                ) : (
                  <span className="text-slate-400 font-mono text-[11px]">
                    Resend in <strong className="text-slate-700">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              {/* Verify & Create Account Button */}
              <Button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full h-11 gradient-teal hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Verifying Code & Creating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Verify & Complete Registration</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

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
