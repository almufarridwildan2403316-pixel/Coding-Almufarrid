import React, { useState } from 'react';
import { ArrowRight, FlaskConical } from 'lucide-react';
import type { StudentIdentity } from '../types/chemistry';

interface LoginProps {
  onLogin: (student: StudentIdentity) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    const normalizedClass = className.trim().replace(/\s+/g, ' ');

    if (!normalizedName || !normalizedClass) {
      setError('Nama dan kelas wajib diisi.');
      return;
    }

    onLogin({ name: normalizedName, className: normalizedClass });
  };

  return (
    <main className="lab-grid-pattern" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem 1rem' }}>
      <section className="card" style={{ width: '100%', maxWidth: '460px', padding: '2.25rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <div style={{ width: '46px', height: '46px', display: 'grid', placeItems: 'center', borderRadius: '12px', background: 'linear-gradient(135deg, var(--teal-600), var(--navy-900))', color: '#ffffff' }}>
            <FlaskConical size={25} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>Kimia<span style={{ color: 'var(--teal-600)' }}>Lab</span></div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Laboratorium Virtual Kimia SMA</div>
          </div>
        </div>

        <h1 style={{ fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 800, color: 'var(--navy-950)', marginBottom: '0.5rem' }}>
          Masuk untuk belajar
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          Isi nama dan kelas untuk membuka materi dan menyimpan progres belajar.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Nama
            <input
              autoComplete="name"
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama lengkap"
              style={{ width: '100%', padding: '0.8rem 0.9rem', border: '1px solid var(--slate-300)', borderRadius: '8px', font: 'inherit', fontWeight: 500, outlineColor: 'var(--teal-600)' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Kelas
            <input
              autoComplete="off"
              required
              maxLength={40}
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="Contoh: X IPA 1"
              style={{ width: '100%', padding: '0.8rem 0.9rem', border: '1px solid var(--slate-300)', borderRadius: '8px', font: 'inherit', fontWeight: 500, outlineColor: 'var(--teal-600)' }}
            />
          </label>

          {error && <p role="alert" style={{ color: '#b91c1c', fontSize: '0.84rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.35rem' }}>
            <span>Masuk ke KimiaLab</span>
            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
};