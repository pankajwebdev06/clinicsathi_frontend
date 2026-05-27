import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs">CS</div>
            <span className="font-extrabold text-slate-900">DoctorKaDost</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-blue-600">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">We&apos;re here to help you digitize your clinic. Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="name@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                Send Message →
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-xl font-bold mb-4">Direct Support</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Email Us</p>
                    <p className="font-bold">support@doctorkadost.in</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Call Support</p>
                    <p className="font-bold">+91 (800) CLINIC-SATHI</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Our Office</p>
                    <p className="font-bold">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">India Wide Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Available Monday to Saturday, 9 AM to 7 PM IST. We usually respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white text-center text-slate-400 text-sm font-medium">
        © 2026 DoctorKaDost. All rights reserved.
      </footer>
    </div>
  );
}
