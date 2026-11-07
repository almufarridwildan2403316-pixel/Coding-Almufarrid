import React, { useState, useEffect } from 'react';
import type { Solution, SolutionCategory, LampStatus, LearningProgress, ExperimentRecord } from '../types/chemistry';
import { SOLUTIONS } from '../data/solutionsData';
import { 
  FlaskConical, 
  Power, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Eye, 
  ClipboardList
} from 'lucide-react';

interface LabVirtualProps {
  initialSampleId?: string;
  progress: LearningProgress;
  onSaveRecord: (record: ExperimentRecord) => void;
  onOpenWorksheet: () => void;
}

export const LabVirtual: React.FC<LabVirtualProps> = ({
  initialSampleId = 'S01',
  progress,
  onSaveRecord,
  onOpenWorksheet,
}) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(initialSampleId);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(false);
  const [hasTested, setHasTested] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<SolutionCategory | ''>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync if initialSampleId changes
  useEffect(() => {
    setSelectedSolutionId(initialSampleId);
    setIsSwitchClosed(false);
    setHasTested(false);
    setSavedSuccess(false);
    
    // Check if there is an existing record
    const existing = progress.worksheetRecords[initialSampleId];
    if (existing) {
      setPrediction(existing.prediction);
    } else {
      setPrediction('');
    }
  }, [initialSampleId]);

  const currentSolution: Solution = SOLUTIONS.find((s) => s.id === selectedSolutionId) || SOLUTIONS[0];

  const handleSelectSolution = (id: string) => {
    setSelectedSolutionId(id);
    setIsSwitchClosed(false);
    setHasTested(false);
    setSavedSuccess(false);

    const existing = progress.worksheetRecords[id];
    if (existing) {
      setPrediction(existing.prediction);
    } else {
      setPrediction('');
    }
  };

  const handleToggleSwitch = () => {
    const newState = !isSwitchClosed;
    setIsSwitchClosed(newState);
    if (newState) {
      setHasTested(true);
    }
  };

  const handleReset = () => {
    setIsSwitchClosed(false);
    setHasTested(false);
    setSavedSuccess(false);
  };

  const handleSaveToWorksheet = () => {
    if (!hasTested) return;

    const record: ExperimentRecord = {
      solutionId: currentSolution.id,
      studentName: progress.student?.name ?? '',
      studentClass: progress.student?.className ?? '',
      prediction: prediction,
      lampObservation: currentSolution.expectedLamp,
      bubbleObservation: currentSolution.expectedBubbles,
      conclusion: currentSolution.category,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    onSaveRecord(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const lampStatus: LampStatus = isSwitchClosed ? currentSolution.expectedLamp : 'off';
  const hasBubbles: boolean = isSwitchClosed && currentSolution.expectedBubbles !== 'not_expected';

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Lab Header */}
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
              <FlaskConical size={15} color="var(--teal-600)" />
              <span>Laboratorium Virtual Uji Daya Hantar Listrik</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em' }}>
              Peralatan Uji Daya Hantar Larutan
            </h1>
          </div>

          <button
            onClick={onOpenWorksheet}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ClipboardList size={17} color="var(--teal-700)" />
            <span>Buka Lembar Kerja Siswa</span>
          </button>
        </div>

        {/* Main 3-Column / Grid Layout per PRD Section 7.1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 340px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="lab-layout-grid">
          
          {/* PANEL B: Panel Kontrol (Kiri) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={18} color="var(--teal-600)" />
              <span>1. Pilih Sampel Larutan</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
              {SOLUTIONS.map((sol) => {
                const isSelected = sol.id === selectedSolutionId;
                const isTested = progress.testedSolutions.includes(sol.id);
                return (
                  <button
                    key={sol.id}
                    onClick={() => handleSelectSolution(sol.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'var(--teal-50)' : '#ffffff',
                      border: isSelected ? '2px solid var(--teal-600)' : '1px solid var(--slate-200)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--teal-900)' : 'var(--navy-900)' }}>
                        {sol.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        {sol.formula}
                      </div>
                    </div>
                    {isTested && (
                      <span title="Sudah dicatat ke lembar kerja">
                        <CheckCircle2 size={16} color="var(--teal-600)" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prediksi Siswa */}
            <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                2. Buat Prediksi Anda:
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
                Sebelum saklar dinyalakan, menurut Anda apa kategori larutan ini?
              </p>
              <select
                value={prediction}
                onChange={(e) => setPrediction(e.target.value as SolutionCategory)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--slate-300)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--navy-900)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Pilih Prediksi --</option>
                <option value="strong_electrolyte">Elektrolit Kuat</option>
                <option value="weak_electrolyte">Elektrolit Lemah</option>
                <option value="nonelectrolyte">Non-Elektrolit</option>
              </select>
            </div>
          </div>

          {/* PANEL A: Panel Eksperimen Alat Uji (Tengah) */}
          <div className="card" style={{
            padding: '1.75rem',
            backgroundColor: '#0a142f',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#99f6e4', fontWeight: 700 }}>
                  Alat Uji Virtual:
                </span>
                <span style={{ marginLeft: '0.5rem', fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  {currentSolution.name} ({currentSolution.formula})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleToggleSwitch}
                  className="btn"
                  style={{
                    backgroundColor: isSwitchClosed ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.82rem',
                    boxShadow: isSwitchClosed ? '0 0 14px rgba(16, 185, 129, 0.5)' : 'none'
                  }}
                >
                  <Power size={14} />
                  <span>{isSwitchClosed ? 'Saklar ON' : 'Saklar OFF'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#cbd5e1',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.82rem'
                  }}
                  title="Reset simulasi alat"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* SVG Apparatus */}
            <div style={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 460 300" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="labLiquid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentSolution.accentColor} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={currentSolution.accentColor} stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="beakerGlassFull" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                    <stop offset="15%" stopColor="rgba(255,255,255,0.04)" />
                    <stop offset="85%" stopColor="rgba(255,255,255,0.04)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
                  </linearGradient>
                </defs>

                {/* Circuit Wires */}
                <path
                  d="M 120 50 L 230 50"
                  stroke={isSwitchClosed && lampStatus !== 'off' ? '#38bdf8' : '#475569'}
                  strokeWidth="4"
                  fill="none"
                  className={isSwitchClosed && lampStatus !== 'off' ? 'wire-animated' : ''}
                />
                <path
                  d="M 230 65 L 230 80 L 195 80 L 195 150"
                  stroke={isSwitchClosed && lampStatus !== 'off' ? '#38bdf8' : '#475569'}
                  strokeWidth="4"
                  fill="none"
                  className={isSwitchClosed && lampStatus !== 'off' ? 'wire-animated' : ''}
                />
                <path
                  d="M 80 50 L 50 50 L 50 80 L 125 80 L 125 150"
                  stroke={isSwitchClosed && lampStatus !== 'off' ? '#38bdf8' : '#475569'}
                  strokeWidth="4"
                  fill="none"
                  className={isSwitchClosed && lampStatus !== 'off' ? 'wire-animated' : ''}
                />

                {/* DC Battery 9V */}
                <g transform="translate(75, 30)">
                  <rect x="0" y="0" width="50" height="34" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="4" y="6" width="42" height="22" rx="2" fill="#0f172a" />
                  <rect x="-4" y="11" width="4" height="12" fill="#ef4444" rx="1" />
                  <rect x="50" y="11" width="4" height="12" fill="#38bdf8" rx="1" />
                  <text x="25" y="21" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">9V DC</text>
                  <text x="-2" y="8" fill="#f87171" fontSize="10" fontWeight="bold">-</text>
                  <text x="46" y="8" fill="#38bdf8" fontSize="10" fontWeight="bold">+</text>
                </g>

                {/* Light Bulb */}
                <g transform="translate(230, 25)">
                  {lampStatus !== 'off' && (
                    <circle
                      cx="0"
                      cy="20"
                      r={lampStatus === 'bright' ? '50' : '28'}
                      fill="#fde047"
                      opacity={lampStatus === 'bright' ? '0.6' : '0.35'}
                      className="anim-bulb-glow"
                    />
                  )}
                  {/* Bulb Glass */}
                  <path
                    d="M -16 18 C -16 8 -8 0 0 0 C 8 0 16 8 16 18 C 16 23 12 28 9 30 L 9 36 L -9 36 L -9 30 C -12 28 -16 23 -16 18 Z"
                    fill={lampStatus === 'bright' ? '#fde047' : lampStatus === 'dim' ? '#fef08a' : '#cbd5e1'}
                    stroke={lampStatus !== 'off' ? '#f59e0b' : '#64748b'}
                    strokeWidth="2"
                  />
                  {/* Filament */}
                  <path
                    d="M -5 24 L -3 15 L 3 15 L 5 24"
                    fill="none"
                    stroke={lampStatus !== 'off' ? '#ffffff' : '#475569'}
                    strokeWidth="2"
                  />
                  <rect x="-8" y="36" width="16" height="8" fill="#94a3b8" rx="2" />
                </g>

                {/* Beaker with solution */}
                <g transform="translate(160, 130)">
                  {/* Beaker Outline */}
                  <path
                    d="M -70 0 L -70 140 Q -70 155 -55 155 L 55 155 Q 70 155 70 140 L 70 0"
                    fill="url(#beakerGlassFull)"
                    stroke="#94a3b8"
                    strokeWidth="3"
                  />
                  <path d="M -75 0 L 75 0" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

                  {/* Liquid */}
                  <path
                    d="M -67 45 Q 0 40 67 45 L 67 140 Q 67 152 55 152 L -55 152 Q -67 152 -67 140 Z"
                    fill="url(#labLiquid)"
                  />
                  <path d="M -67 45 Q -33 48 0 45 Q 33 42 67 45" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

                  {/* Carbon Electrodes */}
                  {/* Cathode (-) left */}
                  <rect x="-45" y="10" width="16" height="125" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="-37" y="5" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">Katoda (-)</text>

                  {/* Anode (+) right */}
                  <rect x="29" y="10" width="16" height="125" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                  <text x="37" y="5" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">Anoda (+)</text>

                  {/* Electrode Bubbles */}
                  {hasBubbles && (
                    <g>
                      <circle cx="-48" cy="75" r="3" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '0s' }} />
                      <circle cx="-42" cy="95" r="4" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '0.5s' }} />
                      <circle cx="-47" cy="115" r="2.5" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '1s' }} />
                      <circle cx="34" cy="80" r="3.5" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '0.3s' }} />
                      <circle cx="42" cy="100" r="2.5" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '0.7s' }} />
                      <circle cx="36" cy="120" r="4" fill="rgba(255,255,255,0.8)" className="anim-bubble" style={{ animationDelay: '1.2s' }} />
                    </g>
                  )}

                  {/* Microscopic Particle overlay inside Beaker */}
                  {currentSolution.category === 'strong_electrolyte' && (
                    <g>
                      <g className="anim-particle" style={{ animationDuration: '3.5s' }}>
                        <circle cx="-20" cy="70" r="9" fill="#0d9488" />
                        <text x="-20" y="74" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.2s', animationDelay: '0.6s' }}>
                        <circle cx="10" cy="80" r="10" fill="#8b5cf6" />
                        <text x="10" y="84" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}>
                        <circle cx="-10" cy="115" r="9" fill="#0d9488" />
                        <text x="-10" y="119" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.5s', animationDelay: '1.8s' }}>
                        <circle cx="18" cy="125" r="10" fill="#8b5cf6" />
                        <text x="18" y="129" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                      </g>
                    </g>
                  )}

                  {currentSolution.category === 'weak_electrolyte' && (
                    <g>
                      <g className="anim-particle" style={{ animationDuration: '4s' }}>
                        <circle cx="-15" cy="75" r="8" fill="#0d9488" />
                        <text x="-15" y="78" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}>
                        <circle cx="15" cy="110" r="9" fill="#8b5cf6" />
                        <text x="15" y="114" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                        <rect x="-25" y="95" width="28" height="16" rx="4" fill="#f59e0b" opacity="0.85" />
                        <text x="-11" y="107" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Mol</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.7s', animationDelay: '2s' }}>
                        <rect x="0" y="65" width="28" height="16" rx="4" fill="#f59e0b" opacity="0.85" />
                        <text x="14" y="77" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Mol</text>
                      </g>
                    </g>
                  )}

                  {currentSolution.category === 'nonelectrolyte' && (
                    <g>
                      <g className="anim-particle" style={{ animationDuration: '4.2s' }}>
                        <rect x="-26" y="70" width="34" height="18" rx="4" fill="#64748b" opacity="0.9" />
                        <text x="-9" y="83" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Netral</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.8s', animationDelay: '1s' }}>
                        <rect x="2" y="95" width="34" height="18" rx="4" fill="#64748b" opacity="0.9" />
                        <text x="19" y="108" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Netral</text>
                      </g>
                      <g className="anim-particle" style={{ animationDuration: '4.4s', animationDelay: '1.8s' }}>
                        <rect x="-20" y="120" width="34" height="18" rx="4" fill="#64748b" opacity="0.9" />
                        <text x="-3" y="133" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Netral</text>
                      </g>
                    </g>
                  )}

                  {/* Formula Tag on Beaker */}
                  <rect x="-50" y="160" width="100" height="22" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x="0" y="175" fill="#5eead4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {currentSolution.formula}
                  </text>
                </g>
              </svg>
            </div>

            {/* Instruction Banner */}
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              {isSwitchClosed 
                ? '⚡ Arus listrik mengalir. Amati kondisi lampu dan gelembung di elektroda!' 
                : '👆 Klik tombol "Saklar ON" untuk mengalirkan arus listrik dari baterai.'}
            </div>
          </div>

          {/* PANEL C: Panel Hasil & Catat Pengamatan (Kanan) */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="var(--teal-600)" />
              <span>3. Hasil Pengamatan</span>
            </h3>

            {/* Observation 1: Lamp */}
            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Kondisi Nyala Lampu
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isSwitchClosed ? (lampStatus === 'bright' ? '#ca8a04' : lampStatus === 'dim' ? '#d97706' : '#ef4444') : 'var(--slate-400)', marginTop: '0.2rem' }}>
                {!isSwitchClosed 
                  ? 'Menunggu saklar dinyalakan...' 
                  : lampStatus === 'bright' 
                  ? '💡 Menyala Terang' 
                  : lampStatus === 'dim' 
                  ? '🔅 Menyala Redup' 
                  : '❌ Padam / Tidak Menyala'}
              </div>
            </div>

            {/* Observation 2: Bubbles */}
            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Gelembung Gas Elektroda
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isSwitchClosed ? (hasBubbles ? 'var(--teal-700)' : 'var(--slate-600)') : 'var(--slate-400)', marginTop: '0.2rem' }}>
                {!isSwitchClosed 
                  ? 'Menunggu saklar dinyalakan...' 
                  : currentSolution.expectedBubbles === 'visible' 
                  ? '🫧 Banyak Gelembung Gas' 
                  : currentSolution.expectedBubbles === 'possible' 
                  ? '🫧 Sedikit / Halus' 
                  : '❌ Tidak Ada Gelembung'}
              </div>
            </div>

            {/* Observation 3: Particle model explanation */}
            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--teal-50)', border: '1px solid var(--teal-200)', marginBottom: '1.25rem', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-800)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Model Partikel Mikroskopis:
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                {currentSolution.particleModel}
              </p>
            </div>

            {/* Save to worksheet action */}
            <div>
              <button
                onClick={handleSaveToWorksheet}
                disabled={!hasTested}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  opacity: hasTested ? 1 : 0.6,
                  cursor: hasTested ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} />
                <span>Simpan ke Lembar Kerja</span>
              </button>

              {savedSuccess && (
                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  border: '1px solid #a7f3d0'
                }}>
                  ✓ Berhasil dicatat ke Lembar Kerja!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .lab-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
