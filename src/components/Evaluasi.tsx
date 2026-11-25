import React, { useEffect, useRef, useState } from 'react';
import type { QuizAnswer, QuizQuestion, QuizResult, StudentIdentity } from '../types/chemistry';
import { Award, RotateCcw, ArrowRight, FileText } from 'lucide-react';
import { clearQuizDraft, EVALUATION_QUIZ_ID, getQuizDraft, saveQuizDraft } from '../utils/storage';
import { QUIZ_QUESTIONS as VERSIONED_QUIZ_QUESTIONS, QUIZ_QUESTION_VERSION } from '../data/evaluationQuiz';

const QUIZ_QUESTIONS: QuizQuestion[] = VERSIONED_QUIZ_QUESTIONS;

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

const createInitialQuizState = (savedResult: QuizResult | null, student: StudentIdentity) => {
  try {
    const draft = getQuizDraft(student, EVALUATION_QUIZ_ID);
    if (draft?.questionVersion === QUIZ_QUESTION_VERSION) {
      return {
        submissionData: draft.answers,
        attemptId: draft.attemptId,
        lastQuestionId: draft.lastQuestionId,
        submitted: false,
        currentScore: 0,
        draftMessage: 'Draf jawaban dipulihkan dari perangkat ini.',
      };
    }

    if (draft || (savedResult && savedResult.questionVersion !== QUIZ_QUESTION_VERSION)) {
      const attemptId = createQuizAttemptId();
      saveQuizDraft(student, {
        userId: student.id ?? 'guest',
        quizId: EVALUATION_QUIZ_ID,
        attemptId,
        questionVersion: QUIZ_QUESTION_VERSION,
        answers: {},
        lastQuestionId: null,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      return {
        submissionData: {},
        attemptId,
        lastQuestionId: null,
        submitted: false,
        currentScore: 0,
        draftMessage: `Bank soal diperbarui ke versi ${QUIZ_QUESTION_VERSION}. Draf versi lama diarsipkan dan percobaan baru dimulai; riwayat terkirim tetap tersimpan.`,
      };
    }
  } catch (error) {
    return {
      submissionData: savedResult?.questionVersion === QUIZ_QUESTION_VERSION ? buildSubmissionMap(savedResult) : {},
      attemptId: createQuizAttemptId(),
      lastQuestionId: null,
      submitted: savedResult?.questionVersion === QUIZ_QUESTION_VERSION,
      currentScore: savedResult?.questionVersion === QUIZ_QUESTION_VERSION ? savedResult.score : 0,
      draftMessage: error instanceof Error
        ? `Percobaan kuis tidak dapat dipulihkan: ${error.message}`
        : 'Percobaan kuis tidak dapat dipulihkan.',
    };
  }

  return {
    submissionData: savedResult?.questionVersion === QUIZ_QUESTION_VERSION ? buildSubmissionMap(savedResult) : {},
    attemptId: createQuizAttemptId(),
    lastQuestionId: null,
    submitted: savedResult?.questionVersion === QUIZ_QUESTION_VERSION,
    currentScore: savedResult?.questionVersion === QUIZ_QUESTION_VERSION ? savedResult.score : 0,
    draftMessage: savedResult && savedResult.questionVersion !== QUIZ_QUESTION_VERSION
      ? `Riwayat evaluasi versi lama tetap tersimpan. Mulai percobaan baru untuk mengerjakan bank soal ${QUIZ_QUESTION_VERSION}.`
      : '',
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
        questionVersion: QUIZ_QUESTION_VERSION,
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
        questionVersion: QUIZ_QUESTION_VERSION,
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
        questionVersion: QUIZ_QUESTION_VERSION,
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
            <span>Kuis Evaluasi Pemahaman (10 Pilihan Ganda + 2 Uraian)</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Uji Pemahaman Konsep Larutan
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6 }}>
            Soal pilihan ganda otomatis dinilai. Soal uraian disimpan dan ditampilkan di dashboard guru untuk penilaian manual.
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
            const questionLabel = q.type === 'essay' ? `Esai ${q.id - 10}` : `Soal ${String(idx + 1).padStart(2, '0')}`;

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
                    {questionLabel} · {q.cognitiveLevel} · {q.category} · {q.type === 'multiple-choice' ? 'Pilihan Ganda' : 'Uraian'}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                    {q.type === 'multiple-choice' ? '10 Poin' : 'Maks. 20 Poin · Nilai Manual'}
                  </span>
                </div>

                {q.context && (
                  <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 1rem', whiteSpace: 'pre-line' }}>
                    {q.context}
                  </p>
                )}

                {q.comparisonTable && (
                  <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                    <table
                      aria-label="Hasil pengamatan uji daya hantar listrik"
                      style={{
                        width: '100%',
                        minWidth: q.comparisonTable.headers.length > 3 ? '650px' : '420px',
                        borderCollapse: 'collapse',
                        color: 'var(--slate-800)',
                      }}
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
                        {q.comparisonTable.rows.map((row, rowIndex) => (
                          <tr key={`${row[0]}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => {
                              const Cell = cellIndex === 0 ? 'th' : 'td';
                              return (
                                <Cell
                                  key={`${rowIndex}-${cellIndex}`}
                                  scope={cellIndex === 0 ? 'row' : undefined}
                                  style={{
                                    padding: '0.75rem',
                                    border: '1px solid var(--slate-200)',
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                  }}
                                >
                                  {cell}
                                </Cell>
                              );
                            })}
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
                      Jawaban Uraian
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
                    <strong style={{ color: '#1d4ed8' }}>📝 Jawaban uraian Anda telah tersimpan untuk ditinjau guru.</strong>
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
