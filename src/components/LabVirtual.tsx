import React, { useState } from 'react';
import type {
  ActivePage,
  ExperimentId,
  ExperimentRecord,
  LearningProgress,
  SolutionCategory,
} from '../types/chemistry';
import { EXPERIMENT_SAMPLES, getExperimentSample, type LabSample } from '../data/larutanData';
import { getExperimentRecordKey, scoreExperiment1, scoreExperiment2 } from '../utils/experimentRecords';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Power,
  RotateCcw,
} from 'lucide-react';

interface LabVirtualProps {
  initialSampleId?: string;
  initialExperimentId?: ExperimentId;
  progress: LearningProgress;
  onSaveRecord: (record: ExperimentRecord) => void;
  onOpenWorksheet: () => void;
  setActivePage: (page: ActivePage) => void;
}

const categoryOptions: { value: SolutionCategory; label: string }[] = [
  { value: 'strong_electrolyte', label: 'Elektrolit kuat' },
  { value: 'weak_electrolyte', label: 'Elektrolit lemah' },
  { value: 'nonelectrolyte', label: 'Nonelektrolit' },
];

const lampOptions: { value: LabSample['expectedLamp']; label: string }[] = [
  { value: 'bright', label: 'Terang' },
  { value: 'dim', label: 'Redup' },
  { value: 'off', label: 'Mati' },
];

const bubbleOptions: { value: LabSample['expectedBubbles']; label: string }[] = [
  { value: 'visible', label: 'Banyak' },
  { value: 'possible', label: 'Sedikit' },
  { value: 'not_expected', label: 'Tidak ada' },
];

const experimentProcedures: Record<ExperimentId, { title: string; steps: string[] }> = {
  percobaan_1: {
    title: 'Prosedur Percobaan 1 · Sampel larutan baku',
    steps: [
      'Pilih satu sampel baku pada daftar, lalu baca nama, rumus, dan kondisi sampelnya.',
      'Tekan Saklar OFF hingga berubah menjadi ON. Amati terang, redup, atau matinya lampu serta jumlah gelembung di sekitar elektroda.',
      'Pada bagian Catat Pengamatan, pilih nyala lampu dan jumlah gelembung yang kamu amati.',
      'Pilih kesimpulan jenis larutan berdasarkan hasil pengamatan: elektrolit kuat, elektrolit lemah, atau nonelektrolit.',
      'Tekan Periksa Jawaban. Baca umpan balik dan persamaan reaksinya; hasil dan skor tersimpan otomatis di Lembar Kerja.',
    ],
  },
  percobaan_2: {
    title: 'Prosedur Percobaan 2 · Larutan sehari-hari',
    steps: [
      'Pilih satu sampel larutan sehari-hari, lalu baca komposisi asumsi dan kondisi simulasi yang ditampilkan.',
      'Pilih prediksi awal jenis larutan sebelum melihat hasil simulasi, lalu tekan Kunci Prediksi. Prediksi yang dikunci tidak dapat diubah.',
      'Setelah prediksi terkunci, tekan Saklar OFF hingga berubah menjadi ON. Amati nyala lampu dan gelembung di sekitar elektroda.',
      'Pilih nyala lampu dan jumlah gelembung yang kamu amati pada bagian Catat Pengamatan.',
      'Tekan Periksa Jawaban. Bandingkan prediksi dan pengamatanmu dengan kategori acuan, lalu pelajari persamaan reaksi serta penjelasannya.',
      'Skor berdasarkan prediksi, lampu, dan gelembung akan tersimpan otomatis di Lembar Kerja.',
    ],
  },
};

const categoryLabel = (category: SolutionCategory): string =>
  categoryOptions.find((option) => option.value === category)?.label ?? category;

const lampLabel = (lamp: LabSample['expectedLamp']): string =>
  lampOptions.find((option) => option.value === lamp)?.label ?? lamp;

const recordFor = (
  progress: LearningProgress,
  experimentId: ExperimentId,
  sampleId: string,
): ExperimentRecord | undefined =>
  progress.worksheetRecords[getExperimentRecordKey(experimentId, sampleId)];

