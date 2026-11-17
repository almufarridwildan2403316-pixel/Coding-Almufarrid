import { useState } from 'react';
import type { ActivePage, LearningProgress, StudentIdentity } from '../types/chemistry';
import {
  Atom,
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  X,
} from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  progress: LearningProgress;
  student: StudentIdentity;
  onLogout: () => void;
}

const navItems: { id: ActivePage; label: string; icon: typeof FlaskConical }[] = [
  { id: 'beranda', label: 'Beranda', icon: FlaskConical },
  { id: 'materi', label: 'Materi Konsep', icon: BookOpen },
  { id: 'lab', label: 'Laboratorium Virtual', icon: Atom },
  { id: 'lembar-kerja', label: 'Lembar Kerja', icon: ClipboardList },
  { id: 'evaluasi', label: 'Evaluasi & Kuis', icon: Award },
  { id: 'guru', label: 'Akses Guru', icon: ShieldCheck },
  { id: 'hasil', label: 'Hasil Belajar', icon: BarChart3 },
];

export const Navbar = ({ activePage, setActivePage, progress, student, onLogout }: NavbarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const testedCount = progress.testedSolutions.length;
  const progressPercent = Math.round((testedCount / 6) * 100);

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menu = (mobile = false) => (
    <nav className={mobile ? 'sidebar-nav sidebar-nav--mobile' : 'sidebar-nav'} aria-label="Navigasi utama">
      <span className="sidebar-section-label">MENU UTAMA</span>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`sidebar-link${activePage === id ? ' sidebar-link--active' : ''}`}
          onClick={() => handleNavClick(id)}
          title={!mobile && collapsed ? label : undefined}
          aria-label={!mobile && collapsed ? label : undefined}
          aria-current={activePage === id ? 'page' : undefined}
        >
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
          {activePage === id && <ChevronRight className="sidebar-link-indicator" size={16} aria-hidden="true" />}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`} aria-label="Sidebar KimiaLab">
        <button type="button" className="sidebar-brand" onClick={() => handleNavClick('beranda')} title="Kembali ke Beranda">
          <span className="sidebar-brand-icon"><FlaskConical size={23} /></span>
          <span className="sidebar-brand-copy">
            <span className="sidebar-brand-name">Kimia<span>Lab</span></span>
            <span className="sidebar-brand-subtitle">LABORATORIUM VIRTUAL</span>
          </span>
        </button>

        {menu()}

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-progress"
            onClick={() => handleNavClick('hasil')}
            title={collapsed ? `Progres: ${testedCount} dari 6 sampel` : undefined}
          >
            <span className="sidebar-progress-top">
              <span className="sidebar-progress-title"><BarChart3 size={16} /> Progres belajar</span>
              <strong>{testedCount}/6</strong>
            </span>
            <span className="sidebar-progress-track" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </span>
            <span className="sidebar-progress-caption">Sampel telah diuji</span>
          </button>

          <div className="sidebar-profile">
            <span className="sidebar-avatar" aria-hidden="true">{student.name.charAt(0).toUpperCase()}</span>
            <span className="sidebar-profile-copy">
              <strong>{student.name}</strong>
              <span>{student.className ? `Kelas ${student.className}` : student.email ?? 'Siswa'}</span>
            </span>
            <button type="button" className="sidebar-logout" onClick={onLogout} aria-label="Keluar dari akun" title="Keluar">
              <LogOut size={17} />
            </button>
          </div>

          <button
            type="button"
            className="sidebar-collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
            title={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Perkecil menu</span></>}
          </button>
        </div>
      </aside>

      <header className="mobile-header">
        <button type="button" className="mobile-brand" onClick={() => handleNavClick('beranda')}>
          <span className="sidebar-brand-icon"><FlaskConical size={21} /></span>
          <span className="sidebar-brand-name">Kimia<span>Lab</span></span>
        </button>
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <>
          <button type="button" className="sidebar-overlay" aria-label="Tutup menu" onClick={() => setMobileMenuOpen(false)} />
          <aside className="mobile-sidebar" aria-label="Navigasi KimiaLab">
            <div className="mobile-sidebar-heading">
              <span>Navigasi</span>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Tutup menu"><X size={20} /></button>
            </div>
            {menu(true)}
            <div className="mobile-sidebar-bottom">
              <span className="mobile-student-name">{student.name}</span>
              <button type="button" className="mobile-logout" onClick={() => { setMobileMenuOpen(false); onLogout(); }}>
                <LogOut size={17} /> Keluar dari akun
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};
