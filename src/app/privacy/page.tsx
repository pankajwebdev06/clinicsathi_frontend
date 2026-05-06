import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Privacy Policy</h1>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 prose prose-slate max-w-none">
          <p className="text-slate-500 mb-8 font-medium italic">Last Updated: May 2026</p>
          
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information Collection</h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, register your clinic, and enter patient records. This may include contact details and professional information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Patient Data Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Patient health records are strictly confidential. We implement bank-grade encryption to ensure that only authorized clinic staff can access patient data. We never share patient data with third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We use bank-grade encryption and secure server environments (Render and Supabase) to protect all information stored on ClinicSathi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Cookies and Tracking</h2>
            <p className="text-slate-600 leading-relaxed">
              We use minimal cookies necessary for the authentication and operation of the service. We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">
              You have the right to access, correct, or delete your personal and clinic data at any time through your dashboard settings.
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
