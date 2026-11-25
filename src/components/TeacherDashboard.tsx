import React, { useState } from 'react';
import type { QuizSubmission } from '../types/chemistry';
import { BookOpenCheck, CheckCircle2, FileText, Save, UserRound } from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_QUESTIONS_V2_ESSAYS, QUIZ_QUESTION_VERSION } from '../data/evaluationQuiz';

interface TeacherDashboardProps {
  submissions: QuizSubmission[];
  isLoading: boolean;
  loadError: string;
  onSaveReview: (
    submission: QuizSubmission,
    updates: Pick<QuizSubmission, 'manualEssayScore' | 'teacherNotes'>,
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
  const [draftScores, setDraftScores] = useState<Record<string, number>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [savingSubmissionId, setSavingSubmissionId] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');

  const averageScore = submissions.length
    ? Math.round(submissions.reduce((total, submission) => total + submission.score, 0) / submissions.length)
    : 0;

  const totalEssayResponses = submissions.reduce((count, submission) => {
    return count + submission.answers.filter((answer) => answer.questionType === 'essay' && (answer.essayText ?? '').trim().length > 0).length;
  }, 0);

  const handleSaveReview = async (submission: QuizSubmission) => {
    const key = submissionKey(submission);
    setSavingSubmissionId(key);
    setReviewMessage('');
    try {
      await onSaveReview(submission, {
        manualEssayScore: draftScores[key] ?? 0,
        teacherNotes: draftNotes[key] ?? '',
      });
      setReviewMessage(`Review percobaan #${submission.attemptNumber ?? '—'} berhasil disimpan.`);
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
            <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Rata-Rata Skor</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal-700)' }}>{averageScore}</div>
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
              const questionSet = submission.questionVersion === QUIZ_QUESTION_VERSION
                ? QUIZ_QUESTIONS
                : submission.questionVersion === 'v2'
                  ? [...QUIZ_QUESTIONS.filter((question) => question.type === 'multiple-choice'), ...QUIZ_QUESTIONS_V2_ESSAYS]
                  : [];
              const maximumEssayScore = submission.questionVersion === 'v2' || submission.questionVersion === QUIZ_QUESTION_VERSION
                ? 40
                : 100;

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
                        Skor Pilihan Ganda: {submission.score}/100
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
                                        <strong>Rubrik penilaian (maks. 20 poin):</strong>
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

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                          Nilai Uraian Manual (0–{maximumEssayScore})
                          <input
                            type="number"
                            min={0}
                            max={maximumEssayScore}
                            value={draftScores[submissionKey(submission)] ?? submission.manualEssayScore ?? 0}
                            onChange={(event) => {
                              const nextValue = Number(event.target.value) || 0;
                              setDraftScores((prev) => ({ ...prev, [submissionKey(submission)]: nextValue }));
                            }}
                            style={{
                              width: '100%',
                              padding: '0.78rem 0.9rem',
                              borderRadius: '10px',
                              border: '1px solid var(--slate-200)',
                              fontSize: '0.95rem',
                              color: 'var(--navy-900)',
                              backgroundColor: '#ffffff',
                              boxSizing: 'border-box'
                            }}
                          />
                        </label>

                        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                          Catatan Guru
                          <textarea
                            rows={4}
                            value={draftNotes[submissionKey(submission)] ?? submission.teacherNotes ?? ''}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setDraftNotes((prev) => ({ ...prev, [submissionKey(submission)]: nextValue }));
                            }}
                            placeholder="Tambahkan catatan atau penjelasan evaluasi..."
                            style={{
                              width: '100%',
                              resize: 'vertical',
                              borderRadius: '10px',
                              border: '1px solid var(--slate-200)',
                              padding: '0.8rem 0.9rem',
                              fontSize: '0.95rem',
                              lineHeight: 1.5,
                              color: 'var(--navy-900)',
                              backgroundColor: '#ffffff',
                              boxSizing: 'border-box'
                            }}
                          />
                        </label>

                        <button
                          onClick={() => void handleSaveReview(submission)}
                          disabled={savingSubmissionId === submissionKey(submission)}
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.3rem' }}
                        >
                          <Save size={16} />
                          <span>{savingSubmissionId === submissionKey(submission) ? 'Menyimpan…' : 'Simpan Review'}</span>
                        </button>
                      </div>
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
