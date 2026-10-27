import React, { useState } from 'react';
import type { QuizQuestion, QuizResult } from '../types/chemistry';
import { Award, RotateCcw, ArrowRight } from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Konsep',
    question: 'Penyebab utama larutan elektrolit dapat menghantarkan arus listrik adalah...',
    options: [
      'Adanya molekul zat terlarut yang bergerak dengan kecepatan tinggi',
      'Keberadaan ion-ion bermuatan listrik yang dapat bergerak bebas dalam larutan',
      'Terjadinya peningkatan suhu air saat zat dilarutkan',
      'Adanya elektron bebas yang melompat di antara molekul air',
    ],
    correctIndex: 1,
    explanation: 'Daya hantar listrik dalam larutan cair dibawa oleh ion-ion positif (kation) dan ion negatif (anion) yang bebas bergerak, bukan oleh elektron bebas atau molekul netral.',
  },
  {
    id: 2,
    category: 'Klasifikasi',
    question: 'Di antara larutan berikut yang tergolong ke dalam elektrolit kuat adalah...',
    options: [
      'Larutan gula (sukrosa)',
      'Larutan asam asetat (cuka dapur)',
      'Larutan natrium klorida (NaCl) dan asam klorida (HCl)',
      'Larutan amonia (NH₃) encer',
    ],
    correctIndex: 2,
    explanation: 'NaCl dan HCl terurai/terionisasi sempurna (derajat ionisasi α = 1) di dalam air, sehingga menghasilkan konsentrasi ion yang tinggi dan digolongkan sebagai elektrolit kuat.',
  },
  {
    id: 3,
    category: 'Interpretasi Data',
    question: 'Pada suatu uji daya hantar listrik, larutan X menghasilkan lampu menyala redup dan sedikit gelembung gas di sekitar elektroda. Kesimpulan yang tepat mengenai larutan X adalah...',
    options: [
      'Larutan X adalah non-elektrolit',
      'Larutan X adalah elektrolit kuat dengan derajat ionisasi α = 1',
      'Larutan X adalah elektrolit lemah karena hanya terionisasi sebagian (0 < α < 1)',
      'Larutan X merupakan senyawa kovalen nonpolar',
    ],
    correctIndex: 2,
    explanation: 'Nyala lampu redup dan timbulnya sedikit gelembung gas merupakan ciri khas larutan elektrolit lemah yang hanya menghasilkan sedikit ion bebas dalam air.',
  },
  {
    id: 4,
    category: 'Konsep',
    question: 'Mengapa kristal padat NaCl (garam dapur) tidak dapat menghantarkan arus listrik, tetapi larutan NaCl dalam air dapat menghantarkannya?',
    options: [
      'Dalam kristal padat tidak terdapat ion',
      'Dalam kristal padat, ion-ion terikat kuat dalam kisi kristal sehingga tidak dapat bergerak bebas',
      'Air memberikan muatan listrik tambahan pada garam',
      'Kristal padat menyerap arus listrik menjadi energi panas',
    ],
    correctIndex: 1,
    explanation: 'Kristal padat NaCl tersusun atas ion Na⁺ dan Cl⁻, namun terikat sangat kaku dalam kisi kristal. Ketika dilarutkan dalam air, molekul air memisahkan ion-ion tersebut sehingga ion bebas bergerak.',
  },
  {
    id: 5,
    category: 'Persamaan Reaksi',
    question: 'Persamaan reaksi disosiasi garam NaCl dalam air yang tepat adalah...',
    options: [
      'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
      'NaCl(s) ⇌ Na(s) + Cl₂(g)',
      'NaCl(s) + H₂O(l) → NaOH(aq) + HCl(aq)',
      'NaCl(s) → Na⁻(aq) + Cl⁺(aq)',
    ],
    correctIndex: 0,
    explanation: 'Garam NaCl adalah senyawa ionik yang terdisosiasi sempurna menjadi kation Na⁺ dan anion Cl⁻ dengan tanda panah satu arah (→).',
  },
  {
    id: 6,
    category: 'Klasifikasi',
    question: 'Larutan sukrosa (C₁₂H₂₂O₁₁) dan larutan etanol (C₂H₅OH) termasuk non-elektrolit karena...',
    options: [
      'Zat tersebut tidak dapat larut dalam air',
      'Di dalam air zat tersebut terlarut sebagai molekul netral dan tidak menghasilkan ion (α = 0)',
      'Zat tersebut membentuk ion dalam jumlah yang sangat banyak',
      'Zat tersebut mengendap di dasar wadah',
    ],
    correctIndex: 1,
    explanation: 'Sukrosa dan etanol merupakan senyawa kovalen molekuler yang larut dalam air namun tetap berada sebagai molekul utuh tanpa mengalami ionisasi (α = 0).',
  },
  {
    id: 7,
    category: 'Penalaran',
    question: 'Apakah kondisi lampu mati selalu berarti suatu larutan adalah non-elektrolit?',
    options: [
      'Ya, lampu mati sudah pasti menunjukkan tidak ada ion sama sekali',
      'Tidak, karena pada larutan elektrolit yang sangat encer atau elektrolit lemah, arus listrik mungkin terlalu kecil untuk menyalakan lampu pijar, tetapi gelembung gas masih bisa terbentuk',
      'Ya, pengamatan nyala lampu adalah satu-satunya tolok ukur daya hantar listrik',
      'Tidak, karena lampu mati berarti larutan tersebut adalah asam pekat',
    ],
    correctIndex: 1,
    explanation: 'Lampu pijar membutuhkan arus ambang tertentu untuk menyala. Larutan elektrolit lemah atau sangat encer bisa saja lampunya padam namun di elektrodanya tetap terlihat gelembung gas halus.',
  },
  {
    id: 8,
    category: 'Persamaan Reaksi',
    question: 'Persamaan ionisasi asam cuka (CH₃COOH) menggunakan tanda panah bolak-balik (⇌) karena...',
    options: [
      'Reaksi berlangsung sangat cepat dan meledak',
      'Ionisasi asam cuka hanya berlangsung sebagian dan membentuk kesetimbangan dinamis',
      'Asam cuka merupakan elektrolit kuat',
      'Ion yang terbentuk kembali menjadi endapan padat',
    ],
    correctIndex: 1,
    explanation: 'Tanda panah kesetimbangan (⇌) menandakan bahwa hanya sebagian kecil molekul yang terionisasi, sementara sebagian besar tetap berupa molekul netral CH₃COOH.',
  },
  {
    id: 9,
    category: 'Interpretasi Data',
    question: 'Jika 0.1 mol zat terlarut dilarutkan dalam air dan menghasilkan 0.1 mol kation dan 0.1 mol anion secara utuh, maka derajat ionisasi (α) zat tersebut adalah...',
    options: [
      'α = 0',
      'α = 0.5',
      'α = 1',
      'α = 100',
    ],
    correctIndex: 2,
    explanation: 'Derajat ionisasi α = (mol terionisasi) / (mol dilarutkan) = 0.1 / 0.1 = 1 (atau 100% terurai).',
  },
  {
    id: 10,
    category: 'Konsep',
    question: 'Siapakah ilmuwan yang pertama kali merumuskan teori bahwa larutan elektrolit menghantarkan listrik karena terurai menjadi ion-ion bermuatan?',
    options: [
      'Antoine Lavoisier',
      'Svante August Arrhenius',
      'John Dalton',
      'Dmitri Mendeleev',
    ],
    correctIndex: 1,
    explanation: 'Svante Arrhenius pada tahun 1887 mengemukakan teori ionisasi elektrolit, yang mengantarkannya meraih Hadiah Nobel Kimia pada tahun 1903.',
  },
];

