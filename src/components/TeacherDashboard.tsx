import React, { useState } from 'react';
import type { LearningProgress, QuizSubmission } from '../types/chemistry';
import { BookOpenCheck, CheckCircle2, FileText, Save, UserRound } from 'lucide-react';

interface TeacherDashboardProps {
  progress: LearningProgress;
  onSaveReview: (submissionId: string, updates: Partial<QuizSubmission>) => void;
}

const formatDate = (value: string) => new Date(value).toLocaleString('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ progress, onSaveReview }) => {
  const submissions = progress.quizSubmissions ?? [];
  const [draftScores, setDraftScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(submissions.map((submission) => [submission.id, submission.manualEssayScore ?? 0]))
  );
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(submissions.map((submission) => [submission.id, submission.teacherNotes ?? '']))
  );

  const averageScore = submissions.length
    ? Math.round(submissions.reduce((total, submission) => total + submission.score, 0) / submissions.length)
    : 0;

  const totalEssayResponses = submissions.reduce((count, submission) => {
    return count + submission.answers.filter((answer) => answer.questionType === 'essay' && (answer.essayText ?? '').trim().length > 0).length;
  }, 0);

  const handleSaveReview = (submission: QuizSubmission) => {
    onSaveReview(submission.id, {
      manualEssayScore: draftScores[submission.id] ?? 0,
      teacherNotes: draftNotes[submission.id] ?? '',
    });
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

        {submissions.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-600)' }}>
            Belum ada hasil kuis siswa yang dikirim. Siswa akan muncul di dashboard ini setelah menyelesaikan evaluasi.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {submissions.map((submission) => {
              const essayAnswers = submission.answers.filter(
                (answer) => answer.questionType === 'essay' && (answer.essayText ?? '').trim().length > 0
              );

              return (
                <div key={submission.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#ecfeff', color: '#0f766e' }}>
                        <UserRound size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>{submission.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Kelas {submission.studentClass} · {formatDate(submission.submittedAt)}</div>
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
                        <FileText size={16} />
                        Jawaban Esai Siswa
                      </div>

                      {essayAnswers.length === 0 ? (
                        <div style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Belum ada jawaban esai yang dikirim.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {essayAnswers.map((answer) => (
                            <div key={answer.questionId} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '0.75rem', border: '1px solid #dbeafe' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '0.35rem' }}>
                                Soal Esai #{answer.questionId}
                              </div>
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
                          Nilai Esai Manual
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={draftScores[submission.id] ?? submission.manualEssayScore ?? 0}
                            onChange={(event) => {
                              const nextValue = Number(event.target.value) || 0;
                              setDraftScores((prev) => ({ ...prev, [submission.id]: nextValue }));
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
                            value={draftNotes[submission.id] ?? submission.teacherNotes ?? ''}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setDraftNotes((prev) => ({ ...prev, [submission.id]: nextValue }));
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
                          onClick={() => handleSaveReview(submission)}
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.3rem' }}
                        >
                          <Save size={16} />
                          <span>Simpan Review</span>
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
