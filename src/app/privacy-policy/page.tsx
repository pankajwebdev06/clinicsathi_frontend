import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <header className="border-b border-slate-100 py-4 px-6 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="font-extrabold text-xl tracking-tight text-blue-600">DoctorKaDost</Link>
          <span className="text-slate-400 font-medium ml-4">Legal</span>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-slate">
        <h1 className="text-3xl font-black mb-2">PRIVACY POLICY — DOCTORKADOST</h1>
        <p className="text-slate-500 font-medium mb-8"><strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN')} <br/>
        <strong>Company:</strong> DoctorKaDost Private Limited <br/>
        <strong>Contact Email:</strong> privacy@doctorkadost.com</p>

        <h3 className="text-xl font-bold mt-8 mb-4">1. Introduction</h3>
        <p className="mb-4">DoctorKaDost Private Limited operates the DoctorKaDost clinic management platform. We are committed to protecting the privacy and security of all personal data processed through our platform.</p>
        <p className="mb-4">This Privacy Policy describes how we collect, use, store, and protect personal data in compliance with The Information Technology Act 2000, SPDI Rules 2011, DPDP Act 2023, and EHR Standards for India 2016.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">2. Who We Collect Data From</h3>
        <p className="mb-4"><strong>a) Clinic Users (Doctors and Receptionists):</strong> Individuals who register and operate the platform. Data collected includes name, mobile number, password (hashed), clinic details, and specialization.</p>
        <p className="mb-4"><strong>b) Patients:</strong> Individuals registered into the system by a clinic user. Data collected includes name, age, gender, mobile number, chief complaint, vitals, diagnosis, prescribed medicines, and uploaded documents.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">3. Legal Basis for Processing</h3>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Consent:</strong> Patient data is collected and stored only after explicit consent at registration.</li>
          <li><strong>Legitimate Interest:</strong> Clinic operational data is processed to deliver the contracted service.</li>
          <li><strong>Legal Obligation:</strong> Certain data may be retained to comply with healthcare regulations.</li>
        </ul>

        <h3 className="text-xl font-bold mt-8 mb-4">4. How We Use Personal Data</h3>
        <p className="mb-4">We do <strong>not</strong> sell, rent, or share your personal data with third parties for advertising or marketing purposes. Data is used strictly for authentication, service delivery, EHR maintenance, and system alerts.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">5. Data Sharing</h3>
        <p className="mb-4">We share personal data only with secure cloud infrastructure providers (e.g., Cloudinary for documents) and legal authorities when strictly required by law.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">6. Data Security</h3>
        <p className="mb-4">We implement TLS/HTTPS encryption, bcrypt password hashing, encryption at rest, and strict role-based access control. In the event of a breach, we will notify affected parties within 6 hours of discovery.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">7. Data Retention</h3>
        <p className="mb-4">Patient health records are retained for a minimum of 7 years in accordance with MCI/NMC guidelines. Upon written request, administrators may request deletion of clinic data after account closure.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">8. Your Rights</h3>
        <p className="mb-4">Under the DPDP Act 2023, you have the right to Access, Correct, Erase, and seek Grievance Redressal. Contact <strong>privacy@doctorkadost.com</strong> to exercise these rights.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">9. Children's Data</h3>
        <p className="mb-4">For patients under 18, we require a parent or guardian to provide consent on the child's behalf at registration.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">10. Contact & Grievance Officer</h3>
        <p className="mb-4">
          Data Protection / Grievance Officer<br/>
          DoctorKaDost Private Limited<br/>
          Email: privacy@doctorkadost.com
        </p>
      </main>
    </div>
  );
}
