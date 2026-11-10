import React from 'react';
import type { ActivePage, LearningProgress } from '../types/chemistry';
import { SOLUTIONS } from '../data/solutionsData';
import { HeroMiniLab } from './HeroMiniLab';
import { 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Atom, 
  CheckCircle2, 
  Zap, 
  Award, 
  Compass, 
  Eye, 
  FileEdit, 
  Layers,
  Activity
} from 'lucide-react';

interface BerandaProps {
  setActivePage: (page: ActivePage) => void;
  progress: LearningProgress;
  onSelectSample: (sampleId: string) => void;
}

export const Beranda: React.FC<BerandaProps> = ({ 
  setActivePage, 
  progress, 
  onSelectSample 
}) => {
  const testedCount = progress.testedSolutions.length;
  const worksheetCount = Object.keys(progress.worksheetRecords).length;
  const mysteryCount = Object.values(progress.worksheetRecords).filter((record) => record.sampleType === 'mystery').length;
  const quizScore = progress.quizResult ? progress.quizResult.score : null;

  const handleStartLab = (sampleId?: string) => {
    if (sampleId) {
      onSelectSample(sampleId);
    }
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ padding: '3.5rem 0 4rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '3rem',
            alignItems: 'center'
          }} className="hero-grid">
            
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                color: 'var(--teal-800)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                boxShadow: '0 2px 6px rgba(20, 184, 166, 0.12)'
              }}>
                <Sparkles size={16} color="var(--teal-600)" />
                <span>Media Pembelajaran Kimia Interaktif · SMA Kelas X</span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: 'var(--navy-950)',
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}>
                Selidiki Daya Hantar Listrik Larutan di <span style={{
                  background: 'linear-gradient(135deg, var(--teal-600) 0%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Laboratorium Virtual</span>
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.08rem',
                color: 'var(--slate-600)',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                Hubungkan pengamatan <strong>makroskopis</strong> (nyala lampu & gelembung pada elektroda) dengan model <strong>mikroskopis</strong> ion-ion yang bergerak bebas dalam larutan elektrolit kuat, lemah, dan non-elektrolit.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <button
                  onClick={() => handleStartLab('S01')}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.6rem',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <FlaskConical size={20} />
                  <span>Mulai Praktikum Virtual</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => {
                    setActivePage('materi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <BookOpen size={19} color="var(--teal-700)" />
                  <span>Pelajari Materi Konsep</span>
                </button>
              </div>

              {/* Trust & Feature Badges */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.85rem',
                maxWidth: '520px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                    <Zap size={15} />
                  </div>
                  <span><strong>6 Sampel Standar</strong> (NaCl, HCl, dll)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                    <Atom size={15} />
                  </div>
                  <span><strong>Model Partikel Ion</strong> (Gerak Bebas)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                    <FileEdit size={15} />
                  </div>
                  <span><strong>Lembar Kerja Siswa</strong> (Data & Analisis)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                    <Award size={15} />
                  </div>
                  <span><strong>Kuis Evaluasi 10 Soal</strong> + Pembahasan</span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Mini Lab Preview */}
            <div>
              <HeroMiniLab onOpenFullLab={handleStartLab} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STUDENT PROGRESS JOURNEY CARD */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="container">
          <div className="card" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, var(--teal-50) 100%)',
            border: '1px solid var(--teal-200)',
            padding: '1.75rem 2rem',
            boxShadow: '0 8px 24px rgba(13, 148, 136, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              {/* Left description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Activity size={18} color="var(--teal-600)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal-800)', letterSpacing: '0.05em' }}>
                    Status Belajar Anda
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {testedCount === 0 && mysteryCount === 0
                    ? 'Anda belum memulai eksperimen virtual.'
                    : testedCount === 0
                    ? 'Anda telah mulai menyelidiki sampel misteri.'
                    : testedCount < 6
                    ? `Bagus! Anda telah menguji ${testedCount} dari 6 sampel siap uji.`
                    : '🎉 Luar biasa! Seluruh 6 sampel siap uji telah Anda selidiki!'}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                  Progres Anda otomatis tersimpan di peramban ini untuk pembelajaran mandiri.
                </p>
                {mysteryCount > 0 && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--teal-700)', marginTop: '0.25rem', fontWeight: 700 }}>
                    Anda juga telah mencatat {mysteryCount} percobaan sampel misteri.
                  </p>
                )}
              </div>

              {/* Progress Counters Grid */}
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Metric 1 */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal-700)', lineHeight: 1 }}>
                    {testedCount}<span style={{ fontSize: '1rem', color: 'var(--slate-400)' }}>/6</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.35rem' }}>
                    Sampel Siap Uji
                  </div>
                </div>

                {/* Metric 2 */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-800)', lineHeight: 1 }}>
                    {worksheetCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.35rem' }}>
                    Catatan Pengamatan
                  </div>
                </div>

                {/* Metric 3 */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: quizScore !== null ? '#10b981' : 'var(--slate-400)', lineHeight: 1 }}>
                    {quizScore !== null ? `${quizScore}` : '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.35rem' }}>
                    Skor Kuis
                  </div>
                </div>

                {/* Quick button */}
                <button
                  onClick={() => handleStartLab()}
                  className="btn btn-primary"
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.9rem',
                    borderRadius: '10px'
                  }}
                >
                  <span>{testedCount === 0 ? 'Mulai Eksperimen' : 'Lanjutkan Lab'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TUJUAN PEMBELAJARAN (LEARNING OBJECTIVES) */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.75rem auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--teal-700)',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              <Compass size={16} />
              <span>Capaian Pembelajaran Kimia Fase E</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Apa yang Akan Anda Kuasai di KimiaLab?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Didesain khusus untuk siswa SMA Kelas X agar memahami sains melalui pengalaman eksperimental mandiri, bukan sekadar hafalan teori.
            </p>
          </div>

          <div className="grid-4">
            {/* Card 1 */}
            <div className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-700)',
                marginBottom: '1.25rem'
              }}>
                <Eye size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                1. Makro vs Mikroskopis
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6, flex: 1 }}>
                Menghubungkan fenomena tampak (nyala terang lampu & gelembung elektroda) dengan keberadaan ion-ion bermuatan listrik yang bergerak bebas.
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                Target: Penjelasan Ilmiah Berbasis Bukti
              </div>
            </div>

            {/* Card 2 */}
            <div className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-700)',
                marginBottom: '1.25rem'
              }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                2. Klasifikasi 3 Larutan
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6, flex: 1 }}>
                Membedakan dengan tepat kategori <strong>Elektrolit Kuat</strong>, <strong>Elektrolit Lemah</strong>, dan <strong>Non-Elektrolit</strong> berdasarkan derajat ionisasinya (&alpha;).
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                Target: Analisis &alpha; = 1, 0 &lt; &alpha; &lt; 1, &alpha; = 0
              </div>
            </div>

            {/* Card 3 */}
            <div className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-700)',
                marginBottom: '1.25rem'
              }}>
                <FileEdit size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                3. Siklus Inkuiri Sains
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6, flex: 1 }}>
                Melatih keterampilan ilmiah siswa dalam membuat <strong>prediksi/hipotesis</strong>, melakukan observasi, mencatat ke tabel, dan merumuskan kesimpulan.
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                Target: Lembar Kerja Saintifik
              </div>
            </div>

            {/* Card 4 */}
            <div className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-700)',
                marginBottom: '1.25rem'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                4. Evaluasi & Pembahasan
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6, flex: 1 }}>
                Menguji pemahaman menyeluruh lewat 10 soal pilihan ganda standar asesmen SMA dengan umpan balik langsung dan pembahasan kimia komprehensif.
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--teal-700)' }}>
                Target: Asesmen 100 Poin
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KATALOG 6 SAMPEL STANDAR LABORATORIUM (GRID SHOWCASE) */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--teal-700)',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem'
              }}>
                <FlaskConical size={16} />
                <span>Sampel Praktikum Virtual (PRD Spesifikasi 7.2)</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em' }}>
                6 Larutan Uji Eksperimen
              </h2>
            </div>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', maxWidth: '420px', lineHeight: 1.5 }}>
              Setiap sampel memiliki karakteristik ionisasi dan pengamatan makroskopis unik. Klik salah satu untuk langsung melakukan pengujian.
            </p>
          </div>

          <div className="grid-3">
            {SOLUTIONS.map((sol) => {
              const isTested = progress.testedSolutions.includes(sol.id);
              const badgeClass = 
                sol.category === 'strong_electrolyte' ? 'badge-strong' :
                sol.category === 'weak_electrolyte' ? 'badge-weak' : 'badge-none';

              return (
                <div 
                  key={sol.id} 
                  className="card card-interactive" 
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top indicator bar matching accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: sol.accentColor
                  }} />

                  {/* Header info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className={`badge ${badgeClass}`}>
                        {sol.categoryLabel}
                      </span>
                    </div>
                    {isTested && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--teal-700)',
                        backgroundColor: 'var(--teal-50)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        border: '1px solid var(--teal-200)'
                      }}>
                        <CheckCircle2 size={13} color="var(--teal-600)" />
                        Sudah Diuji
                      </span>
                    )}
                  </div>

                  {/* Name & Formula */}
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.2rem' }}>
                    {sol.name}
                  </h3>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: sol.accentColor,
                    marginBottom: '0.85rem'
                  }}>
                    {sol.formula}
                  </div>

                  {/* Chemical equation box */}
                  <div style={{
                    backgroundColor: 'var(--slate-50)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-200)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--slate-800)',
                    marginBottom: '1rem'
                  }}>
                    {sol.equation}
                  </div>

                  {/* Macroscopic expectation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.83rem', marginBottom: '1.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Nyala Lampu:</span>
                      <strong style={{ color: 'var(--navy-900)' }}>
                        {sol.expectedLamp === 'bright' ? '💡 Terang Benderang' : sol.expectedLamp === 'dim' ? '🔅 Redup' : '❌ Tidak Menyala (Mati)'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Gelembung Gas:</span>
                      <strong style={{ color: 'var(--navy-900)' }}>
                        {sol.expectedBubbles === 'visible' ? '🫧 Banyak di Elektroda' : sol.expectedBubbles === 'possible' ? '🫧 Sedikit / Halus' : 'Tidak Terbentuk'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Derajat Ionisasi:</span>
                      <strong style={{ color: 'var(--navy-900)', fontFamily: 'var(--font-mono)' }}>
                        {sol.degreeOfIonization}
                      </strong>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleStartLab(sol.id)}
                    className="btn btn-teal-light"
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700
                    }}
                  >
                    <FlaskConical size={16} />
                    <span>Uji Sampel Ini di Lab</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ALUR PRAKTIKUM 4 TAHAP (HOW IT WORKS) */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="container">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--slate-200)',
            padding: '3rem 2.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--teal-700)',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem'
              }}>
                <Zap size={16} />
                <span>Langkah Praktikum Mandiri</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em' }}>
                4 Langkah Mudah Melakukan Simulasi
              </h2>
            </div>

            <div className="grid-4">
              {/* Step 1 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--teal-100)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  01
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Pilih Sampel & Prediksi
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Pilih salah satu dari 6 larutan kimia. Sebelum saklar dinyalakan, buat prediksi ilmiah apakah larutan tergolong kuat, lemah, atau non-elektrolit.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--teal-100)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  02
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Aktifkan Rangkaian Listrik
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Tutup saklar pada alat uji daya hantar virtual untuk mengalirkan arus listrik dari sumber tegangan DC ke kedua batang elektroda karbon.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--teal-100)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  03
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Amati Makro & Mikro
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Perhatikan nyala lampu dan timbulnya gelembung gas, sekaligus teliti pergerakan ion positif & negatif atau molekul netral pada mikroskop virtual.
                </p>
              </div>

              {/* Step 4 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--teal-100)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  04
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Rekam & Ambil Kesimpulan
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                  Catat hasil ke lembar kerja praktikum, cocokkan dengan hipotesis awal, dan uji pemahaman lewat kuis evaluasi 10 soal dengan pembahasan langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TABEL RINGKASAN KOMPARASI ILMIAH */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Klasifikasi Daya Hantar Listrik Larutan
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)' }}>
              Pedoman pembanding resmi materi kimia SMA Kelas X untuk menginterpretasikan hasil pengamatan laboratorium.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--slate-200)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', textTransform: 'uppercase' }}>
                    Parameter Analisis
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--strong-text)', textTransform: 'uppercase' }}>
                    Elektrolit Kuat
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--weak-text)', textTransform: 'uppercase' }}>
                    Elektrolit Lemah
                  </th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--non-text)', textTransform: 'uppercase' }}>
                    Non-Elektrolit
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.88rem', color: 'var(--slate-700)' }}>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>Derajat Ionisasi (&alpha;)</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--teal-700)' }}>&alpha; = 1 (100%)</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#d97706' }}>0 &lt; &alpha; &lt; 1 (sebagian)</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-500)' }}>&alpha; = 0 (0%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>Kondisi Nyala Lampu</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>💡 Menyala Terang</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>🔅 Menyala Redup / Mati</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>❌ Tidak Menyala (Mati)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>Gelembung Gas Elektroda</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>🫧 Banyak gelembung</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>🫧 Sedikit / halus</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>❌ Tidak ada gelembung</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>Partikel dalam Larutan</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>Seluruhnya ion-ion bebas</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>Campuran molekul & sedikit ion</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>Hanya molekul netral utuh</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>Contoh Sampel di Lab</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>NaCl(aq), HCl(aq)</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>CH₃COOH(aq), NH₃(aq)</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>Sukrosa, Etanol</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 60%, var(--teal-950) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 40px -15px rgba(10, 20, 47, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background sparkle decoration */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px', margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(20, 184, 166, 0.2)',
                border: '1px solid rgba(20, 184, 166, 0.4)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                color: '#5eead4',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={15} />
                <span>Siap Memulai Eksperimen Ilmiah?</span>
              </div>

              <h2 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                Buka Laboratorium Virtual & Uji Hipotesis Anda Sekarang
              </h2>

              <p style={{ fontSize: '1rem', color: 'var(--slate-300)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Uji keenam sampel larutan, amati nyala lampu serta pergerakan ion mikroskopis, dan rekam hasilnya ke dalam lembar kerja praktikum digital.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStartLab('S01')}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '1rem',
                    borderRadius: '12px'
                  }}
                >
                  <FlaskConical size={20} />
                  <span>Mulai Uji Larutan NaCl</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => {
                    setActivePage('evaluasi');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.85rem 1.6rem',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff'
                  }}
                >
                  <Award size={19} color="#5eead4" />
                  <span>Coba Kuis Evaluasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Responsive Styles */}
      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};
