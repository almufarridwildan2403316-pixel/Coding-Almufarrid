import React, { useState } from 'react';
import type { ActivePage, ExperimentId, ExperimentRecord, LearningProgress, SolutionCategory } from '../types/chemistry';
import { EXPERIMENT_SAMPLES, type LabSample } from '../data/larutanData';
import { getExperimentRecordKey } from '../utils/experimentRecords';
import { ArrowRight, CheckCircle2, ClipboardList, X } from 'lucide-react';

interface LembarKerjaProps {
  progress: LearningProgress;
  setActivePage: (page: ActivePage) => void;
  onOpenLabSample: (sampleId: string, experimentId: ExperimentId) => void;
  onSaveConclusion: (text: string) => void;
}

interface WorksheetRow {
  experimentId: ExperimentId;
  sample: LabSample;
  record?: ExperimentRecord;
}

const categoryLabel = (category?: SolutionCategory | '') => {
  if (category === 'strong_electrolyte') return 'Elektrolit kuat';
  if (category === 'weak_electrolyte') return 'Elektrolit lemah';
  if (category === 'nonelectrolyte') return 'Nonelektrolit';
  return '—';
};

const lampLabel = (lamp?: string) => {
  if (lamp === 'bright') return 'Terang';
  if (lamp === 'dim') return 'Redup';
  if (lamp === 'off') return 'Mati';
  return '—';
};

const bubbleLabel = (bubbles?: string) => {
  if (bubbles === 'visible') return 'Banyak';
  if (bubbles === 'possible') return 'Sedikit';
  if (bubbles === 'not_expected') return 'Tidak ada';
  return '—';
};

const makeRows = (
  experimentId: ExperimentId,
  samples: LabSample[],
  records: LearningProgress['worksheetRecords'],
): WorksheetRow[] => samples.map((sample) => ({
  experimentId,
  sample,
  record: records[getExperimentRecordKey(experimentId, sample.id)],
}));

