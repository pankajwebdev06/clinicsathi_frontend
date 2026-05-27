'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLocale, LanguageToggle } from '@/features/i18n/LocaleProvider';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/v1\/?$/, '');

interface Doctor {
  id: string;
  name: string;
  slug: string;
  doctor_name: string;
  specialization: string | null;
  degree: string | null;
  experience: string | null;
  city: string | null;
  doctor_photo: string | null;
  consultation_fee: string | null;
}

export default function DoctorsPage() {
  const { t } = useLocale();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const params = new URLSearchParams();
        if (filterCity) params.append('city', filterCity);
        if (filterSpecialization) params.append('specialization', filterSpecialization);
        
        const res = await fetch(`${API_BASE}/api/v1/auth/public/doctors?${params}`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [filterCity, filterSpecialization]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head>
        <title>Doctors With Us - Find Best Doctors Near You | DoctorKaDost</title>
        <meta name="description" content="Browse our network of qualified doctors across India. Find specialists, general physicians, and healthcare providers in your city. Book appointments with trusted doctors on DoctorKaDost." />
        <meta name="keywords" content="doctors, physicians, specialists, healthcare, medical consultation, book appointment, find doctors near me" />
        <meta property="og:title" content="Doctors With Us - DoctorKaDost" />
        <meta property="og:description" content="Find the best doctors in your city. Browse our network of qualified healthcare providers." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Doctors With Us - DoctorKaDost" />
        <meta name="twitter:description" content="Find the best doctors in your city." />
        <link rel="canonical" href="https://doctorkadost.com/doctors" />
      </Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 11 }}>DK</div>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>DoctorKaDost</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <LanguageToggle compact />
            <Link href="/doctor/setup" style={{ background: '#2563eb', color: 'white', padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap', minHeight: 40, display: 'inline-flex', alignItems: 'center' }}>
              {t('common.register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #14b8a6)', padding: '60px 20px 80px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.2 }}>{t('directory.title')}</h1>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 500, margin: '24px auto 0' }}>
          <input
            type="text"
            placeholder={t('directory.cityFilter')}
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 500, minHeight: 48 }}
          />
          <input
            type="text"
            placeholder={t('directory.specFilter')}
            value={filterSpecialization}
            onChange={e => setFilterSpecialization(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 500, minHeight: 48 }}
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#64748b', fontWeight: 500 }}>Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>🔍</p>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{t('directory.noResults')}</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>Try adjusting your search filters or check back later.</p>
            <button
              onClick={() => { setFilterCity(''); setFilterSpecialization(''); }}
              style={{ background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>
              Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
              {doctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctor/${doctor.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      background: 'white',
                      borderRadius: 20,
                      border: '1px solid #f1f5f9',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Doctor Photo */}
                    <div style={{ height: 200, background: 'linear-gradient(135deg, #2563eb, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {doctor.doctor_photo ? (
                        <img src={doctor.doctor_photo} alt={doctor.doctor_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 64 }}>👨‍⚕️</span>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div style={{ padding: 20 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                        Dr. {doctor.doctor_name}
                      </h3>
                      {doctor.degree && (
                        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 8px', fontWeight: 600 }}>
                          {doctor.degree}
                        </p>
                      )}
                      {doctor.specialization && (
                        <p style={{ fontSize: 14, color: '#2563eb', margin: '0 0 8px', fontWeight: 700 }}>
                          {doctor.specialization}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 16 }}>📍</span>
                        <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                          {doctor.city || 'Location not specified'}
                        </span>
                      </div>
                      {doctor.experience && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 16 }}>⭐</span>
                          <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                            {doctor.experience}+ years experience
                          </span>
                        </div>
                      )}
                      {doctor.consultation_fee && (
                        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'inline-block', marginBottom: 16 }}>
                          ₹{doctor.consultation_fee} consultation
                        </div>
                      )}
                      <div style={{ width: '100%', textAlign: 'center', padding: '12px 0', background: '#f8fafc', color: '#2563eb', fontWeight: 700, fontSize: 14, borderRadius: 12, border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                        View Full Profile →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #f1f5f9', background: 'white', padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>© 2026 DoctorKaDost. Built for the Indian Subcontinent.</p>
      </footer>
    </div>
  );
}
