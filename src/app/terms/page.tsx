import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <header className="border-b border-slate-100 py-4 px-6 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-blue-600">DoctorKaDost</Link>
          <span className="text-slate-400 font-medium ml-4">Legal</span>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-slate">
        <h1 className="text-3xl font-black mb-2">TERMS AND CONDITIONS — DOCTORKADOST</h1>
        <p className="text-slate-500 font-medium mb-8"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>

        <h3 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h3>
        <p className="mb-4">By registering a clinic on DoctorKaDost ("Platform"), you ("Clinic", "Doctor", "User") agree to be bound by these Terms and Conditions. If you do not agree, do not use the Platform.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Description of Service</h3>
        <p className="mb-4">DoctorKaDost is a Software-as-a-Service (SaaS) clinic management platform providing patient registration, EHR storage, prescription generation, and staff management. DoctorKaDost is <strong>not</strong> a telemedicine platform.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. User Responsibilities</h3>
        <p className="mb-4">The Doctor (Account Owner) is responsible for obtaining patient consent, maintaining confidentiality, ensuring medical accuracy, and including their valid MCI/NMC registration number in clinic setup. Clinical decisions remain solely the responsibility of the licensed practitioner.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">4. Acceptable Use</h3>
        <p className="mb-4">You agree NOT to enter false records, store data without consent, share credentials, access other clinics' data, or reverse-engineer the platform.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">5. Subscription and Payment</h3>
        <p className="mb-4">DoctorKaDost is offered on a subscription basis. Subscriptions auto-renew. Prices are exclusive of GST.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">6. Data Ownership</h3>
        <p className="mb-4"><strong>You own your clinic's data.</strong> DoctorKaDost acts as a data processor. You may export your data at any time.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">7. Limitation of Liability</h3>
        <p className="mb-4">DoctorKaDost's liability shall not exceed subscription fees paid in the preceding 3 months. DoctorKaDost is not liable for clinical errors or misdiagnoses.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">8. Governing Law</h3>
        <p className="mb-4">These Terms are governed by the laws of India.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">9. Contact</h3>
        <p className="mb-4">For any questions about these Terms, email: <strong>legal@doctorkadost.com</strong></p>
      </main>
    </div>
  );
}
