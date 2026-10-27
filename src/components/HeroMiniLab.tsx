import React, { useState } from 'react';
import { SOLUTIONS } from '../data/solutionsData';
import type { Solution } from '../types/chemistry';
import { Power, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroMiniLabProps {
  onOpenFullLab: (sampleId: string) => void;
}

export const HeroMiniLab: React.FC<HeroMiniLabProps> = ({ onOpenFullLab }) => {
  const [selectedId, setSelectedId] = useState<string>('S01'); // Default NaCl
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true); // Circuit on/off

  const currentSolution: Solution = SOLUTIONS.find((s) => s.id === selectedId) || SOLUTIONS[0];

  // Circuit status calculations
  const isCircuitActive = isSwitchClosed;
  const lampStatus = isCircuitActive ? currentSolution.expectedLamp : 'off';
  const hasBubbles = isCircuitActive && currentSolution.expectedBubbles !== 'not_expected';

  // Glow intensities
  const getGlowFilter = () => {
    if (lampStatus === 'bright') {
      return 'drop-shadow(0 0 28px rgba(250, 204, 21, 0.95)) drop-shadow(0 0 50px rgba(250, 204, 21, 0.6))';
    }
    if (lampStatus === 'dim') {
      return 'drop-shadow(0 0 14px rgba(250, 204, 21, 0.6))';
    }
    return 'none';
  };

  const getBulbFill = () => {
    if (lampStatus === 'bright') return '#fde047';
    if (lampStatus === 'dim') return '#fef08a';
    return '#cbd5e1';
  };

  return (
    <div style={{
      backgroundColor: 'var(--navy-900)',
      color: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      padding: '1.75rem',
      boxShadow: '0 20px 40px -10px rgba(10, 20, 47, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isCircuitActive ? '#10b981' : '#94a3b8',
            boxShadow: isCircuitActive ? '0 0 8px #10b981' : 'none',
            transition: 'all 0.3s'
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#99f6e4' }}>
            Simulasi Interaktif Cepat
          </span>
        </div>

        {/* Switch Toggle Button */}
        <button
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: isSwitchClosed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${isSwitchClosed ? '#10b981' : '#ef4444'}`,
            color: isSwitchClosed ? '#6ee7b7' : '#fca5a5',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={isSwitchClosed ? 'Klik untuk memutus saklar' : 'Klik untuk menyambung saklar'}
        >
          <Power size={14} />
          <span>Saklar: {isSwitchClosed ? 'ON (Tertutup)' : 'OFF (Terbuka)'}</span>
        </button>
      </div>

      {/* Main Interactive Apparatus SVG Canvas */}
      <div style={{
        position: 'relative',
        height: '240px',
        backgroundColor: 'rgba(6, 13, 31, 0.7)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        overflow: 'hidden'
      }}>
        <svg
          viewBox="0 0 440 220"
          style={{ width: '100%', height: '100%', maxHeight: '240px' }}
        >
          <defs>
            {/* Liquid Gradient */}
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentSolution.accentColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={currentSolution.accentColor} stopOpacity="0.8" />
            </linearGradient>

            {/* Glass Beaker Gradient */}
            <linearGradient id="beakerGlass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="10%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="90%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
            </linearGradient>

            {/* Glowing Bulb Glow Filter */}
            <filter id="lampGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Circuit Wires */}
          {/* Wire 1: Battery (+) to Lamp */}
          <path
            d="M 120 40 L 220 40"
            stroke={isCircuitActive && lampStatus !== 'off' ? '#38bdf8' : '#64748b'}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className={isCircuitActive && lampStatus !== 'off' ? 'wire-animated' : ''}
          />
          {/* Wire 2: Lamp to Electrode Anode (+) */}
          <path
            d="M 220 55 L 220 70 L 180 70 L 180 120"
            stroke={isCircuitActive && lampStatus !== 'off' ? '#38bdf8' : '#64748b'}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className={isCircuitActive && lampStatus !== 'off' ? 'wire-animated' : ''}
          />
          {/* Wire 3: Battery (-) through Switch to Electrode Cathode (-) */}
          <path
            d="M 80 40 L 50 40 L 50 70 L 120 70 L 120 120"
            stroke={isCircuitActive && lampStatus !== 'off' ? '#38bdf8' : '#64748b'}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className={isCircuitActive && lampStatus !== 'off' ? 'wire-animated' : ''}
          />

          {/* 2. DC Battery (9V) */}
          <g transform="translate(75, 25)">
            <rect x="0" y="0" width="45" height="30" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <rect x="3" y="6" width="39" height="18" rx="2" fill="#0f172a" />
            {/* Battery terminals */}
            <rect x="-4" y="9" width="4" height="12" fill="#ef4444" rx="1" />
            <rect x="45" y="9" width="4" height="12" fill="#38bdf8" rx="1" />
            <text x="22" y="19" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">9V DC</text>
            <text x="-1" y="6" fill="#f87171" fontSize="9" fontWeight="bold">-</text>
            <text x="41" y="6" fill="#38bdf8" fontSize="9" fontWeight="bold">+</text>
          </g>

          {/* 3. Light Bulb Assembly */}
          <g transform="translate(220, 20)">
            {/* Halo behind bulb if glowing */}
            {lampStatus !== 'off' && (
              <circle
                cx="0"
                cy="15"
                r={lampStatus === 'bright' ? '36' : '22'}
                fill="url(#liquidGrad)"
                opacity={lampStatus === 'bright' ? '0.6' : '0.35'}
                filter="url(#lampGlowFilter)"
                className="anim-bulb-glow"
              />
            )}
            {/* Bulb Glass */}
            <path
              d="M -12 14 C -12 6 -6 0 0 0 C 6 0 12 6 12 14 C 12 18 9 22 7 24 L 7 28 L -7 28 L -7 24 C -9 22 -12 18 -12 14 Z"
              fill={getBulbFill()}
              stroke={lampStatus !== 'off' ? '#f59e0b' : '#64748b'}
              strokeWidth="1.5"
              style={{ filter: getGlowFilter() }}
            />
            {/* Filament */}
            <path
              d="M -4 20 L -2 12 L 2 12 L 4 20"
              fill="none"
              stroke={lampStatus !== 'off' ? '#ffffff' : '#475569'}
              strokeWidth="1.5"
            />
            {/* Bulb Base */}
            <rect x="-6" y="28" width="12" height="6" fill="#94a3b8" rx="1" />
          </g>

          {/* 4. Glass Beaker with Liquid */}
          <g transform="translate(150, 95)">
            {/* Beaker Outline */}
            <path
              d="M -50 0 L -50 100 Q -50 110 -40 110 L 40 110 Q 50 110 50 100 L 50 0"
              fill="url(#beakerGlass)"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* Beaker Lip */}
            <path d="M -54 0 L 54 0" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

            {/* Liquid inside beaker */}
            <path
              d="M -48 35 Q 0 32 48 35 L 48 100 Q 48 108 40 108 L -40 108 Q -48 108 -48 100 Z"
              fill="url(#liquidGrad)"
            />

            {/* Meniscus wave */}
            <path
              d="M -48 35 Q -24 38 0 35 Q 24 32 48 35"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />

            {/* 5. Carbon Electrodes */}
            {/* Cathode (-) left */}
            <rect x="-35" y="10" width="10" height="85" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <text x="-30" y="8" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">-</text>

            {/* Anode (+) right */}
            <rect x="25" y="10" width="10" height="85" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <text x="30" y="8" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">+</text>

            {/* 6. Electrode Bubbles (Animated if active) */}
            {hasBubbles && (
              <g>
                <circle cx="-38" cy="65" r="2.5" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '0s' }} />
                <circle cx="-32" cy="78" r="3.5" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '0.4s' }} />
                <circle cx="-37" cy="90" r="2" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '0.8s' }} />
                <circle cx="28" cy="68" r="3" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '0.2s' }} />
                <circle cx="34" cy="82" r="2" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '0.6s' }} />
                <circle cx="29" cy="94" r="3.5" fill="rgba(255,255,255,0.7)" className="anim-bubble" style={{ animationDelay: '1s' }} />
              </g>
            )}

            {/* 7. Floating Ions / Molecules in Solution */}
            {currentSolution.category === 'strong_electrolyte' && (
              <g>
                {/* Abundant positive & negative ions */}
                <g className="anim-particle" style={{ animationDuration: '3.5s' }}>
                  <circle cx="-15" cy="55" r="7" fill="#0d9488" />
                  <text x="-15" y="58" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '4.2s', animationDelay: '0.5s' }}>
                  <circle cx="10" cy="62" r="8" fill="#8b5cf6" />
                  <text x="10" y="65" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}>
                  <circle cx="-5" cy="85" r="7" fill="#0d9488" />
                  <text x="-5" y="88" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '4.6s', animationDelay: '0.8s' }}>
                  <circle cx="15" cy="90" r="8" fill="#8b5cf6" />
                  <text x="15" y="93" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                </g>
              </g>
            )}

            {currentSolution.category === 'weak_electrolyte' && (
              <g>
                {/* Few ions, mostly neutral molecules */}
                <g className="anim-particle" style={{ animationDuration: '4s' }}>
                  <circle cx="-12" cy="60" r="6" fill="#0d9488" />
                  <text x="-12" y="63" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">{currentSolution.ions.positive}</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '4.5s', animationDelay: '0.6s' }}>
                  <circle cx="12" cy="85" r="7" fill="#8b5cf6" />
                  <text x="12" y="88" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">{currentSolution.ions.negative}</text>
                </g>
                {/* Neutral molecules */}
                <g className="anim-particle" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                  <rect x="-18" y="75" width="22" height="12" rx="4" fill="#f59e0b" opacity="0.85" />
                  <text x="-7" y="84" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">Mol</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '4.8s', animationDelay: '1.8s' }}>
                  <rect x="0" y="50" width="22" height="12" rx="4" fill="#f59e0b" opacity="0.85" />
                  <text x="11" y="59" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">Mol</text>
                </g>
              </g>
            )}

            {currentSolution.category === 'nonelectrolyte' && (
              <g>
                {/* Only neutral molecules, no ions! */}
                <g className="anim-particle" style={{ animationDuration: '4.2s' }}>
                  <rect x="-20" y="55" width="26" height="14" rx="4" fill="#64748b" opacity="0.9" />
                  <text x="-7" y="65" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Netral</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '4.8s', animationDelay: '0.8s' }}>
                  <rect x="2" y="70" width="26" height="14" rx="4" fill="#64748b" opacity="0.9" />
                  <text x="15" y="80" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Netral</text>
                </g>
                <g className="anim-particle" style={{ animationDuration: '3.9s', animationDelay: '1.5s' }}>
                  <rect x="-15" y="88" width="26" height="14" rx="4" fill="#64748b" opacity="0.9" />
                  <text x="-2" y="98" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Netral</text>
                </g>
              </g>
            )}

            {/* Label inside Beaker */}
            <rect x="-40" y="115" width="80" height="18" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="0" y="128" fill="#5eead4" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {currentSolution.formula}
            </text>
          </g>

          {/* Right Legend Info */}
          <g transform="translate(325, 45)">
            <rect x="0" y="0" width="105" height="150" rx="8" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <text x="12" y="22" fill="#99f6e4" fontSize="10" fontWeight="bold">HASIL UJI:</text>

            {/* Lamp result */}
            <text x="12" y="45" fill="#94a3b8" fontSize="8">Nyala Lampu:</text>
            <text
              x="12"
              y="60"
              fill={lampStatus === 'bright' ? '#fde047' : lampStatus === 'dim' ? '#fbbf24' : '#ef4444'}
              fontSize="10"
              fontWeight="bold"
            >
              {lampStatus === 'bright' ? '💡 Terang Benderang' : lampStatus === 'dim' ? '🔅 Redup' : '❌ Mati / Padam'}
            </text>

            {/* Bubble result */}
            <text x="12" y="85" fill="#94a3b8" fontSize="8">Gelembung Gas:</text>
            <text
              x="12"
              y="100"
              fill={hasBubbles ? '#67e8f9' : '#94a3b8'}
              fontSize="9"
              fontWeight="bold"
            >
              {currentSolution.expectedBubbles === 'visible' && isCircuitActive
                ? '🫧 Banyak di Elektroda'
                : currentSolution.expectedBubbles === 'possible' && isCircuitActive
                ? '🫧 Sedikit / Halus'
                : 'Tidak Ada'}
            </text>

            {/* Category tag */}
            <text x="12" y="122" fill="#94a3b8" fontSize="8">Klasifikasi:</text>
            <text x="12" y="138" fill="#a7f3d0" fontSize="9.5" fontWeight="bold">
              {currentSolution.categoryLabel}
            </text>
          </g>
        </svg>
      </div>

      {/* Solution Selector Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.6rem', fontWeight: 600 }}>
          Pilih Sampel untuk Uji Coba Langsung:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {SOLUTIONS.map((sol) => {
            const isSelected = sol.id === selectedId;
            return (
              <button
                key={sol.id}
                onClick={() => setSelectedId(sol.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid #14b8a6' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#5eead4' : '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{sol.formula}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{sol.name}</div>
                </div>
                {isSelected && <CheckCircle2 size={14} color="#14b8a6" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanatory Banner & CTA */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            <strong style={{ color: '#5eead4' }}>Model Partikel: </strong>
            {currentSolution.particleModel}
          </div>
        </div>

        <button
          onClick={() => onOpenFullLab(selectedId)}
          className="btn btn-primary"
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)'
          }}
        >
          <span>Uji Lengkap di Lab</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
