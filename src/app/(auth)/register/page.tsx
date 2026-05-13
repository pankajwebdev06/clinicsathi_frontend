"use client";

import { useState } from "react";
import { authApi } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  // Clinic State
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  
  // User State
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState(""); // Optional email
  
  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
  const [otpCode, setOtpCode] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Register clinic and doctor (no password needed - OTP based login)
      await authApi.registerDoctor({
        mobile_number: mobileNumber,
        email: email || undefined,
        name: doctorName,
        specialization: "", // Will be set later in setup
        clinic_name: clinicName,
        city: "",
        address: "",
      });

      // 2. Send OTP
      const otpResponse = await authApi.sendOTP({ mobile_number: mobileNumber });
      
      setSuccessMsg(otpResponse.message || "OTP sent successfully!");
      if (otpResponse.demo_otp) {
        setDemoOtp(otpResponse.demo_otp);
      }
      
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.verifyOTP({
        mobile_number: mobileNumber,
        otp_code: otpCode,
      });

      // Save token and user info
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      setSuccessMsg("Verification successful! Redirecting to setup...");
      
      // Redirect to subscription selection
      setTimeout(() => {
        router.push("/subscription");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md mx-auto mb-4">
            CS
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Create your Clinic
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {step === 1 ? "Enter your details to get started" : "Verify your mobile number"}
          </p>
        </div>
        
        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Clinic Name</label>
                <Input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="e.g. Apollo Care"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Doctor's Name</label>
                <Input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                <Input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit number for OTP"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Optional)</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For billing & notifications"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              disabled={loading || mobileNumber.length !== 10 || !clinicName || !doctorName}
            >
              {loading ? "Creating Account..." : "Continue →"}
            </Button>
            
            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
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
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