export const LembarKerja: React.FC<LembarKerjaProps> = ({
  progress,
  setActivePage,
  onOpenLabSample,
  onSaveConclusion,
}) => {
  const [generalConclusion, setGeneralConclusion] = useState(progress.worksheetConclusion?.text ?? '');
  const [submittedConclusion, setSubmittedConclusion] = useState(Boolean(progress.worksheetConclusion));
  const [selectedRow, setSelectedRow] = useState<WorksheetRow | null>(null);

  const experiment1Rows = makeRows('percobaan_1', EXPERIMENT_SAMPLES.percobaan_1, progress.worksheetRecords);
  const experiment2Rows = makeRows('percobaan_2', EXPERIMENT_SAMPLES.percobaan_2, progress.worksheetRecords);
  const allRows = [...experiment1Rows, ...experiment2Rows];
  const completedRows = allRows.filter((row) => row.record?.completed);
  const unfinishedCount = allRows.length - completedRows.length;
  const totalScore = completedRows.reduce((total, row) => total + (row.record?.score?.total ?? 0), 0);
  const maximumScore = completedRows.length * 3;
  const percentage = maximumScore ? Math.round((totalScore / maximumScore) * 100) : 0;
  const selectedRowCompleted = Boolean(selectedRow?.record?.completed);

  const renderTable = (rows: WorksheetRow[], experimentId: ExperimentId) => (
    <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '830px' }}>
        <thead>
          <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--slate-200)' }}>
            {['No.', 'Sampel', 'Rumus/komposisi', experimentId === 'percobaan_1' ? 'Kesimpulan siswa' : 'Prediksi awal', 'Lampu', 'Gelembung', 'Skor', 'Detail'].map((heading) => (
              <th key={heading} style={{ padding: '0.75rem', color: 'var(--navy-900)', fontSize: '0.76rem', fontWeight: 800, whiteSpace: 'nowrap' }}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const record = row.record;
            const completed = Boolean(record?.completed);
            return (
              <tr key={row.sample.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '0.7rem 0.75rem', color: 'var(--slate-500)', fontWeight: 700 }}>{String(index + 1).padStart(2, '0')}</td>
                <td style={{ padding: '0.7rem 0.75rem', color: 'var(--navy-900)', fontWeight: 700, minWidth: '150px' }}>
                  {row.sample.name}
                  {completed && <CheckCircle2 size={14} color="var(--teal-600)" style={{ verticalAlign: 'middle', marginLeft: '0.35rem' }} />}
                </td>
                <td style={{ padding: '0.7rem 0.75rem', fontFamily: 'var(--font-mono)', color: row.sample.accentColor, fontSize: '0.78rem' }}>{row.sample.formula}</td>
                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.8rem' }}>
                  {experimentId === 'percobaan_1'
                    ? categoryLabel(record?.conclusion)
                    : categoryLabel(record?.prediction)}
                </td>
                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.8rem' }}>{completed ? lampLabel(record?.lampObservation) : '—'}</td>
                <td style={{ padding: '0.7rem 0.75rem', fontSize: '0.8rem' }}>{completed ? bubbleLabel(record?.bubbleObservation) : '—'}</td>
                <td style={{ padding: '0.7rem 0.75rem', fontWeight: 800, color: completed ? 'var(--teal-800)' : 'var(--slate-400)', whiteSpace: 'nowrap' }}>
                  {completed ? `${record?.score?.total ?? 0}/3` : '—'}
                </td>
                <td style={{ padding: '0.7rem 0.75rem', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    className="btn btn-teal-light"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.74rem', marginRight: '0.35rem' }}
                    onClick={() => setSelectedRow(row)}
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.74rem' }}
                    onClick={() => onOpenLabSample(row.sample.id, experimentId)}
                  >
                    {completed ? 'Uji ulang' : 'Uji'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center', color: 'var(--teal-800)', fontSize: '0.82rem', fontWeight: 700 }}>
              <ClipboardList size={16} /> Lembar Kerja Praktikum
            </div>
            <h1 style={{ color: 'var(--navy-950)', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '0.35rem' }}>
              Rekap Pengamatan dan Penilaian
            </h1>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setActivePage('lab')}>
            Buka Laboratorium Virtual <ArrowRight size={16} />
          </button>
        </header>

        <section aria-label="Ringkasan pengerjaan" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Sampel selesai', value: `${completedRows.length}/${allRows.length}` },
            { label: 'Belum dikerjakan', value: String(unfinishedCount) },
            { label: 'Total skor', value: `${totalScore}/${maximumScore}` },
            { label: 'Persentase', value: `${percentage}%` },
          ].map((item) => (
            <div key={item.label} className="card" style={{ padding: '1rem 1.1rem' }}>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ color: 'var(--navy-900)', fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{item.value}</div>
            </div>
          ))}
        </section>

        <h2 style={{ color: 'var(--navy-900)', fontSize: '1.2rem', fontWeight: 800, margin: '1.4rem 0 0.75rem' }}>
          Percobaan 1 · Sampel larutan baku ({experiment1Rows.length})
        </h2>
        {renderTable(experiment1Rows, 'percobaan_1')}

        <h2 style={{ color: 'var(--navy-900)', fontSize: '1.2rem', fontWeight: 800, margin: '1.4rem 0 0.75rem' }}>
          Percobaan 2 · Larutan sehari-hari ({experiment2Rows.length})
        </h2>
        {renderTable(experiment2Rows, 'percobaan_2')}

        {selectedRow && (
          <section className="card" aria-live="polite" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderColor: 'var(--teal-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--teal-800)', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {selectedRow.experimentId === 'percobaan_1' ? 'Percobaan 1' : 'Percobaan 2'}
                </div>
                <h2 style={{ color: 'var(--navy-900)', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.15rem' }}>
                  {selectedRow.sample.name} <span style={{ fontFamily: 'var(--font-mono)', color: selectedRow.sample.accentColor }}>{selectedRow.sample.formula}</span>
                </h2>
              </div>
              <button type="button" className="btn btn-secondary" aria-label="Tutup detail" onClick={() => setSelectedRow(null)} style={{ padding: '0.45rem' }}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.82rem', marginTop: '0.3rem' }}>{selectedRow.sample.condition}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.8rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '9px', background: 'var(--slate-50)' }}>
                <strong>Prediksi siswa</strong>
                <p style={{ color: 'var(--slate-700)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {selectedRow.experimentId === 'percobaan_2'
                    ? categoryLabel(selectedRow.record?.prediction)
                    : 'Tidak ada prediksi pada percobaan ini'}
                  {selectedRow.experimentId === 'percobaan_2' && selectedRow.record?.predictionLocked && ' · Terkunci'}
                </p>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '9px', background: 'var(--slate-50)' }}>
                <strong>Hasil pengamatan siswa</strong>
                <p style={{ color: 'var(--slate-700)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Lampu: {lampLabel(selectedRow.record?.lampObservation)} · Gelembung: {bubbleLabel(selectedRow.record?.bubbleObservation)}
                </p>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '9px', background: selectedRowCompleted ? 'var(--teal-50)' : 'var(--slate-50)' }}>
                <strong>Kesimpulan acuan</strong>
                <p style={{ color: selectedRowCompleted ? 'var(--teal-900)' : 'var(--slate-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {selectedRowCompleted ? selectedRow.sample.categoryLabel : 'Tersedia setelah sampel diuji'}
                </p>
              </div>
            </div>
            {selectedRow.experimentId === 'percobaan_1' && (
              <p style={{ color: 'var(--slate-700)', fontSize: '0.85rem', marginTop: '0.8rem' }}>
                Kesimpulan siswa: <strong>{categoryLabel(selectedRow.record?.conclusion)}</strong>
              </p>
            )}
            <div style={{ marginTop: '0.85rem', padding: '0.9rem', borderRadius: '9px', border: '1px solid var(--slate-200)' }}>
              {selectedRowCompleted ? (
                <>
                  <p style={{ color: 'var(--navy-900)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <strong>Persamaan reaksi:</strong> {selectedRow.record?.referenceEquation ?? selectedRow.sample.equation}
                  </p>
                  <p style={{ color: 'var(--slate-700)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.35rem' }}>
                    <strong>Penjelasan:</strong> {selectedRow.record?.referenceExplanation ?? selectedRow.sample.explanation}
                  </p>
                </>
              ) : (
                <p style={{ color: 'var(--slate-600)', fontSize: '0.82rem' }}>Persamaan dan penjelasan acuan ditampilkan setelah sampel diuji.</p>
              )}
              {selectedRowCompleted && selectedRow.sample.safetyNote && (
                <p style={{ color: 'var(--slate-600)', fontSize: '0.78rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
                  <strong>Catatan:</strong> {selectedRow.record?.safetyNote ?? selectedRow.sample.safetyNote}
                </p>
              )}
            </div>
            <p style={{ color: 'var(--teal-900)', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.85rem' }}>
              Skor: {selectedRowCompleted ? `${selectedRow.record?.score?.total ?? 0}/${selectedRow.record?.score?.maximum ?? 3}` : 'Belum dinilai'}
              {selectedRow.record?.score && (
                <span style={{ color: 'var(--slate-600)', fontWeight: 500 }}>
                  {' '}· Lampu {selectedRow.record.score.lamp}, gelembung {selectedRow.record.score.bubbles}
                  {selectedRow.experimentId === 'percobaan_1'
                    ? `, kesimpulan ${selectedRow.record.score.classification ?? 0}`
                    : `, prediksi ${selectedRow.record.score.prediction ?? 0}`}
                </span>
              )}
            </p>
          </section>
        )}

        <section className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ color: 'var(--navy-900)', fontSize: '1.15rem', fontWeight: 800 }}>Analisis dan kesimpulan umum</h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem', margin: '0.35rem 0 0.8rem' }}>
            Bagian ini tidak menambah skor sampel. Gunakan hasil pengamatan untuk menjelaskan hubungan ion bergerak dengan daya hantar listrik.
          </p>
          <label htmlFor="general-conclusion" style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            Mengapa larutan garam, cuka, dan gula memiliki daya hantar listrik yang berbeda?
          </label>
          <textarea
            id="general-conclusion"
            rows={4}
            value={generalConclusion}
            onChange={(event) => { setGeneralConclusion(event.target.value); setSubmittedConclusion(false); }}
            placeholder="Jelaskan berdasarkan ion-ion yang dapat bergerak bebas di dalam larutan."
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--slate-300)', font: 'inherit', resize: 'vertical' }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '0.7rem' }}
            onClick={() => { onSaveConclusion(generalConclusion.trim()); setSubmittedConclusion(true); }}
            disabled={!generalConclusion.trim()}
          >
            Simpan kesimpulan
          </button>
          {submittedConclusion && (
            <div role="status" style={{ marginTop: '0.8rem', padding: '0.85rem', borderRadius: '9px', background: 'var(--teal-50)', color: 'var(--teal-900)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Daya hantar terjadi karena ion bermuatan dapat bergerak di dalam larutan. Elektrolit kuat menghasilkan banyak ion, elektrolit lemah hanya sebagian terionisasi, sedangkan nonelektrolit larut sebagai molekul netral. Nyala lampu dan gelembung pada simulasi merupakan indikator kualitatif.
            </div>
          )}
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem', padding: '1.25rem 1.5rem', borderRadius: '14px', background: '#fff', border: '1px solid var(--slate-200)' }}>
          <div>
            <h2 style={{ color: 'var(--navy-900)', fontSize: '1rem', fontWeight: 800 }}>Siap menguji pemahaman?</h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.82rem' }}>Lanjutkan ke evaluasi setelah menyelesaikan pengamatan.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setActivePage('evaluasi')}>Buka Evaluasi <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};
