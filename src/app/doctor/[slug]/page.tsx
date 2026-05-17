'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');

interface ClinicProfile {
  id: string;
  name: string;
  slug: string;
  doctor_name: string;
  specialization: string | null;
  degree: string | null;
  experience: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  mci_number: string | null;
  doctor_photo: string | null;
  clinic_photo: string | null;
  about_doctor: string | null;
  services: string | null;
  consultation_fee: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [profile, setProfile] = useState<ClinicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/public/profile/${slug}`);
        if (!res.ok) {
          throw new Error('Clinic profile not found');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Head>
          <title>Loading Profile - ClinicSathi</title>
          <meta name="description" content="Loading doctor profile..." />
        </Head>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Profile Not Found</h1>
          <p style={{ color: '#64748b', marginBottom: 24 }}>{error || 'This clinic profile does not exist or has been removed.'}</p>
          <Link href="/" style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>{profile.meta_title || `Dr. ${profile.doctor_name} - ${profile.specialization || 'General Physician'} in ${profile.city || 'India'} | ClinicSathi`}</title>
        <meta name="description" content={profile.meta_description || `Book appointment with Dr. ${profile.doctor_name}, ${profile.specialization || 'General Physician'} at ${profile.name} in ${profile.city || 'India'}. ${profile.experience ? `${profile.experience}+ years experience.` : ''}`} />
        <meta name="keywords" content={`${profile.doctor_name}, ${profile.specialization || 'doctor'}, ${profile.city || 'clinic'}, ${profile.name}, appointment, consultation, ${profile.services || 'healthcare'}`} />
        <meta property="og:title" content={profile.meta_title || `Dr. ${profile.doctor_name} - ${profile.specialization || 'General Physician'}`} />
        <meta property="og:description" content={profile.meta_description || `Book appointment with Dr. ${profile.doctor_name}`} />
        <meta property="og:image" content={profile.doctor_photo || profile.clinic_photo || ''} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={profile.meta_title || `Dr. ${profile.doctor_name}`} />
        <meta name="twitter:description" content={profile.meta_description || `Book appointment with Dr. ${profile.doctor_name}`} />
        <meta name="twitter:image" content={profile.doctor_photo || profile.clinic_photo || ''} />
        <link rel="canonical" href={`https://clinicsathi.com/doctor/${profile.slug}`} />
      </Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 11 }}>CS</div>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>ClinicSathi</span>
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/doctors" style={{ color: '#2563eb', padding: '7px 12px', borderRadius: 10, fontWeight: 700, fontSize: 12, textDecoration: 'none', border: '1.5px solid #2563eb', whiteSpace: 'nowrap', display: 'block' }}>
              ← Doctors
            </Link>
            <Link href="/doctor/setup" style={{ background: '#2563eb', color: 'white', padding: '7px 12px', borderRadius: 10, fontWeight: 700, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          {/* Hero Section */}
          <div style={{ background: 'linear-gradient(135deg, #2563eb, #14b8a6)', padding: '32px 20px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 100, height: 100, borderRadius: 16, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {profile.doctor_photo ? (
                  <img src={profile.doctor_photo} alt={profile.doctor_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 36 }}>👨‍⚕️</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 900, margin: '0 0 6px', lineHeight: 1.2, wordBreak: 'break-word' }}>{profile.doctor_name}</h1>
                <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 600, margin: '0 0 6px', opacity: 0.95 }}>{profile.specialization || 'General Physician'}</p>
                {profile.degree && <p style={{ fontSize: 14, margin: '0 0 4px', opacity: 0.9 }}>{profile.degree}</p>}
                {profile.experience && <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{profile.experience}+ years experience</p>}
                <p style={{ fontSize: 14, margin: '6px 0 0', opacity: 0.9 }}>{profile.name}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ padding: '24px 16px' }}>
            {/* Clinic Photos */}
            {profile.clinic_photo && (
              <div style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {profile.clinic_photo.split(',').map((url, i) => url && (
                  <img key={i} src={url} alt={`${profile.name} ${i+1}`} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 16 }} />
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32, marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 8 }}>Location</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{profile.city || 'Not specified'}</div>
                {profile.address && <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{profile.address}</div>}
              </div>
              
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 8 }}>Contact</div>
                {profile.phone && <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{profile.phone}</div>}
              </div>

              {profile.consultation_fee && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 8 }}>Consultation Fee</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>₹{profile.consultation_fee}</div>
                </div>
              )}

              {profile.mci_number && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 8 }}>MCI Registration</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{profile.mci_number}</div>
                </div>
              )}
            </div>

            {/* Services */}
            {profile.services && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 12 }}>Services</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {profile.services.split(',').map((service, idx) => (
                    <span key={idx} style={{ background: '#f1f5f9', color: '#0f172a', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      {service.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Doctor */}
            {profile.about_doctor && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#64748b', marginBottom: 12 }}>About Dr. {profile.doctor_name}</div>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>{profile.about_doctor}</p>
              </div>
            )}

            {/* CTA Section */}
            <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(20,184,166,0.05))', borderRadius: 16, padding: '32px', textAlign: 'center', border: '1px solid rgba(37,99,235,0.1)' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Book an Appointment</h2>
              <p style={{ fontSize: 16, color: '#64748b', margin: '0 0 24px' }}>Visit {profile.name} and consult with Dr. {profile.doctor_name}</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
                    📞 Call Now
                  </a>
                )}
                <Link href="/doctor/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#2563eb', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', border: '2px solid #2563eb' }}>
                  Register Your Clinic
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center', marginTop: 32, color: '#94a3b8', fontSize: 14 }}>
          <p>Profile created on {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f1f5f9', background: 'white', padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>© 2026 ClinicSathi. Built for the Indian Subcontinent.</p>
      </footer>
    </div>
  );
}
