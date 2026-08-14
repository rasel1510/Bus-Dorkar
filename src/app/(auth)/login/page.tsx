import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In | Bus Dorkar",
  description: "Sign in to your Bus Dorkar account to manage your bookings and view tickets.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 text-sm">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
