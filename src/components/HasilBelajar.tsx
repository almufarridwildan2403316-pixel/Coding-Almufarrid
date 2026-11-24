import React from 'react';
import type { ActivePage, ExperimentId, LearningProgress } from '../types/chemistry';
import { EXPERIMENT_SAMPLES, type LabSample } from '../data/larutanData';
import { getExperimentRecordKey } from '../utils/experimentRecords';
import { ArrowRight, BarChart3, RotateCcw } from 'lucide-react';

interface HasilBelajarProps {
  progress: LearningProgress;
  setActivePage: (page: ActivePage) => void;
  onResetProgress: () => void;
}

interface ProgressRow {
  experimentId: ExperimentId;
  sample: LabSample;
  record: LearningProgress['worksheetRecords'][string] | undefined;
}

const categoryLabel = (category?: string) => {
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

const formatFormula = (formula: string) => formula.split(/(\d+)/).map((part, index) => (
  /^\d+$/.test(part) ? <sub key={index}>{part}</sub> : part
));

const rowsFor = (
  experimentId: ExperimentId,
  samples: LabSample[],
  records: LearningProgress['worksheetRecords'],
): ProgressRow[] => samples.map((sample) => ({
  experimentId,
  sample,
  record: records[getExperimentRecordKey(experimentId, sample.id)],
}));

export const HasilBelajar: React.FC<HasilBelajarProps> = ({
  progress,
  setActivePage,
  onResetProgress,
}) => {
  const experiment1Rows = rowsFor('percobaan_1', EXPERIMENT_SAMPLES.percobaan_1, progress.worksheetRecords);
  const experiment2Rows = rowsFor('percobaan_2', EXPERIMENT_SAMPLES.percobaan_2, progress.worksheetRecords);
  const allRows = [...experiment1Rows, ...experiment2Rows];
  const completedRows = allRows.filter((row) => row.record?.completed);
  const unfinishedCount = allRows.length - completedRows.length;
  const quizScore = progress.quizResult?.score ?? null;
  const quizAttempts = [...(progress.quizSubmissions ?? [])]
    .filter((submission) => !submission.quizId || submission.quizId === 'electrolyte-evaluation-v1')
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));

  const getExperimentSummary = (rows: ProgressRow[]) => {
    const completed = rows.filter((row) => row.record?.completed);
    return {
      completed: completed.length,
      total: rows.length,
    };
  };

  const experiment1Summary = getExperimentSummary(experiment1Rows);
  const experiment2Summary = getExperimentSummary(experiment2Rows);

  const renderSampleTable = (rows: ProgressRow[]) => (
    <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
        <thead>
          <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--slate-200)' }}>
            {['Sampel', 'Jawaban siswa', 'Lampu', 'Gelembung', 'Status'].map((heading) => (
              <th key={heading} style={{ padding: '0.75rem', color: 'var(--navy-900)', fontSize: '0.76rem', fontWeight: 800, whiteSpace: 'nowrap' }}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ experimentId, sample, record }) => {
            const completed = Boolean(record?.completed);
            const studentAnswer = experimentId === 'percobaan_1'
              ? categoryLabel(record?.conclusion)
              : categoryLabel(record?.prediction);
            return (
              <tr key={sample.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '0.7rem 0.75rem', minWidth: '210px' }}>
                  <div style={{ color: 'var(--navy-900)', fontWeight: 700 }}>{sample.name}</div>
                  <div style={{ color: sample.accentColor, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.1rem' }}>
                    {formatFormula(sample.formula)}
                  </div>
                </td>
                <td style={{ padding: '0.7rem 0.75rem', color: completed ? 'var(--slate-700)' : 'var(--slate-400)', fontSize: '0.82rem' }}>
                  {completed ? studentAnswer : record?.predictionLocked && experimentId === 'percobaan_2'
                    ? `${studentAnswer} (prediksi terkunci)`
                    : 'Belum ada jawaban'}
                </td>
                <td style={{ padding: '0.7rem 0.75rem', color: completed ? 'var(--slate-700)' : 'var(--slate-400)', fontSize: '0.82rem' }}>
                  {completed ? lampLabel(record?.lampObservation) : '—'}
                </td>
                <td style={{ padding: '0.7rem 0.75rem', color: completed ? 'var(--slate-700)' : 'var(--slate-400)', fontSize: '0.82rem' }}>
                  {completed ? bubbleLabel(record?.bubbleObservation) : '—'}
                </td>
                <td style={{ padding: '0.7rem 0.75rem' }}>
                  <span className={`badge ${completed ? 'badge-strong' : 'badge-none'}`}>
                    {completed ? 'Selesai' : 'Belum selesai'}
                  </span>
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
      <div className="container" style={{ maxWidth: '1080px' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--teal-50)',
            border: '1px solid var(--teal-200)',
            color: 'var(--teal-800)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            <BarChart3 size={15} color="var(--teal-600)" />
            <span>Rekapitulasi Belajar</span>
          </div>
          <h1 style={{ color: 'var(--navy-950)', fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Hasil Belajar KimiaLab
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Progres hasil simulasi lab virtual dan hasil evaluasi Anda.
          </p>
        </header>

        <section aria-label="Ringkasan hasil belajar" className="grid-3" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'Sampel selesai', value: `${completedRows.length}/${allRows.length}`, note: `${unfinishedCount} belum dikerjakan` },
            { label: 'Kesimpulan umum', value: progress.worksheetConclusion ? 'Tersimpan' : 'Belum ada', note: 'Isian Lembar Kerja' },
            { label: 'Nilai evaluasi', value: quizScore === null ? '—' : `${quizScore}`, note: quizScore === null ? 'Evaluasi belum dikerjakan' : quizScore >= 80 ? 'Tuntas (kompeten)' : 'Perlu pengayaan' },
          ].map((item) => (
            <div key={item.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ color: 'var(--navy-900)', fontSize: '1.7rem', fontWeight: 900, lineHeight: 1.2, margin: '0.45rem 0 0.25rem' }}>{item.value}</div>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>{item.note}</p>
            </div>
          ))}
        </section>

        <section aria-label="Riwayat percobaan kuis" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--navy-900)', fontSize: '1.15rem', fontWeight: 800, margin: '1.4rem 0 0.75rem' }}>
            Riwayat Percobaan Evaluasi
          </h2>
          {quizAttempts.length === 0 ? (
            <div className="card" style={{ padding: '1.25rem', color: 'var(--slate-600)' }}>
              Belum ada percobaan evaluasi yang dikirim.
            </div>
          ) : (
            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '520px' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--slate-200)' }}>
                    {['Percobaan', 'Waktu dikirim', 'Nilai', 'Jawaban benar'].map((heading) => (
                      <th key={heading} style={{ padding: '0.75rem', color: 'var(--navy-900)', fontSize: '0.76rem', fontWeight: 800 }}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quizAttempts.map((attempt) => (
                    <tr key={attempt.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--navy-900)', fontWeight: 700 }}>
                        Percobaan #{attempt.attemptNumber}
                        {attempt.id === progress.quizResult?.id && (
                          <span className="badge badge-teal" style={{ marginLeft: '0.5rem' }}>Terbaru</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--slate-600)', whiteSpace: 'nowrap' }}>
                        {new Date(attempt.submittedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--teal-700)', fontWeight: 800 }}>{attempt.score}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--slate-700)' }}>
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-label="Progres setiap percobaan" className="grid-2" style={{ marginBottom: '1.75rem' }}>
          {[
            { title: 'Percobaan 1 · Sampel larutan baku', summary: experiment1Summary },
            { title: 'Percobaan 2 · Larutan sehari-hari', summary: experiment2Summary },
          ].map(({ title, summary }) => (
            <div key={title} className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ color: 'var(--navy-900)', fontSize: '1rem', fontWeight: 800 }}>{title}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.8rem', color: 'var(--slate-700)', fontSize: '0.85rem' }}>
                <span>Sampel selesai</span>
                <strong>{summary.completed}/{summary.total}</strong>
              </div>
              <div style={{ height: '9px', borderRadius: '999px', background: 'var(--slate-100)', overflow: 'hidden', marginTop: '0.45rem' }}>
                <div style={{ height: '100%', width: `${summary.total ? (summary.completed / summary.total) * 100 : 0}%`, background: 'var(--teal-600)', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--navy-900)', fontSize: '1.15rem', fontWeight: 800, margin: '1.4rem 0 0.75rem' }}>
            Percobaan 1 · Sampel baku
          </h2>
          {renderSampleTable(experiment1Rows)}
        </section>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--navy-900)', fontSize: '1.15rem', fontWeight: 800, margin: '1.4rem 0 0.75rem' }}>
            Percobaan 2 · Larutan sehari-hari
          </h2>
          {renderSampleTable(experiment2Rows)}
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onResetProgress}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}
          >
            <RotateCcw size={16} />
            Reset seluruh progres
          </button>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setActivePage('lembar-kerja')} className="btn btn-secondary">
              Buka Lembar Kerja
            </button>
            <button type="button" onClick={() => setActivePage('lab')} className="btn btn-primary">
              Laboratorium Virtual <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
