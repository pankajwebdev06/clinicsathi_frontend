"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscriptionApi } from "@/features/subscription/api";
import { useCashfree } from "@/features/subscription/useCashfree";
import { Button } from "@/shared/components/ui/Button";

export default function SubscriptionPage() {
  const router = useRouter();
  const { isLoaded, openCheckout } = useCashfree();
  
  const [plans, setPlans] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionApi.getPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || "Failed to load plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planKey: "monthly" | "annual") => {
    if (!isLoaded) {
      setError("Payment system is still loading. Please wait.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Create order on backend
      const orderData = await subscriptionApi.createOrder(planKey);
      
      // Open Cashfree Checkout Modal
      // Provide return URL where Cashfree will redirect after payment
      const returnUrl = `${window.location.origin}/subscription/verify?order_id=${orderData.order_id}`;
      await openCheckout(orderData.payment_session_id, returnUrl);
      
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading plans...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Choose Your Plan</h2>
          <p className="text-lg text-slate-600">
            Select a plan to start using ClinicSathi. Secure payments powered by Cashfree.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center mb-8 border border-red-100 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly Plan */}
          {plans?.monthly && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Monthly Plan</h3>
              <div className="text-4xl font-black text-slate-900 mb-2">
                ₹{plans.monthly.amount}
                <span className="text-lg text-slate-500 font-medium">/mo</span>
              </div>
              <p className="text-slate-500 mb-6">{plans.monthly.billing_cycle}</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-700">✅ Full Access to ClinicSathi</li>
                <li className="flex items-center text-slate-700">✅ Unlimited Patients</li>
                <li className="flex items-center text-slate-700">✅ Queue Management</li>
                <li className="flex items-center text-slate-700">✅ Standard Support</li>
              </ul>

              <Button
                fullWidth
                variant="secondary"
                size="lg"
                loading={processing}
                onClick={() => handleSubscribe("monthly")}
              >
                Subscribe Monthly
              </Button>
            </div>
          )}

          {/* Annual Plan */}
          {plans?.annual && (
            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-lg relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                Best Value
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Annual Plan</h3>
              <div className="text-4xl font-black text-white mb-2">
                ₹{plans.annual.amount}
                <span className="text-lg text-blue-200 font-medium">/yr</span>
              </div>
              <p className="text-blue-100 mb-2">{plans.annual.billing_cycle}</p>
              <p className="text-yellow-300 font-bold mb-6 text-sm">✨ {plans.annual.savings}</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-blue-50">✅ All Monthly Features</li>
                <li className="flex items-center text-blue-50">✅ 2 Months Free</li>
                <li className="flex items-center text-blue-50">✅ Priority 24/7 Support</li>
                <li className="flex items-center text-blue-50">✅ SMS Reminders (Soon)</li>
              </ul>

              <Button
                fullWidth
                variant="primary"
                className="bg-white text-blue-600 hover:bg-slate-50 shadow-none border border-transparent hover:border-slate-100"
                size="lg"
                loading={processing}
                onClick={() => handleSubscribe("annual")}
              >
                Subscribe Annually
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm">
          Payments are securely processed by Cashfree Payments.
        </div>
      </div>
    </div>
  );
}