interface EvaluasiProps {
  onSaveQuizResult: (result: QuizResult) => void;
  savedResult: QuizResult | null;
}

export const Evaluasi: React.FC<EvaluasiProps> = ({ onSaveQuizResult, savedResult }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(savedResult !== null);
  const [currentScore, setCurrentScore] = useState<number>(savedResult ? savedResult.score : 0);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    let correctCount = 0;

    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 10;
        correctCount += 1;
      }
    });

    setCurrentScore(score);
    setSubmitted(true);

    const result: QuizResult = {
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
    };

    onSaveQuizResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        
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
            <Award size={15} color="var(--teal-600)" />
            <span>Kuis Evaluasi Pemahaman (10 Soal)</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Uji Pemahaman Konsep Larutan
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Setiap soal bernilai 10 poin. Skor maksimal 100. Pembahasan lengkap akan ditampilkan setelah jawaban dikirim.
          </p>
        </div>

        {/* Score Banner (when submitted) */}
        {submitted && (
          <div className="card" style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
            backgroundColor: currentScore >= 80 ? 'var(--teal-50)' : '#fffbeb',
            border: `2px solid ${currentScore >= 80 ? 'var(--teal-400)' : '#fde68a'}`
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: currentScore >= 80 ? 'var(--teal-800)' : '#92400e', marginBottom: '0.3rem' }}>
              Hasil Evaluasi Anda
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: currentScore >= 80 ? 'var(--teal-700)' : '#d97706', lineHeight: 1, marginBottom: '0.5rem' }}>
              {currentScore} <span style={{ fontSize: '1.25rem', color: 'var(--slate-500)' }}>/ 100</span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--slate-700)', fontWeight: 600, marginBottom: '1.25rem' }}>
              {currentScore >= 80 
                ? '🎉 Selamat! Anda telah menguasai konsep daya hantar listrik larutan dengan sangat baik!' 
                : 'Bagus! Pelajari kembali pembahasan di bawah ini dan ulangi kuis untuk meningkatkan nilai Anda.'}
            </p>
            <button
              onClick={handleRetake}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        )}

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {QUIZ_QUESTIONS.map((q, idx) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div 
                key={q.id} 
                className="card" 
                style={{
                  padding: '1.75rem',
                  border: submitted 
                    ? (isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca') 
                    : '1px solid var(--border-card)'
                }}
              >
                {/* Category tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                    Soal 0{idx + 1} · {q.category}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                    10 Poin
                  </span>
                </div>

                {/* Question Text */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                  {q.question}
                </h3>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    let optionBg = '#ffffff';
                    let optionBorder = 'var(--slate-200)';
                    let optionColor = 'var(--slate-800)';

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        optionBg = '#ecfdf5';
                        optionBorder = '#10b981';
                        optionColor = '#065f46';
                      } else if (isSelected && !isCorrect) {
                        optionBg = '#fef2f2';
                        optionBorder = '#ef4444';
                        optionColor = '#991b1b';
                      }
                    } else if (isSelected) {
                      optionBg = 'var(--teal-50)';
                      optionBorder = 'var(--teal-600)';
                      optionColor = 'var(--teal-900)';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${optionBorder}`,
                          backgroundColor: optionBg,
                          color: optionColor,
                          fontSize: '0.9rem',
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: 'left',
                          cursor: submitted ? 'default' : 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isSelected ? 'var(--teal-600)' : 'var(--slate-100)',
                          color: isSelected ? '#ffffff' : 'var(--slate-600)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (after submit) */}
                {submitted && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: isCorrect ? '#f0fdf4' : '#fff1f2',
                    border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecdd3'}`,
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    color: 'var(--slate-700)'
                  }}>
                    <strong style={{ color: isCorrect ? '#166534' : '#9f1239' }}>
                      {isCorrect ? '✓ Jawaban Anda Benar!' : '✕ Jawaban Kurang Tepat.'} Pembahasan:{' '}
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit action */}
        {!submitted && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={answeredCount < 10}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2.2rem',
                fontSize: '1rem',
                opacity: answeredCount === 10 ? 1 : 0.6,
                cursor: answeredCount === 10 ? 'pointer' : 'not-allowed'
              }}
            >
              <span>Kirim Jawaban ({answeredCount}/10 Terjawab)</span>
              <ArrowRight size={18} />
            </button>
            {answeredCount < 10 && (
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.6rem' }}>
                Silakan jawab seluruh 10 soal untuk melihat skor dan pembahasan.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
