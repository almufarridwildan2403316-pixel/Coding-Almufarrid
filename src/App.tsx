import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
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
import { firebaseAuth, isFirebaseConfigured } from './utils/firebase';
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
  const [isAuthLoading, setIsAuthLoading] = useState(isFirebaseConfigured);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(
    () => new URLSearchParams(window.location.search).get('mode') === 'resetPassword'
      && new URLSearchParams(window.location.search).has('oobCode'),
  );
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [progressLoadError, setProgressLoadError] = useState('');
  const [progressSyncError, setProgressSyncError] = useState('');
  const [canSyncProgress, setCanSyncProgress] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      const nextUserId = nextUser?.uid ?? null;
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

    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authUser) return;

    let active = true;
    const email = authUser.email ?? '';
    const identity: StudentIdentity = {
      id: authUser.uid,
      email,
      name: authUser.displayName?.trim() || email.split('@')[0] || 'Siswa',
      className: '',
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
            ? `Progres akun belum dapat dimuat dari Firebase: ${error.message}`
            : 'Progres akun belum dapat dimuat dari Firebase.',
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
              : 'Progres tersimpan di perangkat, tetapi gagal disinkronkan ke Firebase.',
          );
        });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [authUser, canSyncProgress, progress, student]);

  const handleLogout = async () => {
    if (!firebaseAuth) return;
    try {
      await signOut(firebaseAuth);
      setActivePage('beranda');
    } catch (error) {
      setProgressSyncError(
        error instanceof Error ? `Tidak dapat keluar dari akun: ${error.message}` : 'Tidak dapat keluar dari akun.',
      );
    }
  };

  const handleSaveExperimentRecord = (record: ExperimentRecord) => {
    if (!student) return;
    if (record.sampleType !== 'mystery') {
      markSolutionTested(record.solutionId, student);
    }
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