const bubblePositions = Array.from({ length: 14 }, (_, index) => ({
  x: [174, 214, 306, 346][index % 4],
  y: 420 - Math.floor(index / 4) * 35 - (index % 2) * 8,
}));

export const LabVirtual: React.FC<LabVirtualProps> = ({
  initialSampleId = EXPERIMENT_SAMPLES.percobaan_1[0].id,
  initialExperimentId = 'percobaan_1',
  progress,
  onSaveRecord,
  onOpenWorksheet,
  setActivePage,
}) => {
  const firstSample = getExperimentSample(initialExperimentId, initialSampleId)
    ?? EXPERIMENT_SAMPLES[initialExperimentId][0];
  const initialRecord = recordFor(progress, initialExperimentId, firstSample.id);
  const [experimentId, setExperimentId] = useState<ExperimentId>(initialExperimentId);
  const [selectedSampleId, setSelectedSampleId] = useState(firstSample.id);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [hasTested, setHasTested] = useState(false);
  const [prediction, setPrediction] = useState<SolutionCategory | ''>(initialRecord?.prediction ?? '');
  const [predictionLocked, setPredictionLocked] = useState(Boolean(initialRecord?.predictionLocked));
  const [lampObservation, setLampObservation] = useState<LabSample['expectedLamp'] | ''>(
    initialRecord?.lampObservation ?? '',
  );
  const [bubbleObservation, setBubbleObservation] = useState<LabSample['expectedBubbles'] | ''>(
    initialRecord?.bubbleObservation ?? '',
  );
  const [classification, setClassification] = useState<SolutionCategory | ''>(
    initialRecord?.conclusion ?? '',
  );
  const [score, setScore] = useState(initialRecord?.score ?? null);
  const [checked, setChecked] = useState(Boolean(initialRecord?.completed));
  const [validationMessage, setValidationMessage] = useState('');

  const samples = EXPERIMENT_SAMPLES[experimentId];
  const sample = getExperimentSample(experimentId, selectedSampleId) ?? samples[0];
  const experiment2 = experimentId === 'percobaan_2';
  const bubbleCount = !isSwitchOn
    ? 0
    : sample.expectedBubbles === 'visible'
      ? 14
      : sample.expectedBubbles === 'possible'
        ? 4
        : 0;
  const lampColor = !isSwitchOn
    ? '#64748b'
    : sample.expectedLamp === 'bright'
      ? '#fde047'
      : sample.expectedLamp === 'dim'
        ? '#fef08a'
        : '#cbd5e1';

  const loadSample = (nextExperiment: ExperimentId, sampleId: string) => {
    const savedRecord = recordFor(progress, nextExperiment, sampleId);
    setExperimentId(nextExperiment);
    setSelectedSampleId(sampleId);
    setIsSwitchOn(false);
    setHasTested(false);
    setPrediction(savedRecord?.prediction ?? '');
    setPredictionLocked(Boolean(savedRecord?.predictionLocked));
    setLampObservation(savedRecord?.lampObservation ?? '');
    setBubbleObservation(savedRecord?.bubbleObservation ?? '');
    setClassification(savedRecord?.conclusion ?? '');
    setScore(savedRecord?.score ?? null);
    setChecked(Boolean(savedRecord?.completed));
    setValidationMessage('');
  };

  const handleLockPrediction = () => {
    if (!experiment2 || !prediction || predictionLocked) return;

    setPredictionLocked(true);
    setValidationMessage('');
    onSaveRecord({
      solutionId: sample.id,
      experimentId,
      sampleType: 'prepared',
      sampleName: sample.name,
      sampleFormula: sample.formula,
      sampleCondition: sample.condition,
      studentName: progress.student?.name ?? '',
      studentClass: progress.student?.className ?? '',
      prediction,
      predictionLocked: true,
      lampObservation: '',
      bubbleObservation: '',
      conclusion: '',
      referenceCategory: sample.category,
      referenceLamp: sample.expectedLamp,
      referenceBubbles: sample.expectedBubbles,
      referenceEquation: sample.equation,
      referenceExplanation: sample.explanation,
      safetyNote: sample.safetyNote,
      completed: false,
    });
  };

  const handleCheckAnswer = () => {
    if (!hasTested || (experiment2 && !predictionLocked)) {
      setValidationMessage(experiment2
        ? 'Kunci prediksi dan jalankan simulasi sebelum memeriksa jawaban.'
        : 'Jalankan simulasi sebelum memeriksa jawaban.');
      return;
    }
    if (!lampObservation || !bubbleObservation || (!experiment2 && !classification)) {
      setValidationMessage('Lengkapi pilihan pengamatan dan kesimpulan yang diminta.');
      return;
    }

    const nextScore = experiment2
      ? scoreExperiment2(sample, { prediction, lamp: lampObservation, bubbles: bubbleObservation })
      : scoreExperiment1(sample, {
        lamp: lampObservation,
        bubbles: bubbleObservation,
        classification,
      });

    const record: ExperimentRecord = {
      solutionId: sample.id,
      experimentId,
      sampleType: 'prepared',
      sampleName: sample.name,
      sampleFormula: sample.formula,
      sampleCondition: sample.condition,
      studentName: progress.student?.name ?? '',
      studentClass: progress.student?.className ?? '',
      prediction: experiment2 ? prediction : '',
      predictionLocked: experiment2 ? predictionLocked : false,
      lampObservation,
      bubbleObservation,
      conclusion: experiment2 ? '' : classification,
      referenceCategory: sample.category,
      referenceLamp: sample.expectedLamp,
      referenceBubbles: sample.expectedBubbles,
      referenceEquation: sample.equation,
      referenceExplanation: sample.explanation,
      safetyNote: sample.safetyNote,
      score: nextScore,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    onSaveRecord(record);
    setScore(nextScore);
    setChecked(true);
    setValidationMessage('');
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.72rem 0.8rem',
    borderRadius: '9px',
    border: '1px solid var(--slate-300)',
    background: '#ffffff',
    color: 'var(--navy-900)',
    font: 'inherit',
  };

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--teal-800)', fontWeight: 700, fontSize: '0.82rem' }}>
              <FlaskConical size={16} />
              Laboratorium Virtual
            </div>
            <h1 style={{ color: 'var(--navy-950)', fontSize: 'clamp(1.7rem, 3vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, marginTop: '0.4rem' }}>
              Uji Daya Hantar Listrik Larutan
            </h1>
          </div>
          <button onClick={onOpenWorksheet} className="btn btn-secondary">
            <ClipboardList size={17} />
            Lembar Kerja
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }} aria-label="Pilih percobaan">
          {([
            ['percobaan_1', 'Percobaan 1 · Sampel baku'],
            ['percobaan_2', 'Percobaan 2 · Larutan sehari-hari'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => loadSample(id, EXPERIMENT_SAMPLES[id][0].id)}
              className="btn"
              aria-pressed={experimentId === id}
              style={{
                background: experimentId === id ? 'var(--teal-700)' : '#ffffff',
                color: experimentId === id ? '#ffffff' : 'var(--navy-900)',
                border: `1px solid ${experimentId === id ? 'var(--teal-700)' : 'var(--slate-300)'}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <section
          aria-labelledby="experiment-procedure-title"
          style={{
            marginBottom: '1.25rem',
            padding: '1rem 1.2rem',
            border: '1px solid var(--teal-200)',
            borderLeft: '4px solid var(--teal-600)',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ffffff, var(--teal-50))',
          }}
        >
          <h2 id="experiment-procedure-title" style={{ color: 'var(--navy-900)', fontSize: '0.98rem', fontWeight: 800 }}>
            {experimentProcedures[experimentId].title}
          </h2>
          <ol style={{
            display: 'grid',
            gap: '0.45rem',
            margin: '0.7rem 0 0',
            paddingLeft: '1.35rem',
            color: 'var(--slate-700)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
          }}>
            {experimentProcedures[experimentId].steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>

        <div className="lab-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 0.8fr) minmax(390px, 1.45fr) minmax(260px, 0.9fr)', gap: '1rem', alignItems: 'start' }}>
          <section className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '0.8rem' }}>1. Pilih sampel</h2>
            <label htmlFor="sample-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              {experiment2 ? 'Larutan sehari-hari' : 'Sampel larutan baku'}
            </label>
            <select
              id="sample-select"
              value={selectedSampleId}
              onChange={(event) => loadSample(experimentId, event.target.value)}
              style={selectStyle}
            >
              {samples.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.name} — {entry.formula}</option>
              ))}
            </select>

            <div style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '10px', background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Sampel</div>
              <div style={{ color: 'var(--navy-900)', fontWeight: 800, marginTop: '0.2rem' }}>{sample.name}</div>
              <div style={{ color: 'var(--text-main)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.1rem' }}>{sample.formula}</div>
              <div style={{ color: 'var(--slate-600)', fontSize: '0.8rem', lineHeight: 1.5, marginTop: '0.55rem' }}>{sample.condition}</div>
            </div>

            {experiment2 ? (
              <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1rem', paddingTop: '1rem' }}>
                <label htmlFor="prediction-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                  2. Prediksi sebelum menguji
                </label>
                <select
                  id="prediction-select"
                  value={prediction}
                  onChange={(event) => setPrediction(event.target.value as SolutionCategory | '')}
                  disabled={predictionLocked}
                  style={selectStyle}
                >
                  <option value="">Pilih prediksi</option>
                  {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLockPrediction}
                  disabled={!prediction || predictionLocked}
                  style={{ width: '100%', marginTop: '0.6rem', opacity: !prediction || predictionLocked ? 0.6 : 1 }}
                >
                  {predictionLocked ? <><CheckCircle2 size={16} /> Prediksi terkunci</> : 'Kunci Prediksi'}
                </button>
                {predictionLocked && (
                  <p role="status" style={{ color: 'var(--teal-800)', fontSize: '0.78rem', marginTop: '0.45rem' }}>
                    Prediksi awal tersimpan dan tidak dapat diubah.
                  </p>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'var(--teal-50)', borderRadius: '9px', color: 'var(--teal-900)', fontSize: '0.8rem' }}>
                Setelah simulasi, pilih hasil pengamatan dan kesimpulan jenis larutan.
              </div>
            )}
          </section>

          <section className="card" style={{ padding: '1rem', background: '#0a142f', color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', padding: '0.35rem 0.4rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <div>
                <div style={{ color: '#99f6e4', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Simulasi visual · 6 V DC</div>
                <div style={{ fontWeight: 800, marginTop: '0.15rem' }}>{sample.name}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (!isSwitchOn && experiment2 && !predictionLocked) return;
                    setIsSwitchOn((current) => !current);
                    if (!isSwitchOn) setHasTested(true);
                  }}
                  disabled={!isSwitchOn && experiment2 && !predictionLocked}
                  aria-pressed={isSwitchOn}
                  style={{ background: isSwitchOn ? '#059669' : '#dc2626', color: '#fff', padding: '0.55rem 0.8rem', opacity: !isSwitchOn && experiment2 && !predictionLocked ? 0.55 : 1 }}
                >
                  <Power size={16} />
                  Saklar {isSwitchOn ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setIsSwitchOn(false); setHasTested(false); }}
                  aria-label="Reset simulasi"
                  title="Reset simulasi"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '0.55rem' }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div style={{ width: '100%', height: 'clamp(390px, 48vw, 520px)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <svg viewBox="0 0 520 520" role="img" aria-label={`Simulasi alat uji larutan ${sample.name}`} style={{ width: '100%', height: '100%', maxWidth: '650px' }}>
                <defs>
                  <linearGradient id="beaker-liquid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sample.accentColor} stopOpacity="0.48" />
                    <stop offset="100%" stopColor={sample.accentColor} stopOpacity="0.82" />
                  </linearGradient>
                  <radialGradient id="bulb-glow">
                    <stop offset="0%" stopColor={lampColor} stopOpacity={sample.expectedLamp === 'bright' ? 0.75 : 0.35} />
                    <stop offset="100%" stopColor={lampColor} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path d="M75 82 H212 M308 82 H435 V190 H365" fill="none" stroke={isSwitchOn ? '#38bdf8' : '#475569'} strokeWidth="7" strokeLinecap="round" className={isSwitchOn ? 'wire-animated' : ''} />
                <path d="M75 82 V190 H155 M365 190 V258 M155 190 V258" fill="none" stroke={isSwitchOn ? '#38bdf8' : '#475569'} strokeWidth="7" strokeLinecap="round" className={isSwitchOn ? 'wire-animated' : ''} />
                <g transform="translate(48 48)">
                  <rect x="0" y="0" width="56" height="66" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                  <text x="28" y="39" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">6 V</text>
                  <text x="2" y="17" fill="#f87171" fontSize="16" fontWeight="bold">−</text>
                  <text x="45" y="17" fill="#38bdf8" fontSize="16" fontWeight="bold">+</text>
                </g>
                <g transform="translate(260 72)">
                  {isSwitchOn && sample.expectedLamp !== 'off' && <circle cx="0" cy="6" r={sample.expectedLamp === 'bright' ? 86 : 56} fill="url(#bulb-glow)" className="anim-bulb-glow" />}
                  <path d="M-26 8 C-26-12-12-27 0-27 C12-27 26-12 26 8 C26 22 17 30 12 35 V48 H-12 V35 C-17 30-26 22-26 8 Z" fill={isSwitchOn ? lampColor : '#94a3b8'} stroke={isSwitchOn && sample.expectedLamp !== 'off' ? '#f59e0b' : '#64748b'} strokeWidth="4" />
                  <path d="M-9 12 L-5 0 H5 L9 12" fill="none" stroke="#fff" strokeWidth="3" />
                  <rect x="-13" y="48" width="26" height="10" rx="3" fill="#64748b" />
                </g>
                <text x="260" y="153" fill="#cbd5e1" fontSize="16" textAnchor="middle">
                  {isSwitchOn ? `Lampu ${lampLabel(sample.expectedLamp).toLowerCase()}` : 'Lampu menunggu saklar'}
                </text>
                <path d="M130 218 L130 444 Q130 466 152 466 H368 Q390 466 390 444 L390 218" fill="rgba(255,255,255,0.08)" stroke="#cbd5e1" strokeWidth="5" />
                <path d="M125 218 H395" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                <path d="M136 292 Q260 284 384 292 V443 Q384 460 367 460 H153 Q136 460 136 443 Z" fill="url(#beaker-liquid)" />
                <path d="M136 292 Q198 299 260 292 Q322 285 384 292" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="3" />
                <rect x="183" y="238" width="22" height="162" rx="5" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <rect x="315" y="238" width="22" height="162" rx="5" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <text x="194" y="207" fill="#e2e8f0" fontSize="14" textAnchor="middle">Katoda (−)</text>
                <text x="326" y="207" fill="#e2e8f0" fontSize="14" textAnchor="middle">Anoda (+)</text>
                {bubblePositions.slice(0, bubbleCount).map((position, index) => (
                  <circle
                    key={index}
                    cx={position.x}
                    cy={position.y}
                    r={sample.expectedBubbles === 'visible' ? 6 + (index % 3) : 5}
                    fill="rgba(255,255,255,0.94)"
                    stroke="rgba(14,116,144,0.7)"
                    strokeWidth="1.5"
                    className="anim-bubble"
                    style={{ animationDelay: `${index * 0.16}s`, animationDuration: `${1.6 + (index % 4) * 0.2}s` }}
                  />
                ))}
                <rect x="164" y="474" width="192" height="28" rx="6" fill="rgba(15,23,42,0.9)" stroke="rgba(255,255,255,0.22)" />
                <text x="260" y="493" fill="#99f6e4" fontSize="14" fontWeight="bold" textAnchor="middle">
                  {sample.formula}
                </text>
              </svg>
            </div>
            <div style={{ padding: '0.7rem 0.8rem', borderRadius: '9px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.78rem', lineHeight: 1.5 }}>
              Parameter model: 6 V DC · 10 detik · 100 mL · 25 °C · elektroda inert berjarak 2 cm. Nilai ini hanya asumsi simulasi digital.
            </div>
          </section>

          <section className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '0.8rem' }}>
              {experiment2 ? '3. Catat pengamatan' : '2. Catat hasil uji'}
            </h2>
            {!hasTested && (
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                {experiment2 && !predictionLocked
                  ? 'Kunci prediksi terlebih dahulu, lalu nyalakan saklar untuk mengamati simulasi.'
                  : 'Nyalakan saklar, amati lampu dan gelembung, lalu pilih hasil pengamatan Anda.'}
              </p>
            )}
            <label htmlFor="lamp-observation" style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>Nyala lampu</label>
            <select id="lamp-observation" value={lampObservation} onChange={(event) => { setLampObservation(event.target.value as LabSample['expectedLamp'] | ''); setChecked(false); }} disabled={!hasTested} style={{ ...selectStyle, marginBottom: '0.8rem' }}>
              <option value="">Pilih pengamatan lampu</option>
              {lampOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <label htmlFor="bubble-observation" style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>Gelembung</label>
            <select id="bubble-observation" value={bubbleObservation} onChange={(event) => { setBubbleObservation(event.target.value as LabSample['expectedBubbles'] | ''); setChecked(false); }} disabled={!hasTested} style={{ ...selectStyle, marginBottom: '0.8rem' }}>
              <option value="">Pilih pengamatan gelembung</option>
              {bubbleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {!experiment2 && (
              <>
                <label htmlFor="classification-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>Kesimpulan jenis larutan</label>
                <select id="classification-select" value={classification} onChange={(event) => { setClassification(event.target.value as SolutionCategory | ''); setChecked(false); }} disabled={!hasTested} style={{ ...selectStyle, marginBottom: '0.8rem' }}>
                  <option value="">Pilih kesimpulan</option>
                  {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCheckAnswer}
              disabled={!hasTested || (experiment2 && !predictionLocked)}
              style={{ width: '100%', opacity: !hasTested || (experiment2 && !predictionLocked) ? 0.6 : 1 }}
            >
              Periksa Jawaban
            </button>
            {validationMessage && <p role="alert" style={{ color: '#b45309', fontSize: '0.78rem', marginTop: '0.6rem' }}>{validationMessage}</p>}

            {checked && score && (
              <div style={{ marginTop: '1rem', padding: '0.9rem', borderRadius: '10px', background: 'var(--teal-50)', border: '1px solid var(--teal-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center', color: 'var(--teal-900)', fontWeight: 800 }}>
                  <span>Skor percobaan</span>
                  <span>{score.total}/{score.maximum}</span>
                </div>
                {experiment2 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginTop: '0.55rem' }}>
                    Prediksi awal: {prediction ? categoryLabel(prediction) : 'Belum ada'} — {score.prediction ? 'Benar' : 'Belum tepat'}
                  </p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginTop: '0.4rem' }}>
                  Kategori acuan: <strong>{sample.categoryLabel}</strong>
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-700)', lineHeight: 1.5, marginTop: '0.4rem' }}>
                  <strong>Persamaan:</strong> {sample.equation}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-700)', lineHeight: 1.5, marginTop: '0.35rem' }}>
                  {sample.explanation}
                </p>
                {sample.safetyNote && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--slate-600)', lineHeight: 1.45, marginTop: '0.4rem' }}>
                    Catatan: {sample.safetyNote}
                  </p>
                )}
                <p role="status" style={{ fontSize: '0.73rem', color: 'var(--teal-800)', fontWeight: 700, marginTop: '0.55rem' }}>
                  <CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  Jawaban tersimpan otomatis di Lembar Kerja.
                </p>
              </div>
            )}
          </section>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid var(--slate-200)', background: '#fff', color: 'var(--slate-700)', fontSize: '0.82rem', lineHeight: 1.6 }}>
          <strong>Catatan model:</strong> kuat/lemah elektrolit tidak sama dengan pekat/encer. Lampu dan gelembung adalah indikator kualitatif yang mengikuti dataset. Gelembung menggambarkan gas hasil elektrolisis pada elektroda, bukan akibat ionisasi saja.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem', padding: '1.2rem 1.5rem', borderRadius: '14px', background: '#fff', border: '1px solid var(--slate-200)' }}>
          <div>
            <h2 style={{ color: 'var(--navy-900)', fontSize: '1rem', fontWeight: 800 }}>Lihat semua hasil dan nilai</h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.82rem' }}>Jawaban tersimpan per sampel dan dapat dibuka kembali.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={onOpenWorksheet}><ClipboardList size={16} /> Buka Lembar Kerja</button>
            <button type="button" className="btn btn-primary" onClick={() => setActivePage('evaluasi')}>Ke Evaluasi <ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .lab-layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
