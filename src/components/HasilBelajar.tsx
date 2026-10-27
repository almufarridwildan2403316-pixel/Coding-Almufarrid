import React from 'react';
import type { ActivePage, LearningProgress } from '../types/chemistry';
import { SOLUTIONS } from '../data/solutionsData';
import { BarChart3, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface HasilBelajarProps {
  progress: LearningProgress;
  setActivePage: (page: ActivePage) => void;
  onResetProgress: () => void;
}

export const HasilBelajar: React.FC<HasilBelajarProps> = ({
  progress,
  setActivePage,
  onResetProgress,
}) => {
  const testedCount = progress.testedSolutions.length;
  const worksheetCount = Object.keys(progress.worksheetRecords).length;
  const quizScore = progress.quizResult ? progress.quizResult.score : null;

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'var(--teal-50)',
            border: '1px solid var(--teal-200)',
            color: 'var(--teal-800)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <BarChart3 size={15} color="var(--teal-600)" />
            <span>Rekapitulasi Belajar & Sertifikasi</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Portofolio Hasil Belajar KimiaLab
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Ringkasan seluruh aktivitas eksperimen virtual, pengisian lembar kerja, dan nilai evaluasi mandiri Anda.
          </p>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Sampel Diuji
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--teal-700)', lineHeight: 1, marginBottom: '0.35rem' }}>
              {testedCount} <span style={{ fontSize: '1.2rem', color: 'var(--slate-400)' }}>/ 6</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
              {testedCount === 6 ? '✓ Lengkap semua sampel' : 'Belum seluruh sampel diuji'}
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Lembar Kerja Terisi
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy-900)', lineHeight: 1, marginBottom: '0.35rem' }}>
              {worksheetCount} <span style={{ fontSize: '1.2rem', color: 'var(--slate-400)' }}>/ 6</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
              Data observasi tersimpan
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Nilai Kuis Akhir
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: quizScore !== null ? '#10b981' : 'var(--slate-400)', lineHeight: 1, marginBottom: '0.35rem' }}>
              {quizScore !== null ? `${quizScore}` : '—'}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
              {quizScore !== null ? (quizScore >= 80 ? '✓ Tuntas (Kompeten)' : 'Perlu Pengayaan') : 'Kuis belum dikerjakan'}
            </p>
          </div>
        </div>

        {/* Detailed Solutions Status Checklist */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Daftar Verifikasi 6 Sampel Laboratorium
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SOLUTIONS.map((sol) => {
              const isTested = progress.testedSolutions.includes(sol.id);
              return (
                <div 
                  key={sol.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: isTested ? 'var(--teal-50)' : 'var(--slate-50)',
                    border: isTested ? '1px solid var(--teal-200)' : '1px solid var(--slate-200)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isTested ? 'var(--teal-600)' : 'var(--slate-300)',
                      color: '#ffffff'
                    }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy-900)' }}>
                        {sol.name} <span style={{ fontFamily: 'var(--font-mono)', color: sol.accentColor }}>({sol.formula})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        Kategori: {sol.categoryLabel} · {sol.degreeOfIonization}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${
                    sol.category === 'strong_electrolyte' ? 'badge-strong' :
                    sol.category === 'weak_electrolyte' ? 'badge-weak' : 'badge-none'
                  }`}>
                    {isTested ? 'Selesai Diuji' : 'Belum Diuji'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onResetProgress}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}
          >
            <RotateCcw size={16} />
            <span>Reset Seluruh Progres</span>
          </button>

          <button
            onClick={() => setActivePage('beranda')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Kembali ke Beranda</span>
            <ArrowRight size={17} />
          </button>
        </div>

      </div>
    </div>
  );
};
