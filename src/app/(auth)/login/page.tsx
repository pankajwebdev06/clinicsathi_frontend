"use client";

import { useState } from "react";
import { authApi } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({
        mobile_number: mobileNumber,
        password: password,
      });

      // Save token and user info to localStorage
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      // Role-based redirect
      const role: string = response.user.role;
      if (role === "doctor") {
        router.push("/doctor/dashboard");
      } else if (role === "receptionist") {
        router.push("/reception");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
            CS
          </div>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">ClinicSathi</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
        <p className="text-slate-500 text-sm mb-8">Sign in to your clinic dashboard</p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <Input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </Button>

          <p className="text-center text-sm text-slate-500">
            New clinic?{" "}
            <Link href="/doctor/setup" className="font-semibold text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
