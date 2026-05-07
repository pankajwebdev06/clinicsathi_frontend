import Link from 'next/link';

export default function BlogPage() {
  const GUIDE_POST = {
    title: 'Complete ClinicSathi Product Guide',
    date: 'May 7, 2026',
    category: 'Guide',
    readTime: '15 min read',
    excerpt: 'A comprehensive step-by-step guide covering registration, signing in, doctor dashboard, reception workflow, patient consultation, prescription printing, staff management, and clinic settings.',
    color: 'bg-blue-100 text-blue-700',
    slug: '/blog/guide/'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-black text-xs">CS</div>
            <span className="font-extrabold text-slate-900">ClinicSathi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
          </nav>
          <Link href="/doctor/setup" className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-xl">Register Clinic</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">Our Blog</h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Insights, guides, and stories from the world of digital healthcare in India.</p>
        </div>

        {/* Featured Guide */}
        <div className="max-w-2xl mx-auto">
          <Link href={GUIDE_POST.slug} className="block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-56 bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl font-bold">Complete Product Guide</p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${GUIDE_POST.color}`}>{GUIDE_POST.category}</span>
                <span className="text-slate-400 text-[10px] font-bold">{GUIDE_POST.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{GUIDE_POST.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6 font-medium">{GUIDE_POST.excerpt}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <p className="text-slate-400 text-[10px] font-bold">{GUIDE_POST.date}</p>
                <span className="text-blue-600 font-bold text-sm">Read Full Guide →</span>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 ClinicSathi. Built for the Indian Subcontinent.</p>
        </div>
      </footer>
    </div>
  );
}
