import Link from 'next/link';

export default function BlogPage() {
  const POSTS = [
    {
      title: 'How to transition your clinic from paper to digital',
      date: 'May 10, 2026',
      category: 'Guides',
      readTime: '5 min read',
      excerpt: 'Moving your patient records to a digital system can feel overwhelming. Here is a step-by-step guide to making it seamless.',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Reducing patient wait times: 5 proven strategies',
      date: 'May 05, 2026',
      category: 'Efficiency',
      readTime: '4 min read',
      excerpt: 'Long wait times are the #1 complaint in Indian clinics. Learn how smart queue management can change your practice.',
      color: 'bg-teal-100 text-teal-700'
    },
    {
      title: 'ClinicSathi v2.0: What is new in the latest update',
      date: 'April 28, 2026',
      category: 'Product',
      readTime: '3 min read',
      excerpt: 'Explore the newest features designed to make your clinical workflow even faster and more reliable.',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

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

        {/* Coming Soon Badge */}
        <div className="bg-blue-600 text-white p-12 rounded-[40px] mb-16 text-center shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Coming Soon! ✍️</h2>
            <p className="text-blue-100 text-lg max-w-lg mx-auto mb-8 font-medium">We are preparing expert content to help you grow your medical practice. Stay tuned!</p>
            <div className="flex justify-center">
               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex max-w-md w-full">
                  <input type="email" placeholder="Enter email for updates" className="flex-1 bg-transparent px-4 text-white placeholder:text-blue-200 outline-none" />
                  <button className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold">Notify Me</button>
               </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {POSTS.map(post => (
            <div key={post.title} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-48 bg-slate-200 animate-pulse"></div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${post.color}`}>{post.category}</span>
                  <span className="text-slate-400 text-[10px] font-bold">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <p className="text-slate-400 text-[10px] font-bold">{post.date}</p>
                  <span className="text-blue-600 font-bold text-xs">Read More →</span>
                </div>
              </div>
            </div>
          ))}
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
