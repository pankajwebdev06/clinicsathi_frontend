"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscriptionApi } from "@/features/subscription/api";
import { useCashfree } from "@/features/subscription/useCashfree";
import { Button } from "@/shared/components/ui/Button";

// ── Types ────────────────────────────────────────────────────────────────────

interface PromoResult {
  valid: boolean;
  code: string;
  original_amount: number;
  final_amount: number;
  discount_amount: number;
  trial_days: number | null;
  message: string;
}

interface ActivePromo {
  code: string;
  description: string;
  discount_type: "percent" | "fixed" | "free_trial";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function promoLabel(p: ActivePromo): string {
  if (p.discount_type === "free_trial") {
    const months = Math.round(p.discount_value / 30);
    return `${months} Month${months > 1 ? "s" : ""} Free`;
  }
  if (p.discount_type === "percent") return `${p.discount_value}% Off`;
  return `₹${p.discount_value} Off`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const router = useRouter();
  const { isLoaded, openCheckout } = useCashfree();

  const [plans, setPlans] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<"monthly" | "annual" | null>(null);
  const [error, setError] = useState("");

  // Promo state
  const [promoInput, setPromoInput] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [promoError, setPromoError] = useState("");
  const [activePromos, setActivePromos] = useState<ActivePromo[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  // ── Load plans + active promos ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [plansData, promosData] = await Promise.all([
          subscriptionApi.getPlans(),
          subscriptionApi.getActivePromos().catch(() => []),
        ]);
        setPlans(plansData);
        setActivePromos(promosData || []);
      } catch (err: any) {
        setError(err.message || "Failed to load plans.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Re-apply promo if plan changes (so discount recalculates)
  useEffect(() => {
    if (promoResult) {
      handleApplyPromo(promoResult.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  // ── Promo apply ─────────────────────────────────────────────────────────────
  const handleApplyPromo = async (code?: string) => {
    const codeToApply = (code || promoInput).trim().toUpperCase();
    if (!codeToApply) return;

    setPromoApplying(true);
    setPromoError("");
    setPromoResult(null);

    try {
      const result = await subscriptionApi.applyPromo(codeToApply, selectedPlan);
      setPromoResult(result);
      setPromoInput(codeToApply);
    } catch (err: any) {
      setPromoError(err.message || "Invalid promo code.");
    } finally {
      setPromoApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoResult(null);
    setPromoInput("");
    setPromoError("");
  };

  // ── Subscribe ───────────────────────────────────────────────────────────────
  const handleSubscribe = async (planKey: "monthly" | "annual") => {
    if (!isLoaded) {
      setError("Payment system is still loading. Please wait.");
      return;
    }

    setProcessing(planKey);
    setError("");

    try {
      const orderData = await subscriptionApi.createOrder(
        planKey,
        promoResult?.code
      );

      // FREE TRIAL — no Cashfree modal, redirect to verify
      if (orderData.is_free) {
        router.push(
          `/subscription/verify?order_id=${orderData.order_id}&free=true`
        );
        return;
      }

      // PAID — open Cashfree checkout
      const returnUrl = `${window.location.origin}/subscription/verify?order_id=${orderData.order_id}`;
      await openCheckout(orderData.payment_session_id, returnUrl);
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment.");
    } finally {
      setProcessing(null);
    }
  };

  // ── Get display amount (with promo applied) ──────────────────────────────────
  const getDisplayAmount = (planKey: "monthly" | "annual", originalAmount: number) => {
    if (promoResult && selectedPlan === planKey) {
      return promoResult.final_amount;
    }
    return originalAmount;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-base text-slate-500">
            Secure payments powered by Cashfree. Cancel anytime.
          </p>
        </div>

        {/* Global error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center mb-6 border border-red-100 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Plan selector toggle (mobile-friendly) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm gap-1">
            {(["monthly", "annual"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlan(p)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                  selectedPlan === p
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {p === "monthly" ? "Monthly" : "Annual"}
                {p === "annual" && (
                  <span
                    className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      selectedPlan === "annual"
                        ? "bg-yellow-400 text-yellow-900"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    2 months free
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {/* Monthly Plan */}
          {plans?.monthly && (
            <div
              onClick={() => setSelectedPlan("monthly")}
              className={`bg-white rounded-3xl p-7 border-2 shadow-sm cursor-pointer transition-all ${
                selectedPlan === "monthly"
                  ? "border-blue-500 shadow-blue-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Monthly</h3>
                {selectedPlan === "monthly" && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">✓</span>
                )}
              </div>

              <div className="mb-1">
                {promoResult && selectedPlan === "monthly" && promoResult.final_amount < plans.monthly.amount ? (
                  <div>
                    <span className="text-2xl font-black text-slate-400 line-through mr-2">
                      ₹{plans.monthly.amount}
                    </span>
                    <span className="text-3xl font-black text-emerald-600">
                      ₹{promoResult.final_amount === 0 ? "0" : promoResult.final_amount}
                    </span>
                    <span className="text-base text-slate-400 font-medium">/mo</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-black text-slate-900">₹{plans.monthly.amount}</span>
                    <span className="text-base text-slate-400 font-medium">/mo</span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-5">{plans.monthly.billing_cycle}</p>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-slate-700"><span className="text-emerald-500">✓</span> Full Access to DoctorKaDost</li>
                <li className="flex items-center gap-2 text-slate-700"><span className="text-emerald-500">✓</span> Unlimited Patients</li>
                <li className="flex items-center gap-2 text-slate-700"><span className="text-emerald-500">✓</span> Queue Management</li>
                <li className="flex items-center gap-2 text-slate-700"><span className="text-emerald-500">✓</span> Standard Support</li>
              </ul>

              <Button
                fullWidth
                variant="secondary"
                size="lg"
                loading={processing === "monthly"}
                disabled={!!processing}
                onClick={(e) => { e.stopPropagation(); handleSubscribe("monthly"); }}
              >
                {promoResult && selectedPlan === "monthly" && promoResult.final_amount === 0
                  ? "Activate Free Trial"
                  : "Subscribe Monthly"}
              </Button>
            </div>
          )}

          {/* Annual Plan */}
          {plans?.annual && (
            <div
              onClick={() => setSelectedPlan("annual")}
              className={`rounded-3xl p-7 border-2 shadow-lg cursor-pointer transition-all relative ${
                selectedPlan === "annual"
                  ? "bg-blue-600 border-blue-500"
                  : "bg-blue-50 border-blue-200 hover:border-blue-300"
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                ⭐ Best Value
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className={`text-lg font-bold ${selectedPlan === "annual" ? "text-white" : "text-blue-900"}`}>
                  Annual
                </h3>
                {selectedPlan === "annual" && (
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-blue-600 text-xs font-bold">✓</span>
                )}
              </div>

              <div className="mb-1">
                {promoResult && selectedPlan === "annual" && promoResult.final_amount < plans.annual.amount ? (
                  <div>
                    <span className={`text-2xl font-black line-through mr-2 ${selectedPlan === "annual" ? "text-blue-300" : "text-blue-400"}`}>
                      ₹{plans.annual.amount}
                    </span>
                    <span className={`text-3xl font-black ${selectedPlan === "annual" ? "text-yellow-300" : "text-emerald-600"}`}>
                      ₹{promoResult.final_amount === 0 ? "0" : promoResult.final_amount}
                    </span>
                    <span className={`text-base font-medium ${selectedPlan === "annual" ? "text-blue-200" : "text-blue-400"}`}>/yr</span>
                  </div>
                ) : (
                  <div>
                    <span className={`text-3xl font-black ${selectedPlan === "annual" ? "text-white" : "text-blue-900"}`}>₹{plans.annual.amount}</span>
                    <span className={`text-base font-medium ${selectedPlan === "annual" ? "text-blue-200" : "text-blue-500"}`}>/yr</span>
                  </div>
                )}
              </div>
              <p className={`text-sm mb-1 ${selectedPlan === "annual" ? "text-blue-100" : "text-blue-500"}`}>
                {plans.annual.billing_cycle}
              </p>
              <p className={`text-xs font-bold mb-5 ${selectedPlan === "annual" ? "text-yellow-300" : "text-blue-600"}`}>
                ✨ {plans.annual.savings}
              </p>

              <ul className="space-y-2 mb-6 text-sm">
                {["All Monthly Features", "2 Months Free", "Priority 24/7 Support", "SMS Reminders (Soon)"].map((f) => (
                  <li key={f} className={`flex items-center gap-2 ${selectedPlan === "annual" ? "text-blue-50" : "text-blue-800"}`}>
                    <span className="text-yellow-400">✓</span> {f}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                size="lg"
                loading={processing === "annual"}
                disabled={!!processing}
                className={
                  selectedPlan === "annual"
                    ? "bg-white text-blue-600 hover:bg-slate-50 border border-transparent"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
                onClick={(e) => { e.stopPropagation(); handleSubscribe("annual"); }}
              >
                {promoResult && selectedPlan === "annual" && promoResult.final_amount === 0
                  ? "Activate Free Trial"
                  : "Subscribe Annually"}
              </Button>
            </div>
          )}
        </div>

        {/* ── Promo Code Section ─────────────────────────────────────────── */}
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            🎟️ Have a Promo Code?
          </h4>

          {/* Input row */}
          {!promoResult ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. FIRST100"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value.toUpperCase());
                  setPromoError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono font-semibold text-slate-800 placeholder:font-sans placeholder:font-normal focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 uppercase"
              />
              <button
                onClick={() => handleApplyPromo()}
                disabled={promoApplying || !promoInput.trim()}
                className="px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] whitespace-nowrap"
              >
                {promoApplying ? "..." : "Apply"}
              </button>
            </div>
          ) : (
            /* Applied promo chip */
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-sm font-mono">
                    {promoResult.code}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    Applied ✓
                  </span>
                </div>
                <p className="text-emerald-700 text-xs mt-0.5">{promoResult.message}</p>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-slate-400 hover:text-red-500 text-lg ml-3 transition-colors min-h-[44px] px-1"
                title="Remove promo"
              >
                ✕
              </button>
            </div>
          )}

          {/* Promo error */}
          {promoError && (
            <p className="mt-2 text-red-500 text-xs">{promoError}</p>
          )}

          {/* Active public promos list */}
          {activePromos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Available Offers
              </p>
              <div className="flex flex-col gap-2">
                {activePromos.map((p) => (
                  <button
                    key={p.code}
                    onClick={() => {
                      setPromoInput(p.code);
                      handleApplyPromo(p.code);
                    }}
                    className="flex items-center justify-between text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-2.5 transition-all group"
                  >
                    <div>
                      <span className="font-mono font-black text-sm text-slate-800 group-hover:text-blue-700">
                        {p.code}
                      </span>
                      {p.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                      )}
                      {p.max_uses && (
                        <p className="text-xs text-slate-400">
                          {p.max_uses - p.used_count} of {p.max_uses} remaining
                        </p>
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full ml-3 whitespace-nowrap">
                      {promoLabel(p)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-slate-400 text-xs pb-6">
          Payments securely processed by Cashfree Payments. By subscribing you agree to our Terms of Service.
        </div>
      </div>
    </div>
  );
}
