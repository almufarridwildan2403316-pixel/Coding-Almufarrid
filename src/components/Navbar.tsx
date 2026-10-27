import React, { useState } from 'react';
import type { ActivePage, LearningProgress } from '../types/chemistry';
import { 
  FlaskConical, 
  BookOpen, 
  Atom, 
  ClipboardList, 
  Award, 
  BarChart3, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  progress: LearningProgress;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const testedCount = progress.testedSolutions.length;
  const progressPercent = Math.round((testedCount / 6) * 100);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <FlaskConical size={18} /> },
    { id: 'materi', label: 'Materi Konsep', icon: <BookOpen size={18} /> },
    { id: 'lab', label: 'Laboratorium Virtual', icon: <Atom size={18} /> },
    { id: 'lembar-kerja', label: 'Lembar Kerja', icon: <ClipboardList size={18} /> },
    { id: 'evaluasi', label: 'Evaluasi & Kuis', icon: <Award size={18} /> },
    { id: 'hasil', label: 'Hasil Belajar', icon: <BarChart3 size={18} /> },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--slate-200)',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('beranda')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--navy-900) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
          }}>
            <FlaskConical size={24} color="#5eead4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
                Kimia<span style={{ color: 'var(--teal-600)' }}>Lab</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: 'var(--teal-100)',
                color: 'var(--teal-800)',
                textTransform: 'uppercase'
              }}>
                SMA X
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 500 }}>
              Virtual Electrolyte Laboratory
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.35rem' }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--teal-700)' : 'var(--slate-700)',
                  backgroundColor: isActive ? 'var(--teal-50)' : 'transparent',
                  border: isActive ? '1px solid var(--teal-200)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--slate-100)';
                    e.currentTarget.style.color = 'var(--navy-900)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--slate-700)';
                  }
                }}
              >
                <span style={{ color: isActive ? 'var(--teal-600)' : 'var(--slate-500)' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Progress Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => handleNavClick('hasil')}
            title="Lihat progres belajar Anda"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--slate-100)',
              border: '1px solid var(--slate-200)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--navy-900)',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={15} color="#0d9488" />
            <span>Progres: <strong style={{ color: 'var(--teal-700)' }}>{testedCount}/6</strong> Sampel</span>
            <div style={{
              width: '40px',
              height: '6px',
              borderRadius: '999px',
              backgroundColor: 'var(--slate-300)',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--teal-500)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--slate-300)',
              background: '#ffffff',
              cursor: 'pointer',
              color: 'var(--slate-800)'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--slate-200)',
          padding: '1rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--teal-800)' : 'var(--slate-700)',
                    backgroundColor: isActive ? 'var(--teal-50)' : 'transparent',
                    border: isActive ? '1px solid var(--teal-200)' : '1px solid transparent',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ color: isActive ? 'var(--teal-600)' : 'var(--slate-500)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Responsive Inline CSS rules */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
