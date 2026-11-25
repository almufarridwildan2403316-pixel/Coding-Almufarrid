import React, { useState } from 'react';
import type { QuizGradingInput, QuizSubmission } from '../types/chemistry';
import { BookOpenCheck, CheckCircle2, FileText, Save, UserRound } from 'lucide-react';
import { getEssayMaximumForVersion, getQuestionsForVersion } from '../utils/quizGrading';

interface TeacherDashboardProps {
  submissions: QuizSubmission[];
  isLoading: boolean;
  loadError: string;
  onSaveReview: (
    submission: QuizSubmission,
    updates: QuizGradingInput,
  ) => Promise<void>;
}

const formatDate = (value: string) => new Date(value).toLocaleString('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const submissionKey = (submission: QuizSubmission) => `${submission.userId ?? 'unknown'}:${submission.id}`;

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions: accountSubmissions,
  isLoading,
  loadError,
  onSaveReview,
}) => {
  const submissions = accountSubmissions;
  const [draftScores, setDraftScores] = useState<Record<string, Record<string, string>>>({});
  const [draftFeedback, setDraftFeedback] = useState<Record<string, Record<number, string>>>({});
  const [savingSubmissionId, setSavingSubmissionId] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');

  const activeVersionSubmissions = submissions.filter((submission) => submission.questionVersion === 'v4');
  const averageScore = activeVersionSubmissions.length
    ? Math.round(activeVersionSubmissions.reduce((total, submission) => total + submission.score, 0) / activeVersionSubmissions.length)
    : null;

  const totalEssayResponses = submissions.reduce((count, submission) => {
    return count + submission.answers.filter((answer) => answer.questionType === 'essay' && (answer.essayText ?? '').trim().length > 0).length;
  }, 0);

  const handleSaveReview = async (submission: QuizSubmission) => {
    const key = submissionKey(submission);
    setSavingSubmissionId(key);
    setReviewMessage('');
    try {
      const questions = getQuestionsForVersion(submission.questionVersion);
      const rubricForEssay = (questionId: number) => {
        const question = questions.find((item) => item.id === questionId);
        if (question?.type !== 'essay' || !question.rubric?.length) {
          throw new Error(`Rubrik Esai ${questionId - 10} tidak tersedia.`);
        }
        return Object.fromEntries(question.rubric.map((criterion) => {
          const rawScore = draftScores[key]?.[`${questionId}:${criterion.id}`]
            ?? submission[`essay${questionId - 10}Assessment` as 'essay1Assessment' | 'essay2Assessment']?.rubricScores[criterion.id]?.toString()
            ?? '';
          if (rawScore.trim() === '' || !/^\d+$/.test(rawScore)) {
            throw new Error(`Skor indikator "${criterion.criterion}" harus berupa angka bulat.`);
          }
          const score = Number(rawScore);
          if (score > criterion.points) {
            throw new Error(`Skor indikator "${criterion.criterion}" maksimal ${criterion.points}.`);
          }
          return [criterion.id, score];
        }));
      };
      await onSaveReview(submission, {
        essay1RubricScores: rubricForEssay(11),
        essay2RubricScores: rubricForEssay(12),
        essay1Feedback: draftFeedback[key]?.[11] ?? submission.essay1Assessment?.feedback ?? '',
        essay2Feedback: draftFeedback[key]?.[12] ?? submission.essay2Assessment?.feedback ?? '',
      });
      setReviewMessage(`Penilaian percobaan #${submission.attemptNumber ?? '—'} berhasil disimpan.`);
    } catch (error) {
      setReviewMessage(error instanceof Error
        ? `Review gagal disimpan: ${error.message}`
        : 'Review gagal disimpan.');
    } finally {
      setSavingSubmissionId(null);
    }
  };

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontWeight: 700,
            fontSize: '0.8rem',
            marginBottom: '0.75rem'
          }}>
            <BookOpenCheck size={15} />
            <span>Teacher Dashboard</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--navy-950)' }}>
            Rekap Hasil Kuis Siswa
          </h1>
          <p style={{ color: 'var(--slate-600)', lineHeight: 1.6 }}>
            Menampilkan skor pilihan ganda otomatis, jawaban esai siswa, serta catatan penilaian manual yang disimpan untuk review guru.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Pengumpulan</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>{submissions.length}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Rata-Rata PG v4</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal-700)' }}>{averageScore === null ? '—' : `${averageScore}/50`}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Jawaban Esai</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{totalEssayResponses}</div>
          </div>
        </div>

        {isLoading && (
          <div className="card" role="status" style={{ padding: '1rem', marginBottom: '1rem' }}>
            Memuat riwayat kuis siswa dari Firebase…
          </div>
        )}
        {loadError && (
          <div className="card" role="alert" style={{ padding: '1rem', marginBottom: '1rem', color: '#b91c1c' }}>
            {loadError}
          </div>
        )}
        {reviewMessage && (
          <div className="card" role="status" aria-live="polite" style={{ padding: '1rem', marginBottom: '1rem' }}>
            {reviewMessage}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-600)' }}>
            {isLoading ? 'Riwayat sedang dimuat.' : 'Belum ada hasil kuis siswa yang dikirim.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {submissions.map((submission) => {
              const essayAnswers = submission.answers.filter(
                (answer) => answer.questionType === 'essay' && (answer.essayText ?? '').trim().length > 0
              );
              const multipleChoiceAnswers = submission.answers.filter(
                (answer) => answer.questionType === 'multiple-choice'
              );
              const questionSet = getQuestionsForVersion(submission.questionVersion);
              const maximumEssayScore = getEssayMaximumForVersion(submission.questionVersion);
              const supportsCurrentRubric = submission.questionVersion === 'v4'
                && questionSet.filter((question) => question.type === 'essay').length === 2;

              return (
                <div key={submissionKey(submission)} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfeff', color: '#0f766e' }}>
                        <UserRound size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>{submission.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                          Kelas {submission.studentClass} · Percobaan #{submission.attemptNumber ?? '—'} · {formatDate(submission.submittedAt)}
                          {' · '}Versi {submission.questionVersion ?? 'v1'} · {submission.status ?? 'Terkirim'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
                        Skor Pilihan Ganda: {submission.score}/{submission.questionVersion === 'v4' ? 50 : 100}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Benar</div>
                      <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--teal-700)' }}>{submission.correctAnswers}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Soal Dikerjakan</div>
                      <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--navy-900)' }}>{submission.totalQuestions}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Jawaban Esai</div>
                      <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#2563eb' }}>{essayAnswers.length}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <div style={{ border: '1px solid #dbeafe', borderRadius: '12px', backgroundColor: '#eff6ff', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>
                        <CheckCircle2 size={16} />
                        Jawaban Pilihan Ganda
                      </div>
                      {multipleChoiceAnswers.length === 0 ? (
                        <div style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Tidak ada jawaban pilihan ganda.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {multipleChoiceAnswers.map((answer) => {
                            const question = questionSet.find((item) => item.id === answer.questionId);
                            const selectedOption = answer.selectedOption;
                            const answerText = question?.options && typeof selectedOption === 'number'
                              ? question.options[selectedOption]
                              : `Opsi ${typeof selectedOption === 'number' ? String.fromCharCode(65 + selectedOption) : '—'}`;
                            return (
                              <div key={answer.questionId} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.75rem', border: '1px solid #dbeafe' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                                  Soal #{answer.questionId}{question ? ` · ${question.cognitiveLevel}` : ''}
                                </div>
                                {question && (
                                  <div style={{ fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                                    {question.question}
                                  </div>
                                )}
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--slate-700)' }}>{answerText}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div style={{ border: '1px solid #dbeafe', borderRadius: '12px', backgroundColor: '#eff6ff', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>
                        <FileText size={16} />
                        Jawaban Esai Siswa
                      </div>

                      {essayAnswers.length === 0 ? (
                        <div style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Belum ada jawaban esai yang dikirim.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {essayAnswers.map((answer) => (
                            <div key={answer.questionId} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.75rem', border: '1px solid #dbeafe' }}>
                              {(() => {
                                const question = questionSet.find((item) => item.id === answer.questionId);
                                return question ? (
                                  <div style={{ marginBottom: '0.6rem', paddingBottom: '0.6rem', borderBottom: '1px solid #dbeafe' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                                      {question.id > 10 ? `Esai ${question.id - 10}` : `Soal ${question.id}`} · {question.cognitiveLevel} · {question.category}
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, color: 'var(--slate-700)' }}>{question.question}</div>
                                    {question.context && (
                                      <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.35rem', lineHeight: 1.55, color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                                        {question.context}
                                      </div>
                                    )}
                                    {question.comparisonTable && (
                                      <div style={{ overflowX: 'auto', marginTop: '0.4rem' }}>
                                        <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                          <thead>
                                            <tr>
                                              {question.comparisonTable.headers.map((header) => (
                                                <th key={header} style={{ textAlign: 'left', padding: '0.35rem', border: '1px solid #dbeafe' }}>{header}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {question.comparisonTable.rows.map((row, rowIndex) => (
                                              <tr key={`${row[0]}-${rowIndex}`}>
                                                {row.map((cell, cellIndex) => (
                                                  <td key={`${rowIndex}-${cellIndex}`} style={{ padding: '0.35rem', border: '1px solid #dbeafe' }}>{cell}</td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                    {question.answerGuide && (
                                      <div style={{ marginTop: '0.5rem', color: 'var(--slate-700)', fontSize: '0.85rem' }}>
                                        <strong>Pedoman jawaban:</strong> {question.answerGuide}
                                      </div>
                                    )}
                                    {question.rubric && (
                                      <div style={{ marginTop: '0.5rem', color: 'var(--slate-700)', fontSize: '0.85rem' }}>
                                        <strong>Rubrik penilaian (maks. {question.rubric.reduce((sum, criterion) => sum + criterion.points, 0)} poin):</strong>
                                        <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                                          {question.rubric.map((criterion) => (
                                            <li key={criterion.criterion}>{criterion.criterion}: {criterion.points} poin</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                                    Esai {answer.questionId - 10} · versi {submission.questionVersion ?? 'v1'}
                                  </div>
                                );
                              })()}
                              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--slate-700)' }}>
                                {answer.essayText || 'Tidak ada isi jawaban.'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                        <CheckCircle2 size={16} />
                        Nilai & Catatan Guru
                      </div>

                      {supportsCurrentRubric ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {[11, 12].map((questionId) => {
                            const question = questionSet.find((item) => item.id === questionId);
                            if (!question || question.type !== 'essay' || !question.rubric) return null;
                            const assessment = questionId === 11
                              ? submission.essay1Assessment
                              : submission.essay2Assessment;
                            return (
                              <fieldset key={questionId} style={{ border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '0.9rem' }}>
                                <legend style={{ padding: '0 0.35rem', color: 'var(--navy-900)', fontWeight: 800 }}>
                                  Esai {questionId - 10} · skor maks. 25
                                </legend>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                  {question.rubric.map((criterion) => {
                                    const scoreKey = `${questionId}:${criterion.id}`;
                                    return (
                                      <label key={criterion.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--slate-700)' }}>
                                        <span>{criterion.criterion} <strong>(maks. {criterion.points})</strong></span>
                                        <input
                                          type="number"
                                          min={0}
                                          max={criterion.points}
                                          step={1}
                                          value={draftScores[submissionKey(submission)]?.[scoreKey]
                                            ?? assessment?.rubricScores[criterion.id]?.toString()
                                            ?? ''}
                                          onChange={(event) => {
                                            const nextValue = event.target.value;
                                            const key = submissionKey(submission);
                                            setDraftScores((previous) => ({
                                              ...previous,
                                              [key]: { ...previous[key], [scoreKey]: nextValue },
                                            }));
                                          }}
                                          aria-label={`Skor ${criterion.criterion}`}
                                          style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--slate-200)', boxSizing: 'border-box' }}
                                        />
                                      </label>
                                    );
                                  })}
                                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                                    Feedback Esai {questionId - 10}
                                    <textarea
                                      rows={3}
                                      value={draftFeedback[submissionKey(submission)]?.[questionId] ?? assessment?.feedback ?? ''}
                                      onChange={(event) => {
                                        const key = submissionKey(submission);
                                        const nextValue = event.target.value;
                                        setDraftFeedback((previous) => ({
                                          ...previous,
                                          [key]: { ...previous[key], [questionId]: nextValue },
                                        }));
                                      }}
                                      placeholder={`Catatan guru untuk Esai ${questionId - 10}...`}
                                      style={{ width: '100%', resize: 'vertical', borderRadius: '8px', border: '1px solid var(--slate-200)', padding: '0.65rem', boxSizing: 'border-box' }}
                                    />
                                  </label>
                                </div>
                              </fieldset>
                            );
                          })}
                          <div style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                            Maksimum Esai 1: 25 · Esai 2: 25 · Total: 50 poin. Status: {submission.gradingStatus === 'COMPLETED' ? 'Selesai Dinilai' : 'Menunggu Penilaian Guru'}.
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleSaveReview(submission)}
                            disabled={savingSubmissionId === submissionKey(submission)}
                            className="btn btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                          >
                            <Save size={16} />
                            <span>{savingSubmissionId === submissionKey(submission) ? 'Menyimpan…' : 'Simpan Penilaian'}</span>
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--slate-600)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                          Percobaan versi lama dipertahankan sebagai data historis dan tidak dapat dinilai menggunakan rubrik v4.
                          {submission.manualEssayScore !== undefined && (
                            <div>Nilai historis: {submission.manualEssayScore}/{maximumEssayScore}. {submission.teacherNotes}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
