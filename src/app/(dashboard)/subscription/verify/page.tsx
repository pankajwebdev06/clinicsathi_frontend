"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { subscriptionApi } from "@/features/subscription/api";
import { Button } from "@/shared/components/ui/Button";

import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const isFree = searchParams.get("free") === "true";

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState(
    isFree ? "Activating your free trial..." : "Verifying your payment..."
  );

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("No order ID found.");
      return;
    }

    const verify = async () => {
      try {
        const response = await subscriptionApi.verifyPayment(orderId);
        if (response.status === "success" || response.status === "already_active" || response.status === "trial_activated") {
          setStatus("success");
          setMessage(
            isFree
              ? "Free trial activated! Welcome to DoctorKaDost 🎉"
              : "Payment successful! Your subscription is now active."
          );
          setTimeout(() => {
            router.push("/doctor/dashboard");
          }, 3000);
        } else if (response.status === "pending") {
           setStatus("verifying");
           setMessage("Payment is still processing. Checking again in 5 seconds...");
           setTimeout(verify, 5000);
        } else {
          setStatus("failed");
          setMessage("Payment failed or cancelled.");
        }
      } catch (err: any) {
        setStatus("failed");
        setMessage(err.message || "Payment verification failed.");
      }
    };

    verify();
  }, [orderId, router]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100">
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment</h2>
          <p className="text-slate-500">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 mb-6">{message}</p>
          <p className="text-sm text-slate-400 mb-6">Redirecting to your dashboard...</p>
          <Button fullWidth onClick={() => router.push("/doctor/dashboard")}>
            Go to Dashboard Now
          </Button>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ❌
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
          <p className="text-slate-500 mb-6">{message}</p>
          <Button fullWidth variant="secondary" onClick={() => router.push("/subscription")}>
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}

export default function SubscriptionVerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><h2 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h2></div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
