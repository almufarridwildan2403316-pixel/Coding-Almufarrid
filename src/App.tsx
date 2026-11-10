import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ActivePage, LearningProgress, ExperimentRecord, QuizResult, QuizSubmission, StudentIdentity } from './types/chemistry';
import { 
  clearActiveStudent,
  DEFAULT_PROGRESS,
  getStoredProgress, 
  loadAccountProgress,
  saveWorksheetRecord, 
  saveWorksheetConclusion,
  markSolutionTested, 
  saveQuizResult, 
  saveActiveStudent,
  saveAccountProgress,
  saveStoredProgress,
  updateQuizSubmission,
  resetAllProgress 
} from './utils/storage';
import { isSupabaseConfigured, supabase } from './utils/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Beranda } from './components/Beranda';
import { Materi } from './components/Materi';
import { LabVirtual } from './components/LabVirtual';
import { LembarKerja } from './components/LembarKerja';
import { Evaluasi } from './components/Evaluasi';
import { TeacherDashboard } from './components/TeacherDashboard';
import { HasilBelajar } from './components/HasilBelajar';
import { Login } from './components/Login';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('S01');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const authUserId = useRef<string | null>(null);
  const [student, setStudent] = useState<StudentIdentity | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(DEFAULT_PROGRESS);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [progressLoadError, setProgressLoadError] = useState('');
  const [progressSyncError, setProgressSyncError] = useState('');
  const [canSyncProgress, setCanSyncProgress] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      const nextUserId = nextUser?.id ?? null;
      const accountChanged = authUserId.current !== nextUserId;
      authUserId.current = nextUserId;

      if (accountChanged) setAuthUser(nextUser);
      setIsAuthLoading(false);

      if (accountChanged && nextUser) {
        setIsProgressLoading(true);
        setCanSyncProgress(false);
        setProgressLoadError('');
        setProgressSyncError('');
      } else if (accountChanged) {
        setStudent(null);
        setProgress(DEFAULT_PROGRESS);
        setIsProgressLoading(false);
        setProgressLoadError('');
        setCanSyncProgress(false);
        clearActiveStudent();
      }

      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setIsPasswordRecovery(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    let active = true;
    const email = authUser.email ?? '';
    const metadata = authUser.user_metadata;
    const profileName = [metadata.display_name, metadata.full_name, metadata.name]
      .find((value): value is string => typeof value === 'string' && Boolean(value.trim()));
    const identity: StudentIdentity = {
      id: authUser.id,
      email,
      name: profileName?.trim() || email.split('@')[0] || 'Siswa',
      className: typeof metadata.class_name === 'string' ? metadata.class_name : '',
    };

    loadAccountProgress(identity)
      .then((accountProgress) => {
        if (!active) return;
        saveActiveStudent(identity);
        saveStoredProgress(accountProgress, identity);
        setStudent(identity);
        setProgress(accountProgress);
        setCanSyncProgress(true);
        setIsProgressLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStudent(identity);
        setProgress(getStoredProgress(identity));
        setProgressLoadError(
          error instanceof Error
            ? `Progres akun belum dapat dimuat dari Supabase: ${error.message}`
            : 'Progres akun belum dapat dimuat dari Supabase.',
        );
        setIsProgressLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser || !student || !canSyncProgress) return;

    saveStoredProgress(progress, student);
    const timeoutId = window.setTimeout(() => {
      saveAccountProgress(progress, student)
        .then(() => setProgressSyncError(''))
        .catch((error: unknown) => {
          setProgressSyncError(
            error instanceof Error
              ? `Progres tersimpan di perangkat, tetapi gagal disinkronkan: ${error.message}`
              : 'Progres tersimpan di perangkat, tetapi gagal disinkronkan ke akun.',
          );
        });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [authUser, canSyncProgress, progress, student]);

  const handleLogout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setProgressSyncError(`Tidak dapat keluar dari akun: ${error.message}`);
    else setActivePage('beranda');
  };

  const handleSaveExperimentRecord = (record: ExperimentRecord) => {
    if (!student) return;
    // 1. Mark solution as tested
    markSolutionTested(record.solutionId, student);
    // 2. Save worksheet record
    const updated = saveWorksheetRecord({ ...record, studentName: student.name, studentClass: student.className }, student);
    setProgress(updated);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    if (!student) return;
    const updated = saveQuizResult({ ...result, studentName: student.name, studentClass: student.className }, student);
    setProgress(updated);
  };

  const handleSaveWorksheetConclusion = (text: string) => {
    if (!student) return;
    const updated = saveWorksheetConclusion({
      text,
      studentName: student.name,
      studentClass: student.className,
      submittedAt: new Date().toISOString(),
    }, student);
    setProgress(updated);
  };

  const handleSaveTeacherReview = (submissionId: string, updates: Partial<QuizSubmission>) => {
    if (!student) return;
    const updated = updateQuizSubmission(submissionId, updates, student);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (!student) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pengujian dan kuis? Progres akan dimulai ulang dari awal.')) {
      const reset = resetAllProgress(student);
      setProgress(reset);
      alert('Progres belajar telah berhasil diatur ulang.');
    }
  };

  const handleOpenLabWithSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAuthLoading) {
    return <main className="auth-loading" role="status">Memeriksa sesi akun…</main>;
  }

  if (isPasswordRecovery) {
    return <Login isPasswordRecovery onPasswordUpdated={() => setIsPasswordRecovery(false)} />;
  }

  if (!authUser) {
    return <Login isPasswordRecovery={false} onPasswordUpdated={() => setIsPasswordRecovery(false)} />;
  }

  if (!student || isProgressLoading) {
    return <main className="auth-loading" role="status">Memuat progres belajar akun…</main>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {(progressLoadError || progressSyncError) && (
        <div className="progress-sync-warning" role="alert">
          {progressLoadError || progressSyncError}
        </div>
      )}
      {/* Top Sticky Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        progress={progress} 
        student={student}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {activePage === 'beranda' && (
          <Beranda 
            setActivePage={setActivePage} 
            progress={progress} 
            onSelectSample={handleOpenLabWithSample} 
          />
        )}

        {activePage === 'materi' && (
          <Materi 
            onStartLab={() => {
              setActivePage('lab');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activePage === 'lab' && (
          <LabVirtual 
            initialSampleId={selectedSampleId} 
            progress={progress} 
            onSaveRecord={handleSaveExperimentRecord} 
            onOpenWorksheet={() => {
              setActivePage('lembar-kerja');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activePage === 'lembar-kerja' && (
          <LembarKerja 
            progress={progress} 
            setActivePage={setActivePage} 
            onOpenLabSample={handleOpenLabWithSample} 
            onSaveConclusion={handleSaveWorksheetConclusion}
          />
        )}

        {activePage === 'evaluasi' && (
          <Evaluasi 
            onSaveQuizResult={handleSaveQuizResult} 
            savedResult={progress.quizResult} 
            student={student}
          />
        )}

        {activePage === 'guru' && (
          <TeacherDashboard
            progress={progress}
            onSaveReview={handleSaveTeacherReview}
          />
        )}

        {activePage === 'hasil' && (
          <HasilBelajar 
            progress={progress} 
            setActivePage={setActivePage} 
            onResetProgress={handleResetProgress} 
          />
        )}
      </main>

      {/* Modern Footer */}
      <Footer 
        setActivePage={setActivePage} 
        onResetProgress={handleResetProgress} 
      />
    </div>
  );
}

export default App;
