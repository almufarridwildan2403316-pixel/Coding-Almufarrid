import React, { useState } from 'react';
import type { ActivePage, LearningProgress } from '../types/chemistry';
import { SOLUTIONS } from '../data/solutionsData';
import { ClipboardList, CheckCircle2, ArrowRight } from 'lucide-react';

interface LembarKerjaProps {
  progress: LearningProgress;
  setActivePage: (page: ActivePage) => void;
  onOpenLabSample: (sampleId: string) => void;
  onSaveConclusion: (text: string) => void;
}

export const LembarKerja: React.FC<LembarKerjaProps> = ({
  progress,
  setActivePage,
  onOpenLabSample,
  onSaveConclusion,
}) => {
  const [generalConclusion, setGeneralConclusion] = useState<string>(progress.worksheetConclusion?.text ?? '');
  const [submittedConclusion, setSubmittedConclusion] = useState<boolean>(Boolean(progress.worksheetConclusion));

  const formatCategory = (cat?: string) => {
    if (cat === 'strong_electrolyte') return 'Elektrolit Kuat';
    if (cat === 'weak_electrolyte') return 'Elektrolit Lemah';
    if (cat === 'nonelectrolyte') return 'Non-Elektrolit';
    return '—';
  };

  const getLampText = (lamp?: string) => {
    if (lamp === 'bright') return '💡 Terang';
    if (lamp === 'dim') return '🔅 Redup';
    if (lamp === 'off') return '❌ Padam';
    return 'Belum diuji';
  };

  const getBubbleText = (bubble?: string) => {
    if (bubble === 'visible') return '🫧 Banyak';
    if (bubble === 'possible') return '🫧 Sedikit';
    if (bubble === 'not_expected') return '❌ Tidak Ada';
    return 'Belum diuji';
  };

  const totalTested = progress.testedSolutions.length;

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
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
              marginBottom: '0.5rem'
            }}>
              <ClipboardList size={15} color="var(--teal-600)" />
              <span>Lembar Kerja Praktikum Siswa</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em' }}>
              Tabel Pengamatan & Kesimpulan
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--slate-200)',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--navy-900)'
          }}>
            <span>Status Pengamatan:</span>
            <strong style={{ color: totalTested === 6 ? '#10b981' : 'var(--teal-700)' }}>{totalTested}/6 Sampel Selesai</strong>
          </div>
        </div>

        {/* Observation Table */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '2px solid var(--slate-200)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>No</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Nama Sampel</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Rumus Kimia</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal-800)' }}>Prediksi Awal</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Pengamatan Lampu</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Gelembung Gas</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Kesimpulan Akhir</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.88rem' }}>
              {SOLUTIONS.map((sol, index) => {
                const record = progress.worksheetRecords[sol.id];
                const isTested = progress.testedSolutions.includes(sol.id);

                return (
                  <tr key={sol.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                      0{index + 1}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                      {sol.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: sol.accentColor }}>
                      {sol.formula}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: record?.prediction ? 'var(--navy-800)' : 'var(--slate-400)' }}>
                      {formatCategory(record?.prediction)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {isTested ? getLampText(sol.expectedLamp) : <span style={{ color: 'var(--slate-400)' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {isTested ? getBubbleText(sol.expectedBubbles) : <span style={{ color: 'var(--slate-400)' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {isTested ? (
                        <span className={`badge ${
                          sol.category === 'strong_electrolyte' ? 'badge-strong' :
                          sol.category === 'weak_electrolyte' ? 'badge-weak' : 'badge-none'
                        }`}>
                          {sol.categoryLabel}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)' }}>Belum diuji</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => onOpenLabSample(sol.id)}
                        className="btn btn-teal-light"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        {isTested ? 'Uji Ulang' : 'Uji Sekarang'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Conclusion Input Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Pertanyaan Analisis & Kesimpulan Praktikum
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
            Berdasarkan data pengamatan di atas, jawab pertanyaan analisis berikut untuk menyimpulkan percobaan:
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Mengapa terdapat perbedaan kemampuan menghantarkan listrik antara larutan garam (NaCl), asam cuka (CH₃COOH), dan gula (sukrosa)?
            </label>
            <textarea
              rows={4}
              value={generalConclusion}
              onChange={(e) => {
                setGeneralConclusion(e.target.value);
                setSubmittedConclusion(false);
              }}
              placeholder="Tuliskan analisis Anda mengenai hubungan antara ion yang bebas bergerak dengan nyala lampu..."
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--slate-300)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={() => {
              onSaveConclusion(generalConclusion.trim());
              setSubmittedConclusion(true);
            }}
            className="btn btn-primary"
            style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
          >
            <span>Kirim & Periksa Kesimpulan</span>
          </button>

          {/* Teacher / Scientific Feedback Box */}
          {submittedConclusion && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--teal-50)',
              border: '1px solid var(--teal-200)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal-800)', fontWeight: 800, marginBottom: '0.4rem' }}>
                <CheckCircle2 size={18} color="var(--teal-600)" />
                <span>Umpan Balik Ilmiah (Kunci Pembahasan):</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                <strong>Analisis Benar:</strong> Daya hantar listrik terjadi karena <em>ion-ion bermuatan listrik yang dapat bergerak bebas</em> di dalam medium air. Larutan NaCl adalah elektrolit kuat karena 100% terdisosiasi menjadi ion Na⁺ dan Cl⁻ (lampu terang & gelembung banyak). Larutan CH₃COOH adalah elektrolit lemah karena hanya terionisasi sebagian (~1%) sehingga jumlah ion penghantar sedikit (lampu redup). Sedangkan larutan sukrosa adalah non-elektrolit karena molekulnya tidak menghasilkan ion sama sekali (lampu padam).
              </p>
            </div>
          )}
        </div>

        {/* CTA to Quiz */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-200)',
          padding: '1.5rem 2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Siap Menguji Penguasaan Konsep?
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              Kerjakan Evaluasi & Kuis (10 soal) untuk mendapatkan skor dan sertifikat kelulusan praktikum.
            </p>
          </div>
          <button
            onClick={() => setActivePage('evaluasi')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <span>Buka Kuis Evaluasi</span>
            <ArrowRight size={17} />
          </button>
        </div>

      </div>
    </div>
  );
};
