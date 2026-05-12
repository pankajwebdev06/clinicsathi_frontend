'use client';

import Link from 'next/link';
import { useEffect, useState, MouseEvent } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string | null;
  category: string | null; cover_emoji: string | null;
  cover_color_from: string | null; cover_color_to: string | null;
  read_time: string | null; published_at: string | null; created_at: string | null;
}

// Hardcoded fallback shown if DB has no published posts
const FALLBACK_POST = {
  title: 'Complete ClinicSathi Product Guide',
  date: 'May 7, 2026', category: 'Guide', readTime: '15 min read',
  excerpt: 'A comprehensive step-by-step guide covering registration, signing in, doctor dashboard, reception workflow, patient consultation, prescription printing, staff management, and clinic settings.',
  color: 'bg-blue-100 text-blue-700', slug: '/blog/guide/', isFallback: true,
};

function getPublishedPosts(): Promise<BlogPost[]> {
  return fetch(`${API_BASE}/api/v1/admin/blog?published=true`)
    .then(res => res.ok ? res.json() : [])
    .catch(() => []);
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const hasDynamic = posts.length > 0;

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <header style={{ background:'white', borderBottom:'1px solid #f1f5f9', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:12 }}>CS</div>
            <span style={{ fontWeight:800, color:'#0f172a', fontSize:16 }}>ClinicSathi</span>
          </Link>
          <nav style={{ display:'flex', gap:28 }}>
            <Link href="/" style={{ color:'#64748b', fontWeight:600, fontSize:14, textDecoration:'none' }}>Home</Link>
            <Link href="/contact" style={{ color:'#64748b', fontWeight:600, fontSize:14, textDecoration:'none' }}>Contact</Link>
          </nav>
          <Link href="/doctor/setup" style={{ background:'#2563eb', color:'white', padding:'9px 20px', borderRadius:10, fontWeight:700, fontSize:13, textDecoration:'none' }}>Register Clinic</Link>
        </div>
      </header>

      <main style={{ maxWidth:1100, margin:'0 auto', padding:'64px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h1 style={{ fontSize:52, fontWeight:900, color:'#0f172a', margin:0, letterSpacing:-1.5 }}>Our Blog</h1>
          <p style={{ color:'#64748b', fontSize:18, marginTop:12, fontWeight:500 }}>Insights, guides, and stories from digital healthcare in India.</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading posts...</div>
        )}

        {/* Dynamic posts from DB */}
        {!loading && hasDynamic && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24, marginBottom:32 }}>
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration:'none' }}>
                <div style={{ background:'white', borderRadius:24, border:'1px solid #f1f5f9', overflow:'hidden', transition:'all 0.2s', cursor:'pointer' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                  <div style={{ height:140, background:`linear-gradient(135deg,${post.cover_color_from||'#3b82f6'},${post.cover_color_to||'#14b8a6'})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56 }}>
                    {post.cover_emoji || '📝'}
                  </div>
                  <div style={{ padding:24 }}>
                    <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:0.6, background:'rgba(37,99,235,0.1)', color:'#2563eb' }}>{post.category || 'Article'}</span>
                      <span style={{ color:'#94a3b8', fontSize:11, fontWeight:600 }}>{post.read_time}</span>
                    </div>
                    <h3 style={{ color:'#0f172a', fontWeight:800, fontSize:18, lineHeight:1.3, margin:'0 0 10px' }}>{post.title}</h3>
                    {post.excerpt && <p style={{ color:'#64748b', fontSize:14, lineHeight:1.6, margin:'0 0 16px' }}>{post.excerpt}</p>}
                    <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid #f8fafc' }}>
                      <span style={{ color:'#94a3b8', fontSize:11, fontWeight:600 }}>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                      <span style={{ color:'#2563eb', fontWeight:700, fontSize:13 }}>Read →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Fallback Guide (always shown) */}
        <div style={{ maxWidth: hasDynamic ? '100%' : 640, margin: hasDynamic ? 0 : '0 auto' }}>
          <Link href={FALLBACK_POST.slug} style={{ textDecoration:'none', display:'block' }}>
            <div style={{ background:'white', borderRadius:24, border:'1px solid #f1f5f9', overflow:'hidden', transition:'all 0.2s', cursor:'pointer' }}
              onMouseEnter={(e:any) => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e:any) => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ height:180, background:'linear-gradient(135deg,#3b82f6,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                <div style={{ fontSize:56 }}>📚</div>
                <p style={{ color:'white', fontWeight:700, fontSize:17 }}>Complete Product Guide</p>
              </div>
              <div style={{ padding:32 }}>
                <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                  <span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:800, textTransform:'uppercase', background:'rgba(37,99,235,0.1)', color:'#2563eb' }}>Guide</span>
                  <span style={{ color:'#94a3b8', fontSize:11, fontWeight:600 }}>{FALLBACK_POST.readTime}</span>
                </div>
                <h3 style={{ color:'#0f172a', fontWeight:800, fontSize:22, lineHeight:1.3, margin:'0 0 12px' }}>{FALLBACK_POST.title}</h3>
                <p style={{ color:'#64748b', lineHeight:1.7, margin:'0 0 20px', fontSize:15 }}>{FALLBACK_POST.excerpt}</p>
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:16, borderTop:'1px solid #f8fafc' }}>
                  <span style={{ color:'#94a3b8', fontSize:12, fontWeight:600 }}>{FALLBACK_POST.date}</span>
                  <span style={{ color:'#2563eb', fontWeight:700 }}>Read Full Guide →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer style={{ borderTop:'1px solid #f1f5f9', background:'white', padding:'40px 24px', textAlign:'center' }}>
        <p style={{ color:'#94a3b8', fontSize:14 }}>© 2026 ClinicSathi. Built for the Indian Subcontinent.</p>
      </footer>
    </div>
  );
}
