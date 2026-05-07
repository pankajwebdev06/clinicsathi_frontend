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
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Register clinic and doctor (no password needed - OTP based login)
      await authApi.registerDoctor({
        mobile_number: mobileNumber,
        email: email || undefined,
        name: doctorName,
        specialization: "", // Will be set later in setup
        clinic_name: clinicName,
        city: "",
        address: "",
      });

      setSuccessMsg("Registration successful! Login with OTP - No password needed.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your Clinic
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
              {successMsg}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Clinic Details</h3>
            <div>
              <Input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Clinic Name (e.g. Apollo Care)"
              />
            </div>
            <div>
              <Input
                type="text"
                required
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Doctor's Name"
              />
            </div>

            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pt-4">Account Details</h3>
            <div>
              <Input
                type="tel"
                required
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Mobile Number (10 digits - for OTP login)"
              />
            </div>
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional - for notifications)"
              />
            </div>
            <p className="text-xs text-gray-500">
              No password needed! You'll login using OTP sent to your mobile.
            </p>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={loading || mobileNumber.length !== 10}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
