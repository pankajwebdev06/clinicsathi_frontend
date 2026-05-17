'use client';
import { useState } from 'react';
import Link from 'next/link';

// Plan pricing — keep frontend-only for now. When Cashfree integration goes
// live, the Subscription model in clinicflow-backend/app/features/admin/models.py
// will store plan + amount per clinic. No backend changes needed at this stage.
const PLANS = {
  monthly: {
    amount: 799,
    billed: '/month • Billed monthly',
    cta: 'Start Free Trial',
    perMonth: 799,
  },
  yearly: {
    amount: 7999,
    billed: '/year • Billed yearly',
    cta: 'Start Free Trial',
    perMonth: Math.round(7999 / 12),
  },
} as const;

type BillingCycle = keyof typeof PLANS;

const FEATURES = [
  '✅ Unlimited patients per day',
  '✅ Up to 5 staff accounts',
  '✅ Offline mode with auto-sync',
  '✅ Custom prescription pad',
  '✅ Public SEO profile page',
  '✅ Multi-language UI',
  '✅ Priority support',
];

export function PricingCard() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const plan = PLANS[cycle];
  const monthlyEquivalent = PLANS.monthly.amount * 12;
  const yearlySavings = monthlyEquivalent - PLANS.yearly.amount;

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-2xl shadow-blue-100 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
        Most Popular
      </div>

      {/* Billing toggle */}
      <div className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1 mb-6 text-xs font-bold">
        {(['monthly', 'yearly'] as BillingCycle[]).map(c => (
          <button
            key={c}
            onClick={() => setCycle(c)}
            className={`px-4 py-2 rounded-full transition-all min-h-[36px] ${
              cycle === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {c === 'monthly' ? 'Monthly' : (
              <span className="flex items-center gap-1.5">
                Yearly
                <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  SAVE ₹{yearlySavings.toLocaleString('en-IN')}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="text-5xl md:text-6xl font-black text-slate-900 mb-1 flex items-baseline justify-center gap-1">
        <span className="text-xl md:text-2xl font-bold text-slate-500 self-start mt-2">₹</span>
        <span>{plan.amount.toLocaleString('en-IN')}</span>
      </div>
      <p className="text-slate-500 font-semibold mb-2 text-sm md:text-base">{plan.billed}</p>

      {cycle === 'yearly' && (
        <p className="text-emerald-600 font-bold text-sm mb-3">
          ≈ ₹{plan.perMonth.toLocaleString('en-IN')}/month effective
        </p>
      )}

      <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider mb-7">
        🎁 Free Trial — first 100 doctors
      </div>

      <ul className="space-y-3 text-left mb-8 max-w-sm mx-auto">
        {FEATURES.map(item => (
          <li key={item} className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base">
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/doctor/setup"
        className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] text-center"
      >
        {plan.cta} →
      </Link>
      <p className="text-slate-400 text-xs mt-3 font-medium">No credit card required.</p>
    </div>
  );
}
