import React from 'react';
import type { ActivePage } from '../types/chemistry';
import { FlaskConical, RotateCcw, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onResetProgress: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onResetProgress }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--navy-950)',
      color: '#ffffff',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '4rem 0 2rem 0',
      marginTop: '5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--navy-800) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5eead4'
              }}>
                <FlaskConical size={22} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Kimia<span style={{ color: '#2dd4bf' }}>Lab</span>
              </span>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Platform laboratorium virtual interaktif untuk siswa SMA Kelas X dalam menyelidiki kemampuan larutan menghantarkan arus listrik melalui pendekatan sains saintifik dan visualisasi gerak ion.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#99f6e4', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Sesuai Capaian Pembelajaran Kimia SMA Fase E</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigasi Belajar
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Beranda Utama', page: 'beranda' as ActivePage },
                { label: 'Materi & Konsep Ion', page: 'materi' as ActivePage },
                { label: 'Laboratorium Virtual', page: 'lab' as ActivePage },
                { label: 'Lembar Kerja Praktikum', page: 'lembar-kerja' as ActivePage },
                { label: 'Evaluasi & Kuis (10 Pilihan Ganda + 2 Esai)', page: 'evaluasi' as ActivePage },
                { label: 'Akses Guru / Teacher Dashboard', page: 'guru' as ActivePage },
                { label: 'Ringkasan Hasil Belajar', page: 'hasil' as ActivePage },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => {
                      setActivePage(link.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--slate-400)',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      textAlign: 'left',
                      padding: 0,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2dd4bf')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 6 Larutan Standar */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              6 Sampel Eksperimen
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ color: 'var(--slate-300)' }}>• NaCl(aq) (Garam)</div>
              <div style={{ color: 'var(--slate-300)' }}>• HCl(aq) (Asam Klorida)</div>
              <div style={{ color: 'var(--slate-300)' }}>• CH₃COOH(aq) (Cuka)</div>
              <div style={{ color: 'var(--slate-300)' }}>• NH₃(aq) (Amonia)</div>
              <div style={{ color: 'var(--slate-300)' }}>• Sukrosa (Gula)</div>
              <div style={{ color: 'var(--slate-300)' }}>• Etanol (Alkohol)</div>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={onResetProgress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Hapus riwayat simulasi dan kuis untuk mengulang dari awal"
              >
                <RotateCcw size={14} />
                <span>Reset Progres Belajar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--slate-500)'
        }}>
          <div>
            © 2026 <strong>KimiaLab</strong>. Media Pembelajaran Kimia Virtual SMA Kelas X.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Didesain dengan pendekatan saintifik 5M</span>
            <span style={{ color: '#2dd4bf' }}>•</span>
            <span>Versi 1.0 (MVP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
