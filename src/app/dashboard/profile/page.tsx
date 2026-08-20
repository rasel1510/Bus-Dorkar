"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  Calendar,
  Heart,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.profile) {
        setName(data.profile.name || user?.name || "");
        setEmail(data.profile.email || user?.email || "");
        setPhone(data.profile.phone || user?.phone || "");
        setEmergencyContact(data.profile.emergencyContact || "");
        setGender(data.profile.gender || "");
        setDateOfBirth(data.profile.dateOfBirth || "");
        setAddress(data.profile.address || "");
      } else {
        // Fallback to auth context
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
      }
    } catch {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhone(user?.phone || "");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          emergencyContact,
          gender,
          dateOfBirth,
          address,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to update profile.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm text-slate-500 font-medium mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl gradient-teal flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-teal-600/20">
          {name.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{name || "Passenger"}</h2>
          <p className="text-sm text-teal-600 font-semibold">{phone}</p>
          <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
            {user?.role?.toLowerCase().replace("_", " ") || "Passenger"}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <User className="h-4 w-4 text-teal-600" />
            Personal Information
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl font-medium"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl font-medium"
            />
          </div>

          {/* Phone (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
            </Label>
            <Input
              value={phone}
              readOnly
              className="h-10 text-sm bg-slate-100 border-slate-200 text-slate-500 rounded-xl font-medium cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 font-medium">Phone number cannot be changed</p>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-400" /> Gender
            </Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date of Birth
            </Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl font-medium"
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-slate-400" /> Emergency Contact
            </Label>
            <Input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="h-10 text-sm bg-slate-50 border-slate-300 text-slate-900 rounded-xl font-medium"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> Address
            </Label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your address in Bangladesh"
              className="w-full h-20 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-medium resize-none focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between">
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          {saved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Profile saved successfully!
            </div>
          )}
          {!error && !saved && <div />}
          <Button
            type="submit"
            disabled={saving}
            className="gradient-teal text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
