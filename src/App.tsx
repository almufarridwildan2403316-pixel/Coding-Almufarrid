import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { ActivePage, ExperimentId, LearningProgress, ExperimentRecord, QuizResult, QuizSubmission, StudentIdentity } from './types/chemistry';
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

const createGuestStudent = (): StudentIdentity => ({ name: 'Tamu', className: '' });
const createAccountStudent = (user: User): StudentIdentity => {
  const email = user.email ?? '';
  return {
    id: user.uid,
    email,
    name: user.displayName?.trim() || email.split('@')[0] || 'Siswa',
    className: '',
  };
};

const mergeProgressChanges = (
  initial: LearningProgress,
  remote: LearningProgress,
  local: LearningProgress,
): LearningProgress => {
  const changed = <T,>(before: T, after: T) => JSON.stringify(before) !== JSON.stringify(after);
  const mergeList = (before: string[], remoteItems: string[], localItems: string[]) => {
    if (!changed(before, localItems)) return remoteItems;
    return localItems.length === 0 ? [] : [...new Set([...remoteItems, ...localItems])];
  };
  const recordsChanged = changed(initial.worksheetRecords, local.worksheetRecords);
  const submissionsChanged = changed(initial.quizSubmissions, local.quizSubmissions);

  return {
    student: local.student,
    testedSolutions: mergeList(initial.testedSolutions, remote.testedSolutions, local.testedSolutions),
    worksheetRecords: recordsChanged
      ? Object.keys(local.worksheetRecords).length === 0
        ? {}
        : { ...remote.worksheetRecords, ...local.worksheetRecords }
      : remote.worksheetRecords,
    worksheetConclusion: changed(initial.worksheetConclusion, local.worksheetConclusion)
      ? local.worksheetConclusion
      : remote.worksheetConclusion,
    quizResult: changed(initial.quizResult, local.quizResult) ? local.quizResult : remote.quizResult,
    quizSubmissions: submissionsChanged
      ? local.quizSubmissions.length === 0
        ? []
        : [...new Map([...remote.quizSubmissions, ...local.quizSubmissions].map((item) => [item.id, item])).values()]
      : remote.quizSubmissions,
    readMaterials: mergeList(initial.readMaterials, remote.readMaterials, local.readMaterials),
  };
};

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('K01');
  const [selectedExperimentId, setSelectedExperimentId] = useState<ExperimentId>('percobaan_1');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const authUserId = useRef<string | null>(null);
  const progressLoadRef = useRef<{ userId: string; initial: LearningProgress; hasLocalChanges: boolean } | null>(null);
  const [student, setStudent] = useState<StudentIdentity | null>(
    () => isFirebaseConfigured ? null : createGuestStudent(),
  );
  const [progress, setProgress] = useState<LearningProgress>(
    () => isFirebaseConfigured ? DEFAULT_PROGRESS : getStoredProgress(createGuestStudent()),
  );
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
        const identity = createAccountStudent(nextUser);
        const initialProgress = getStoredProgress(identity);
        progressLoadRef.current = { userId: nextUser.uid, initial: initialProgress, hasLocalChanges: false };
        saveActiveStudent(identity);
        setStudent(identity);
        setProgress(initialProgress);
        setIsProgressLoading(true);
        setCanSyncProgress(false);
        setProgressLoadError('');
        setProgressSyncError('');
      } else if (accountChanged) {
        progressLoadRef.current = null;
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
    const identity = createAccountStudent(authUser);

    loadAccountProgress(identity)
      .then((accountProgress) => {
        if (!active) return;
        const pendingLoad = progressLoadRef.current;
        const resolvedProgress = pendingLoad && pendingLoad.userId === authUser.uid && pendingLoad.hasLocalChanges
          ? mergeProgressChanges(pendingLoad.initial, accountProgress, getStoredProgress(identity))
          : accountProgress;
        progressLoadRef.current = null;
        saveStoredProgress(resolvedProgress, identity);
        setProgress(resolvedProgress);
        setCanSyncProgress(true);
        setIsProgressLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        progressLoadRef.current = null;
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

  const markProgressChanged = (identity: StudentIdentity) => {
    const pendingLoad = progressLoadRef.current;
    if (pendingLoad && pendingLoad.userId === identity.id) pendingLoad.hasLocalChanges = true;
  };

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
    if (!authUser || !firebaseAuth) {
      setStudent(null);
      setProgress(DEFAULT_PROGRESS);
      setCanSyncProgress(false);
      return;
    }

    try {
      await signOut(firebaseAuth);
      setActivePage('beranda');
    } catch (error) {
      setProgressSyncError(
        error instanceof Error ? `Tidak dapat keluar dari akun: ${error.message}` : 'Tidak dapat keluar dari akun.',
      );
    }
  };

  const handleContinueAsGuest = () => {
    const guest = createGuestStudent();
    const guestProgress = getStoredProgress(guest);
    saveActiveStudent(guest);
    saveStoredProgress(guestProgress, guest);
    setStudent(guest);
    setProgress(guestProgress);
    setCanSyncProgress(false);
    setProgressLoadError('');
    setProgressSyncError('');
    setActivePage('beranda');
  };

  const handleSaveExperimentRecord = (record: ExperimentRecord) => {
    if (!student) return;
    if (record.sampleType !== 'mystery') {
      markSolutionTested(
        record.experimentId ? `${record.experimentId}:${record.solutionId}` : record.solutionId,
        student,
      );
    }
    const updated = saveWorksheetRecord({ ...record, studentName: student.name, studentClass: student.className }, student);
    markProgressChanged(student);
    setProgress(updated);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    if (!student) return;
    const updated = saveQuizResult({ ...result, studentName: student.name, studentClass: student.className }, student);
    markProgressChanged(student);
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
    markProgressChanged(student);
    setProgress(updated);
  };

  const handleSaveTeacherReview = (submissionId: string, updates: Partial<QuizSubmission>) => {
    if (!student) return;
    const updated = updateQuizSubmission(submissionId, updates, student);
    markProgressChanged(student);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (!student) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pengujian dan kuis? Progres akan dimulai ulang dari awal.')) {
      const reset = resetAllProgress(student);
      markProgressChanged(student);
      setProgress(reset);
      alert('Progres belajar telah berhasil diatur ulang.');
    }
  };

  const handleOpenLabWithSample = (sampleId: string, experimentId: ExperimentId) => {
    setSelectedSampleId(sampleId);
    setSelectedExperimentId(experimentId);
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAuthLoading) {
    return <main className="auth-loading" role="status">Memeriksa sesi akun…</main>;
  }

  if (isPasswordRecovery) {
    return (
      <Login
        isPasswordRecovery
        onPasswordUpdated={() => setIsPasswordRecovery(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  if (!authUser && !student) {
    return (
      <Login
        isPasswordRecovery={false}
        onPasswordUpdated={() => setIsPasswordRecovery(false)}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  if (!student) {
    return <main className="auth-loading" role="status">Memuat progres belajar akun…</main>;
  }

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        progress={progress}
        student={student}
        onLogout={handleLogout}
      />
      <div className="app-content">
        {(progressLoadError || progressSyncError) && (
          <div className="progress-sync-warning" role="alert">
            {progressLoadError || progressSyncError}
          </div>
        )}
        {isProgressLoading && (
          <div className="progress-sync-status" role="status" aria-live="polite">
            Progres akun sedang disinkronkan. Anda tetap dapat menggunakan aplikasi.
          </div>
        )}
        <main className="app-main">
        {activePage === 'beranda' && (
          <Beranda setActivePage={setActivePage} />
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
            initialExperimentId={selectedExperimentId}
            progress={progress} 
            onSaveRecord={handleSaveExperimentRecord} 
            setActivePage={setActivePage}
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

        {activePage !== 'beranda' && (
          <Footer
            setActivePage={setActivePage}
            onResetProgress={handleResetProgress}
          />
        )}
      </div>
    </div>
  );
}

export default App;
