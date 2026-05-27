import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string | null; category: string | null; cover_emoji: string | null;
  cover_color_from: string | null; cover_color_to: string | null;
  read_time: string | null; published: boolean; published_at: string | null;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post || !post.published) return notFound();

  // Simple markdown → HTML: bold, headers, newlines
  function renderMarkdown(md: string) {
    return md
      .replace(/^### (.+)$/gm, '<h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:24px 0 8px">$1</h3>')
      .replace(/^## (.+)$/gm,  '<h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:32px 0 10px">$1</h2>')
      .replace(/^# (.+)$/gm,   '<h1 style="font-size:28px;font-weight:900;color:#0f172a;margin:36px 0 12px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,    '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    : '';

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <header style={{ background:'white', borderBottom:'1px solid #f1f5f9', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:800, margin:'0 auto', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#2563eb,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:11 }}>CS</div>
            <span style={{ fontWeight:800, color:'#0f172a', fontSize:15 }}>DoctorKaDost</span>
          </Link>
          <Link href="/blog" style={{ color:'#64748b', fontWeight:600, fontSize:13, textDecoration:'none' }}>← Back to Blog</Link>
        </div>
      </header>

      {/* Cover */}
      <div style={{ height:260, background:`linear-gradient(135deg,${post.cover_color_from||'#3b82f6'},${post.cover_color_to||'#14b8a6'})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>
        {post.cover_emoji || '📝'}
      </div>

      {/* Content */}
      <main style={{ maxWidth:740, margin:'0 auto', padding:'48px 24px 80px' }}>
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {post.category && (
            <span style={{ padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:0.8, background:'rgba(37,99,235,0.1)', color:'#2563eb' }}>{post.category}</span>
          )}
          <span style={{ color:'#94a3b8', fontWeight:600, fontSize:12 }}>{post.read_time}</span>
          {dateStr && <span style={{ color:'#94a3b8', fontWeight:600, fontSize:12 }}>· {dateStr}</span>}
        </div>

        <h1 style={{ color:'#0f172a', fontSize:38, fontWeight:900, lineHeight:1.2, letterSpacing:-0.8, margin:'0 0 20px' }}>{post.title}</h1>
        {post.excerpt && <p style={{ color:'#64748b', fontSize:18, lineHeight:1.6, borderLeft:'4px solid #2563eb', paddingLeft:20, margin:'0 0 40px', fontStyle:'italic' }}>{post.excerpt}</p>}

        <div style={{ color:'#334155', fontSize:16, lineHeight:1.85 }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content || '') }} />
      </main>

      <footer style={{ borderTop:'1px solid #f1f5f9', background:'white', padding:'32px 24px', textAlign:'center' }}>
        <p style={{ color:'#94a3b8', fontSize:13 }}>© 2026 DoctorKaDost · <Link href="/blog" style={{ color:'#2563eb', textDecoration:'none', fontWeight:600 }}>More Articles</Link></p>
      </footer>
    </div>
  );
}
