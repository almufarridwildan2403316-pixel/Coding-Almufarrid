import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import { firebaseAuth, firestore, isFirebaseConfigured } from './utils/firebase';
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

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('S01');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const authUserId = useRef<string | null>(null);
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
  const [roleProfileWarning, setRoleProfileWarning] = useState('');
  const [canSyncProgress, setCanSyncProgress] = useState(false);
  const isTeacher = student?.role === 'teacher';
  const renderedPage = activePage === 'guru' && !isTeacher ? 'beranda' : activePage;

  const handleSetActivePage = (page: ActivePage) => {
    if (page === 'guru' && !isTeacher) return;
    setActivePage(page);
  };

  useEffect(() => {
    if (!firebaseAuth) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      const nextUserId = nextUser?.uid ?? null;
      const accountChanged = authUserId.current !== nextUserId;
      authUserId.current = nextUserId;

      if (accountChanged) {
        setAuthUser(nextUser);
        setRoleProfileWarning('');
      }
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
      role: 'student',
    };

    const loadUserData = async () => {
      try {
        if (!firestore) throw new Error('Firestore belum dikonfigurasi.');
        const userSnapshot = await getDoc(doc(firestore, 'users', authUser.uid));
        if (!active) return;
        setRoleProfileWarning(
          userSnapshot.exists()
            ? ''
            : `Profil Firestore users/${authUser.uid} belum ada. Jika akun ini perlu akses guru, buat dokumen tersebut dan isi field role dengan string "teacher".`,
        );
        identity.role = userSnapshot.data()?.role === 'teacher' ? 'teacher' : 'student';
        const accountProgress = await loadAccountProgress(identity);
        if (!active) return;
        saveActiveStudent(identity);
        saveStoredProgress(accountProgress, identity);
        setStudent(identity);
        setProgress(accountProgress);
        setCanSyncProgress(true);
        setIsProgressLoading(false);
      } catch (error: unknown) {
        if (!active) return;
        setStudent(identity);
        setProgress(getStoredProgress(identity));
        setProgressLoadError(
          error instanceof Error
            ? `Data akun/progres belum dapat dimuat: ${error.message}`
            : 'Data akun/progres belum dapat dimuat.',
        );
        setIsProgressLoading(false);
      }
    };

    void loadUserData();

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

  if (!student || isProgressLoading) {
    return <main className="auth-loading" role="status">Memuat progres belajar akun…</main>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {(roleProfileWarning || progressLoadError || progressSyncError) && (
        <div className="progress-sync-warning" role="alert">
          {roleProfileWarning || progressLoadError || progressSyncError}
        </div>
      )}
      {/* Top Sticky Navigation */}
      <Navbar 
        activePage={renderedPage}
        setActivePage={handleSetActivePage}
        progress={progress} 
        student={student}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {renderedPage === 'beranda' && (
          <Beranda 
            setActivePage={setActivePage} 
            progress={progress} 
            onSelectSample={handleOpenLabWithSample} 
          />
        )}

        {renderedPage === 'materi' && (
          <Materi 
            onStartLab={() => {
              setActivePage('lab');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {renderedPage === 'lab' && (
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

        {renderedPage === 'lembar-kerja' && (
          <LembarKerja 
            progress={progress} 
            setActivePage={setActivePage} 
            onOpenLabSample={handleOpenLabWithSample} 
            onSaveConclusion={handleSaveWorksheetConclusion}
          />
        )}

        {renderedPage === 'evaluasi' && (
          <Evaluasi 
            onSaveQuizResult={handleSaveQuizResult} 
            savedResult={progress.quizResult} 
            student={student}
          />
        )}

        {renderedPage === 'guru' && isTeacher && (
          <TeacherDashboard
            progress={progress}
            onSaveReview={handleSaveTeacherReview}
          />
        )}

        {renderedPage === 'hasil' && (
          <HasilBelajar 
            progress={progress} 
            setActivePage={setActivePage} 
            onResetProgress={handleResetProgress} 
          />
        )}
      </main>

      {/* Modern Footer */}
      <Footer 
        setActivePage={handleSetActivePage}
        isTeacher={isTeacher}
        onResetProgress={handleResetProgress} 
      />
    </div>
  );
}

export default App;
