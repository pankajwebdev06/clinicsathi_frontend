import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs">CS</div>
            <span className="font-extrabold text-slate-900">ClinicSathi</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-blue-600">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Terms of Service</h1>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <p className="text-slate-500 mb-8 font-medium italic">Last Updated: May 2026</p>
          
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using ClinicSathi, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Use of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              ClinicSathi provides clinic management software. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Medical Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed">
              ClinicSathi is a management tool and does not provide medical advice, diagnosis, or treatment. It is intended for administrative and record-keeping purposes only.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Subscription and Payments</h2>
            <p className="text-slate-600 leading-relaxed">
              Subscriptions are billed monthly at the rate of ₹499. The first 100 doctors are eligible for a 2-month free trial. Fees are non-refundable unless required by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              ClinicSathi shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white text-center text-slate-400 text-sm font-medium">
        © 2026 ClinicSathi. All rights reserved.
      </footer>
    </div>
  );
}
