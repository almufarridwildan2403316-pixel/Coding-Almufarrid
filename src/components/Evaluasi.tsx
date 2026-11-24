import React, { useEffect, useRef, useState } from 'react';
import type { QuizAnswer, QuizQuestion, QuizResult, StudentIdentity } from '../types/chemistry';
import { Award, RotateCcw, ArrowRight, FileText } from 'lucide-react';
import { clearQuizDraft, EVALUATION_QUIZ_ID, getQuizDraft, saveQuizDraft } from '../utils/storage';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    category: 'Konsep',
    question: 'Penyebab utama larutan elektrolit dapat menghantarkan arus listrik adalah...',
    options: [
      'Adanya molekul zat terlarut yang bergerak dengan kecepatan tinggi',
      'Keberadaan ion-ion bermuatan listrik yang dapat bergerak bebas dalam larutan',
      'Terjadinya peningkatan suhu air saat zat dilarutkan',
      'Adanya elektron bebas yang melompat di antara molekul air',
      'Kehadiran gas di dalam larutan yang menutup rangkaian',
    ],
    correctIndex: 1,
    explanation: 'Daya hantar listrik dalam larutan cair dibawa oleh ion-ion positif (kation) dan ion negatif (anion) yang bebas bergerak, bukan oleh elektron bebas atau molekul netral.',
  },
  {
    id: 2,
    type: 'multiple-choice',
    category: 'Klasifikasi',
    question: 'Di antara larutan berikut yang tergolong ke dalam elektrolit kuat adalah...',
    options: [
      'Larutan gula (sukrosa)',
      'Larutan asam asetat (cuka dapur)',
      'Larutan natrium klorida (NaCl) dan asam klorida (HCl)',
      'Larutan amonia (NH₃) encer',
      'Larutan etanol dalam air',
    ],
    correctIndex: 2,
    explanation: 'NaCl dan HCl terurai/terionisasi sempurna (derajat ionisasi α = 1) di dalam air, sehingga menghasilkan konsentrasi ion yang tinggi dan digolongkan sebagai elektrolit kuat.',
  },
  {
    id: 3,
    type: 'multiple-choice',
    category: 'Interpretasi Data',
    context: 'Dalam suatu percobaan uji daya hantar listrik, seorang siswa menguji tiga larutan, yaitu larutan NaCl, larutan glukosa, dan larutan X. Ketiga larutan memiliki konsentrasi, volume, dan suhu yang sama. Pengujian dilakukan menggunakan alat yang sama, dengan tegangan listrik, jenis elektroda, dan jarak antar-elektroda yang dikondisikan tetap. Hasil pengamatan ditunjukkan pada tabel berikut.',
    comparisonTable: {
      headers: ['Larutan', 'Nyala lampu', 'Gelembung gas'],
      rows: [
        ['NaCl', 'Terang', 'Banyak'],
        ['Glukosa', 'Tidak menyala', 'Tidak ada'],
        ['X', 'Redup', 'Sedikit'],
      ],
    },
    question: 'Berdasarkan perbandingan hasil pengamatan tersebut, analisis yang paling tepat mengenai karakteristik larutan X adalah...',
    options: [
      'Larutan X termasuk non-elektrolit karena tidak mampu menghasilkan nyala lampu yang terang.',
      'Larutan X termasuk elektrolit kuat karena terbentuk gelembung gas pada permukaan elektroda.',
      'Larutan X termasuk elektrolit lemah karena hanya sebagian zat terionisasi menjadi ion-ion yang dapat bergerak bebas dalam larutan.',
      'Larutan X termasuk elektrolit kuat karena seluruh zat terionisasi sempurna, tetapi tidak menghasilkan daya hantar listrik yang optimal.',
      'Larutan X termasuk non-elektrolit karena sebagian besar zat terlarut tetap berada dalam bentuk molekul netral.',
    ],
    correctIndex: 2,
    explanation: 'NaCl menunjukkan karakteristik elektrolit kuat karena lampu menyala terang dan terbentuk banyak gelembung. Glukosa merupakan non-elektrolit karena lampu tidak menyala dan tidak terbentuk gelembung. Pada kondisi pengujian yang sama, larutan X menghasilkan lampu redup dan sedikit gelembung, sehingga dikategorikan sebagai elektrolit lemah: hanya sebagian zat terionisasi menjadi ion yang dapat bergerak bebas dan menghantarkan arus. Derajat ionisasinya berada pada rentang 0 < α < 1.',
  },
  {
    id: 4,
    type: 'multiple-choice',
    category: 'Konsep',
    question: 'Mengapa kristal padat NaCl (garam dapur) tidak dapat menghantarkan arus listrik, tetapi larutan NaCl dalam air dapat menghantarkannya?',
    options: [
      'Dalam kristal padat tidak terdapat ion',
      'Dalam kristal padat, ion-ion terikat kuat dalam kisi kristal sehingga tidak dapat bergerak bebas',
      'Air memberikan muatan listrik tambahan pada garam',
      'Kristal padat menyerap arus listrik menjadi energi panas',
      'NaCl padat berubah menjadi gas saat tidak bergerak',
    ],
    correctIndex: 1,
    explanation: 'Kristal padat NaCl tersusun atas ion Na⁺ dan Cl⁻, namun terikat sangat kaku dalam kisi kristal. Ketika dilarutkan dalam air, molekul air memisahkan ion-ion tersebut sehingga ion bebas bergerak.',
  },
  {
    id: 5,
    type: 'multiple-choice',
    category: 'Persamaan Reaksi',
    question: 'Persamaan reaksi disosiasi garam NaCl dalam air yang tepat adalah...',
    options: [
      'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',
      'NaCl(s) ⇌ Na(s) + Cl₂(g)',
      'NaCl(s) + H₂O(l) → NaOH(aq) + HCl(aq)',
      'NaCl(s) → Na⁻(aq) + Cl⁺(aq)',
      'NaCl(s) → NaCl(aq) tanpa ion',
    ],
    correctIndex: 0,
    explanation: 'Garam NaCl adalah senyawa ionik yang terdisosiasi sempurna menjadi kation Na⁺ dan anion Cl⁻ dengan tanda panah satu arah (→).',
  },
  {
    id: 6,
    type: 'multiple-choice',
    category: 'Klasifikasi',
    question: 'Larutan sukrosa (C₁₂H₂₂O₁₁) dan larutan etanol (C₂H₅OH) termasuk non-elektrolit karena...',
    options: [
      'Zat tersebut tidak dapat larut dalam air',
      'Di dalam air zat tersebut terlarut sebagai molekul netral dan tidak menghasilkan ion (α = 0)',
      'Zat tersebut membentuk ion dalam jumlah yang sangat banyak',
      'Zat tersebut mengendap di dasar wadah',
      'Zat tersebut selalu berbentuk gas saat dilarutkan',
    ],
    correctIndex: 1,
    explanation: 'Sukrosa dan etanol merupakan senyawa kovalen molekuler yang larut dalam air namun tetap berada sebagai molekul utuh tanpa mengalami ionisasi (α = 0).',
  },
  {
    id: 7,
    type: 'multiple-choice',
    category: 'Penalaran',
    question: 'Apakah kondisi lampu mati selalu berarti suatu larutan adalah non-elektrolit?',
    options: [
      'Ya, lampu mati sudah pasti menunjukkan tidak ada ion sama sekali',
      'Tidak, karena pada larutan elektrolit yang sangat encer atau elektrolit lemah, arus listrik mungkin terlalu kecil untuk menyalakan lampu pijar, tetapi gelembung gas masih bisa terbentuk',
      'Ya, pengamatan nyala lampu adalah satu-satunya tolok ukur daya hantar listrik',
      'Tidak, karena lampu mati berarti larutan tersebut adalah asam pekat',
      'Ya, lampu mati berarti larutan tidak mengandung air',
    ],
    correctIndex: 1,
    explanation: 'Lampu pijar membutuhkan arus ambang tertentu untuk menyala. Larutan elektrolit lemah atau sangat encer bisa saja lampunya padam namun di elektrodanya tetap terlihat gelembung gas halus.',
  },
  {
    id: 8,
    type: 'multiple-choice',
    category: 'Persamaan Reaksi',
    question: 'Persamaan ionisasi asam cuka (CH₃COOH) menggunakan tanda panah bolak-balik (⇌) karena...',
    options: [
      'Reaksi berlangsung sangat cepat dan meledak',
      'Ionisasi asam cuka hanya berlangsung sebagian dan membentuk kesetimbangan dinamis',
      'Asam cuka merupakan elektrolit kuat',
      'Ion yang terbentuk kembali menjadi endapan padat',
      'Asam cuka tidak pernah berubah menjadi ion',
    ],
    correctIndex: 1,
    explanation: 'Tanda panah kesetimbangan (⇌) menandakan bahwa hanya sebagian kecil molekul yang terionisasi, sementara sebagian besar tetap berupa molekul netral CH₃COOH.',
  },
  {
    id: 9,
    type: 'multiple-choice',
    category: 'Interpretasi Data',
    question: 'Jika 0.1 mol zat terlarut dilarutkan dalam air dan menghasilkan 0.1 mol kation dan 0.1 mol anion secara utuh, maka derajat ionisasi (α) zat tersebut adalah...',
    options: [
      'α = 0',
      'α = 0.5',
      'α = 1',
      'α = 100',
      'α = 10',
    ],
    correctIndex: 2,
    explanation: 'Derajat ionisasi α = (mol terionisasi) / (mol dilarutkan) = 0.1 / 0.1 = 1 (atau 100% terurai).',
  },
  {
    id: 10,
    type: 'multiple-choice',
    category: 'Konsep',
    question: 'Siapakah ilmuwan yang pertama kali merumuskan teori bahwa larutan elektrolit menghantarkan listrik karena terurai menjadi ion-ion bermuatan?',
    options: [
      'Antoine Lavoisier',
      'Svante August Arrhenius',
      'John Dalton',
      'Dmitri Mendeleev',
      'Marie Curie',
    ],
    correctIndex: 1,
    explanation: 'Svante Arrhenius pada tahun 1887 mengemukakan teori ionisasi elektrolit, yang mengantarkannya meraih Hadiah Nobel Kimia pada tahun 1903.',
  },
  {
    id: 11,
    type: 'essay',
    category: 'Penalaran',
    question: 'Jelaskan mengapa larutan elektrolit kuat dapat menghasilkan nyala lampu yang lebih terang dibandingkan larutan elektrolit lemah.',
    explanation: 'Jawaban yang baik menjelaskan bahwa elektrolit kuat memiliki jumlah ion yang besar, sehingga arus listrik yang ditangkap lebih besar dan lampu menyala lebih terang.',
  },
  {
    id: 12,
    type: 'essay',
    category: 'Persamaan Reaksi',
    question: 'Tuliskan proses ionisasi HCl dalam air dan jelaskan peran molekul air dalam memisahkan ion-ionnya.',
    explanation: 'Jawaban yang tepat mencakup reaksi HCl(aq) → H⁺(aq) + Cl⁻(aq) serta penjelasan bahwa air berperan sebagai pelarut polar yang memisahkan ion.',
  },
];

