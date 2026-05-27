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
  const [otpCode, setOtpCode] = useState("");

  // If already logged in, redirect to correct dashboard
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.role === 'doctor') { router.replace('/doctor/dashboard'); }
        else if (user.role === 'receptionist') { router.replace('/reception'); }
      } catch {}
    }
  }
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState(""); // For development - shows OTP

  // Send OTP to mobile number
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await authApi.sendOTP({
        mobile_number: mobileNumber,
      });

      setOtpSent(true);
      setSuccessMsg(response.message || `OTP sent to ${mobileNumber}`);
      
      // For development - show the OTP
      if (response.demo_otp) {
        setDemoOtp(response.demo_otp);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please check your mobile number.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.verifyOTP({
        mobile_number: mobileNumber,
        otp_code: otpCode,
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
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-md w-full p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
            CS
          </div>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">DoctorKaDost</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
        <p className="text-slate-500 text-sm mb-8">
          {otpSent ? "Enter the 6-digit OTP sent to your mobile" : "Sign in with OTP - No password needed"}
        </p>

        {!otpSent ? (
          // Step 1: Send OTP
          <form className="space-y-5" onSubmit={handleSendOTP}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm text-center border border-green-100">
                {successMsg}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <Input
                type="tel"
                required
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              disabled={loading || mobileNumber.length !== 10}
            >
              {loading ? "Sending..." : "Send OTP →"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              New clinic?{" "}
              <Link href="/doctor/setup" className="font-semibold text-blue-600 hover:text-blue-700">
                Register here
              </Link>
            </p>
          </form>
        ) : (
          // Step 2: Verify OTP
          <form className="space-y-5" onSubmit={handleVerifyOTP}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm text-center border border-green-100">
                {successMsg}
              </div>
            )}
            
            {/* For development - show OTP */}
            {demoOtp && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-sm text-center border border-blue-100">
                <strong>Development Mode:</strong> Your OTP is <strong>{demoOtp}</strong>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Enter 6-digit OTP
              </label>
              <Input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="text-center text-xl tracking-widest"
                disabled={loading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              disabled={loading || otpCode.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Login →"}
            </Button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode("");
                  setDemoOtp("");
                  setError("");
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                ← Change number
              </button>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