const buildSubmissionMap = (savedResult: QuizResult | null): Record<number, QuizAnswer> => {
  if (!savedResult || !Array.isArray(savedResult.submissionData)) {
    return {};
  }

  return savedResult.submissionData.reduce((acc, answer) => {
    acc[answer.questionId] = answer;
    return acc;
  }, {} as Record<number, QuizAnswer>);
};

const createQuizAttemptId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `attempt-${crypto.randomUUID()}`
    : `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

const QUIZ_QUESTION_VERSION = 'v1';

const createInitialQuizState = (savedResult: QuizResult | null, student: StudentIdentity) => {
  try {
    const draft = getQuizDraft(student, EVALUATION_QUIZ_ID);
    if (draft) {
      return {
        submissionData: draft.answers,
        attemptId: draft.attemptId,
        lastQuestionId: draft.lastQuestionId,
        submitted: false,
        currentScore: 0,
        draftMessage: 'Draf jawaban dipulihkan dari perangkat ini.',
      };
    }
  } catch (error) {
    return {
      submissionData: buildSubmissionMap(savedResult),
      attemptId: createQuizAttemptId(),
      lastQuestionId: null,
      submitted: savedResult !== null,
      currentScore: savedResult?.score ?? 0,
      draftMessage: error instanceof Error
        ? `Percobaan kuis tidak dapat dipulihkan: ${error.message}`
        : 'Percobaan kuis tidak dapat dipulihkan.',
    };
  }

  return {
    submissionData: buildSubmissionMap(savedResult),
    attemptId: createQuizAttemptId(),
    lastQuestionId: null,
    submitted: savedResult !== null,
    currentScore: savedResult?.score ?? 0,
    draftMessage: '',
  };
};

interface EvaluasiProps {
  onSaveQuizResult: (result: QuizResult) => Promise<void>;
  savedResult: QuizResult | null;
  student: StudentIdentity;
}

export const Evaluasi: React.FC<EvaluasiProps> = ({ onSaveQuizResult, savedResult, student }) => {
  const [initialState] = useState(() => createInitialQuizState(savedResult, student));
  const [submissionData, setSubmissionData] = useState<Record<number, QuizAnswer>>(initialState.submissionData);
  const [attemptId, setAttemptId] = useState(initialState.attemptId);
  const [submitted, setSubmitted] = useState(initialState.submitted);
  const [currentScore, setCurrentScore] = useState(initialState.currentScore);
  const [draftMessage, setDraftMessage] = useState(initialState.draftMessage);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSaveFailed, setLocalSaveFailed] = useState(false);
  const [pendingResult, setPendingResult] = useState<QuizResult | null>(null);
  const submissionInFlightRef = useRef(false);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const questionIdToRestore = initialState.lastQuestionId;

  useEffect(() => {
    if (questionIdToRestore === null) return;
    const frameId = window.requestAnimationFrame(() => {
      questionRefs.current[questionIdToRestore]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [questionIdToRestore]);

  const updateDraft = (draft: Record<number, QuizAnswer>, questionId: number) => {
    setSubmissionData(draft);
    try {
      saveQuizDraft(student, {
        userId: student.id ?? 'guest',
        quizId: EVALUATION_QUIZ_ID,
        attemptId,
        answers: draft,
        lastQuestionId: questionId,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      setDraftMessage('Jawaban tersimpan di perangkat ini.');
    } catch (error) {
      setDraftMessage(error instanceof Error
        ? `Gagal menyimpan jawaban: ${error.message}`
        : 'Gagal menyimpan jawaban. Silakan coba lagi.');
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setSubmitError('');
    updateDraft({
      ...submissionData,
      [questionId]: {
        questionId,
        questionType: 'multiple-choice',
        selectedOption: optionIndex,
      },
    }, questionId);
  };

  const handleEssayChange = (questionId: number, value: string) => {
    if (submitted) return;
    setSubmitError('');
    updateDraft({
      ...submissionData,
      [questionId]: {
        questionId,
        questionType: 'essay',
        essayText: value,
      },
    }, questionId);
  };

  const isQuestionAnswered = (question: QuizQuestion): boolean => {
    const answer = submissionData[question.id];

    if (question.type === 'multiple-choice') {
      return typeof answer?.selectedOption === 'number';
    }

    return typeof answer?.essayText === 'string' && answer.essayText.trim().length > 0;
  };

  const handleSubmit = async () => {
    if (submitted || submissionInFlightRef.current || answeredCount < QUIZ_QUESTIONS.length) return;
    submissionInFlightRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    setDraftMessage('Sedang menyimpan jawaban...');

    let draftWasSaved = true;
    try {
      saveQuizDraft(student, {
        userId: student.id ?? 'guest',
        quizId: EVALUATION_QUIZ_ID,
        attemptId,
        answers: submissionData,
        lastQuestionId: null,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      setDraftMessage('Jawaban tersimpan di perangkat ini.');
    } catch (error) {
      draftWasSaved = false;
      setDraftMessage(error instanceof Error
        ? `Gagal menyimpan draf lokal: ${error.message}`
        : 'Gagal menyimpan draf lokal. Periksa penyimpanan browser.');
    }

    let score = 0;
    let correctCount = 0;

    const submissionList: QuizAnswer[] = QUIZ_QUESTIONS.map((q) => {
      const answer = submissionData[q.id];

      if (q.type === 'multiple-choice') {
        const selectedOption = answer?.selectedOption;
        if (typeof selectedOption === 'number' && selectedOption === q.correctIndex) {
          score += 10;
          correctCount += 1;
        }

        return {
          questionId: q.id,
          questionType: 'multiple-choice',
          selectedOption,
        };
      }

      return {
        questionId: q.id,
        questionType: 'essay',
        essayText: answer?.essayText ?? '',
      };
    });

    const result: QuizResult = {
      id: attemptId,
      quizId: EVALUATION_QUIZ_ID,
      questionVersion: QUIZ_QUESTION_VERSION,
      studentName: student.name,
      studentClass: student.className,
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
      submissionData: submissionList,
      essayAnswers: Object.fromEntries(
        submissionList
          .filter((answer) => answer.questionType === 'essay')
          .map((answer) => [answer.questionId, answer.essayText ?? ''])
      ),
    };
    setPendingResult(result);

    try {
      await onSaveQuizResult(result);
      setLocalSaveFailed(false);
      setPendingResult(null);
    } catch (error) {
      setSubmitError('Jawaban belum berhasil dikirim. Silakan coba lagi.');
      const localSaveError = !draftWasSaved || /lokal|localStorage|perangkat|ruang penyimpanan/i.test(
        error instanceof Error ? error.message : '',
      );
      setLocalSaveFailed(localSaveError);
      setDraftMessage(localSaveError
        ? 'Jawaban belum berhasil disimpan. Jawaban Anda masih tersedia di halaman ini. Silakan coba simpan kembali.'
        : 'Jawaban berhasil disimpan secara lokal, tetapi sinkronisasi akun belum berhasil.');
      return;
    } finally {
      submissionInFlightRef.current = false;
      setIsSubmitting(false);
    }

    setCurrentScore(score);
    setSubmitted(true);
    setSubmitError('');
    try {
      clearQuizDraft(student, EVALUATION_QUIZ_ID);
      setDraftMessage('Jawaban berhasil disimpan.');
    } catch (error) {
      setDraftMessage(error instanceof Error
        ? `Hasil tersimpan, tetapi draf lokal belum dapat dihapus: ${error.message}`
        : 'Hasil tersimpan, tetapi draf lokal belum dapat dihapus.');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetrySave = async () => {
    if (!pendingResult || isSubmitting) return;
    submissionInFlightRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    setDraftMessage('Sedang menyimpan jawaban...');

    try {
      await onSaveQuizResult(pendingResult);
      setLocalSaveFailed(false);
      setPendingResult(null);
      setCurrentScore(pendingResult.score);
      setSubmitted(true);
      setDraftMessage('Jawaban berhasil disimpan.');
      clearQuizDraft(student, EVALUATION_QUIZ_ID);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setLocalSaveFailed(true);
      setSubmitError('');
      setDraftMessage('Jawaban belum berhasil disimpan. Jawaban Anda masih tersedia di halaman ini. Silakan coba simpan kembali.');
    } finally {
      submissionInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    const nextAttemptId = createQuizAttemptId();
    setAttemptId(nextAttemptId);
    try {
      saveQuizDraft(student, {
        userId: student.id ?? 'guest',
        quizId: EVALUATION_QUIZ_ID,
        attemptId: nextAttemptId,
        answers: {},
        lastQuestionId: null,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      setDraftMessage('Percobaan baru dimulai dan tersimpan di perangkat ini.');
    } catch (error) {
      setDraftMessage(error instanceof Error
        ? `Percobaan baru gagal disimpan: ${error.message}`
        : 'Percobaan baru gagal disimpan di perangkat ini.');
    }
    setSubmissionData({});
    setSubmitted(false);
    setCurrentScore(0);
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = QUIZ_QUESTIONS.filter((q) => isQuestionAnswered(q)).length;
  const hasDraftError = /gagal|tidak dapat|belum tersimpan/i.test(draftMessage);

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
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
            <span>Kuis Evaluasi Pemahaman (10 Pilihan Ganda + 2 Esai)</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Uji Pemahaman Konsep Larutan
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Soal pilihan ganda otomatis dinilai. Soal esai akan disimpan dan ditampilkan di dashboard guru untuk penilaian manual.
          </p>
          {draftMessage && (
            <p
              role={hasDraftError ? 'alert' : 'status'}
              aria-live="polite"
              style={{
                color: hasDraftError
                  ? '#b91c1c'
                  : 'var(--teal-800)',
                fontSize: '0.85rem',
                marginTop: '0.75rem',
              }}
            >
              {draftMessage}
            </p>
          )}
        </div>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {QUIZ_QUESTIONS.map((q, idx) => {
            const answer = submissionData[q.id];
            const userAnswer = q.type === 'multiple-choice' ? answer?.selectedOption : undefined;
            const isCorrect = q.type === 'multiple-choice' && typeof userAnswer === 'number' && userAnswer === q.correctIndex;
            const essayValue = q.type === 'essay' ? (answer?.essayText ?? '') : '';

            return (
              <div
                key={q.id}
                ref={(element) => { questionRefs.current[q.id] = element; }}
                className="card"
                style={{
                  padding: '1.75rem',
                  border: submitted
                    ? (q.type === 'multiple-choice' ? (isCorrect ? '1px solid #a7f3d0' : '1px solid #fecaca') : '1px solid #dbeafe')
                    : '1px solid var(--border-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                    Soal 0{idx + 1} · {q.category} · {q.type === 'multiple-choice' ? 'Pilihan Ganda' : 'Esai'}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                    {q.type === 'multiple-choice' ? '10 Poin' : 'Nilai Manual'}
                  </span>
                </div>

                {q.context && (
                  <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 1rem' }}>
                    {q.context}
                  </p>
                )}

                {q.comparisonTable && (
                  <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                    <table
                      aria-label="Hasil pengamatan uji daya hantar listrik"
                      style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', color: 'var(--slate-800)' }}
                    >
                      <caption style={{ textAlign: 'left', padding: '0 0 0.6rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                        Hasil pengamatan
                      </caption>
                      <thead>
                        <tr>
                          {q.comparisonTable.headers.map((header) => (
                            <th
                              key={header}
                              scope="col"
                              style={{
                                padding: '0.75rem',
                                border: '1px solid var(--slate-200)',
                                backgroundColor: 'var(--teal-50)',
                                color: 'var(--navy-900)',
                                fontSize: '0.9rem',
                                textAlign: 'left',
                              }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {q.comparisonTable.rows.map(([solution, lamp, bubbles]) => (
                          <tr key={solution}>
                            <th
                              scope="row"
                              style={{
                                padding: '0.75rem',
                                border: '1px solid var(--slate-200)',
                                fontSize: '0.9rem',
                                textAlign: 'left',
                              }}
                            >
                              {solution}
                            </th>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--slate-200)', fontSize: '0.9rem' }}>
                              {lamp}
                            </td>
                            <td style={{ padding: '0.75rem', border: '1px solid var(--slate-200)', fontSize: '0.9rem' }}>
                              {bubbles}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                  {q.question}
                </h3>

                {q.type === 'multiple-choice' && q.options && (
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
                )}

                {q.type === 'essay' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-600)' }}>
                      <FileText size={15} />
                      Jawaban Esai
                    </label>
                    <textarea
                      value={essayValue}
                      onChange={(event) => handleEssayChange(q.id, event.target.value)}
                      disabled={submitted}
                      placeholder="Tuliskan jawaban Anda di sini..."
                      rows={5}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        border: '1px solid var(--slate-200)',
                        backgroundColor: submitted ? '#f8fafc' : '#ffffff',
                        padding: '0.9rem 1rem',
                        resize: 'vertical',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        color: 'var(--slate-800)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {submitted && q.type === 'multiple-choice' && (
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

                {submitted && q.type === 'essay' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    color: 'var(--slate-700)'
                  }}>
                    <strong style={{ color: '#1d4ed8' }}>📝 Jawaban esai Anda telah tersimpan untuk ditinjau guru.</strong>
                    <div style={{ marginTop: '0.4rem' }}>
                      {essayValue.trim() ? essayValue : 'Belum ada jawaban esai yang dikirim.'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted && (
          <div style={{ textAlign: 'center' }}>
            {submitError && (
              <p role="alert" style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {submitError}
              </p>
            )}
            {localSaveFailed && pendingResult && (
              <button
                onClick={handleRetrySave}
                disabled={isSubmitting}
                className="btn btn-secondary"
                style={{
                  marginRight: '0.75rem',
                  padding: '0.85rem 1.5rem',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Sedang menyimpan...' : 'Coba Simpan Kembali'}
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < QUIZ_QUESTIONS.length}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2.2rem',
                fontSize: '1rem',
                opacity: answeredCount === QUIZ_QUESTIONS.length && !isSubmitting ? 1 : 0.6,
                cursor: answeredCount === QUIZ_QUESTIONS.length && !isSubmitting ? 'pointer' : 'not-allowed'
              }}
            >
              <span>{isSubmitting ? 'Mengirim Jawaban…' : `Kirim Jawaban (${answeredCount}/${QUIZ_QUESTIONS.length} Terjawab)`}</span>
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
            {answeredCount < QUIZ_QUESTIONS.length && (
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.6rem' }}>
                Silakan jawab seluruh soal pilihan ganda dan esai untuk mengirimkan kuis ke dashboard guru.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
