import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { ActivePage, ExperimentId, LearningProgress, ExperimentRecord, HomePromptResponse, QuizResult, QuizSubmission, StudentIdentity } from './types/chemistry';
import { 
  clearActiveStudent,
  getActiveStudent,
  DEFAULT_PROGRESS,
  getStoredProgress, 
  loadAccountProgress,
  saveWorksheetRecord, 
  saveWorksheetConclusion,
  saveHomePromptResponse,
  markSolutionTested, 
  saveQuizResult, 
  saveAccountQuizAttempt,
  setQuizSubmissionAttemptNumber,
  saveActiveStudent,
  saveAccountProgress,
  saveStoredProgress,
  updateAccountQuizAttempt,
  subscribeTeacherQuizAttempts,
  deleteAccountQuizAttempts,
  resetAllProgress,
  getPendingProgressSync,
  markPendingProgressSync,
  clearPendingProgressSync
} from './utils/storage';
import { firebaseAuth, firebaseProjectId, isFirebaseConfigured, loadAccountRole } from './utils/firebase';
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
    homePromptResponse: changed(initial.homePromptResponse, local.homePromptResponse)
      ? local.homePromptResponse ?? null
      : remote.homePromptResponse ?? null,
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
  const skipNextAccountSyncRef = useRef<{ userId: string; progress: LearningProgress } | null>(null);
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
  const [progressSyncStatus, setProgressSyncStatus] = useState<'idle' | 'pending' | 'error' | 'sent'>('idle');
  const [teacherHistory, setTeacherHistory] = useState<{
    userId: string;
    attempts: QuizSubmission[];
    error: string;
  } | null>(null);
  const [roleProfileWarning, setRoleProfileWarning] = useState('');
  const [canSyncProgress, setCanSyncProgress] = useState(false);
  const isTeacher = student?.role === 'teacher';
  const isLoadedTeacherHistory = Boolean(teacherHistory && teacherHistory.userId === authUser?.uid);
  const teacherQuizAttempts = isLoadedTeacherHistory ? teacherHistory?.attempts ?? [] : [];
  const teacherHistoryLoading = Boolean(isTeacher && authUser && teacherHistory?.userId !== authUser.uid);
  const teacherHistoryError = isLoadedTeacherHistory ? teacherHistory?.error ?? '' : '';
  const renderedPage = activePage === 'guru' && !isTeacher ? 'beranda' : activePage;

  const handleSetActivePage = (page: ActivePage) => {
    if (page === 'guru' && !isTeacher) return;
    setActivePage(page);
  };

  useEffect(() => {
    if (!firebaseAuth) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      const nextUserId = nextUser?.uid ?? null;
      console.info('[KimiaLab Auth] Perubahan status autentikasi', {
        signedIn: Boolean(nextUser),
        email: nextUser?.email ?? null,
        uid: nextUserId,
        projectId: firebaseProjectId,
      });
      const accountChanged = authUserId.current !== nextUserId;
      authUserId.current = nextUserId;

      if (accountChanged) {
        setAuthUser(nextUser);
        setTeacherHistory(null);
        setRoleProfileWarning('');
      }
      setIsAuthLoading(false);

      if (accountChanged && nextUser) {
        const identity = createAccountStudent(nextUser);
        const initialProgress = getStoredProgress(identity);
        const pendingSync = getPendingProgressSync(identity);
        progressLoadRef.current = {
          userId: nextUser.uid,
          initial: initialProgress,
          hasLocalChanges: Boolean(pendingSync),
        };
        saveActiveStudent(identity);
        setStudent(identity);
        setProgress(pendingSync?.pendingProgress ?? initialProgress);
        setIsProgressLoading(true);
        setCanSyncProgress(false);
        setProgressLoadError('');
        setProgressSyncError('');
        setProgressSyncStatus(pendingSync ? pendingSync.syncStatus : 'idle');
      } else if (!nextUser) {
        progressLoadRef.current = null;
        const activeStudent = getActiveStudent();
        if (activeStudent && !activeStudent.id) {
          const guestProgress = getStoredProgress(activeStudent);
          setStudent(activeStudent);
          setProgress(guestProgress);
        } else {
          setStudent(null);
          setProgress(DEFAULT_PROGRESS);
        }
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

    const loadUserData = async () => {
      try {
        const account = await loadAccountRole(authUser.uid);
        if (!active) return;
        setRoleProfileWarning(
          account.profileExists
            ? ''
            : `Profil Firestore users/${authUser.uid} belum ditemukan. Akses guru tidak diberikan. Jika akun ini perlu akses guru, administrator harus membuat dokumen tersebut dan mengisi field role dengan string "teacher".`,
        );
        if (account.profileExists && account.roleValue !== 'teacher') {
          console.warn('[KimiaLab Auth] Profil ditemukan, tetapi role bukan "teacher"', {
            uid: authUser.uid,
            projectId: firebaseProjectId,
            documentPath: `users/${authUser.uid}`,
            roleValue: typeof account.roleValue === 'string'
              ? account.roleValue
              : account.roleValue == null
                ? null
                : `[${typeof account.roleValue}]`,
          });
        }
        identity.role = account.role;
        setStudent(identity);
      } catch (error: unknown) {
        if (!active) return;
        identity.role = 'student';
        setStudent(identity);
        const errorCode = typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : null;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[KimiaLab Auth] Role gagal diverifikasi; akses guru dinonaktifkan', {
          email: authUser.email,
          uid: authUser.uid,
          projectId: firebaseProjectId,
          documentPath: `users/${authUser.uid}`,
          errorCode,
          errorMessage,
        });
        setRoleProfileWarning(
          `Role akun tidak dapat diverifikasi dari Firestore; akses guru dinonaktifkan: ${errorMessage}`,
        );
      }

      try {
        const accountProgress = await loadAccountProgress(identity);
        if (!active) return;
        const pendingLoad = progressLoadRef.current;
        const pendingSync = getPendingProgressSync(identity);
        const resolvedProgress = pendingLoad && pendingLoad.userId === authUser.uid && pendingLoad.hasLocalChanges
          ? mergeProgressChanges(
            pendingLoad.initial,
            accountProgress,
            pendingSync?.pendingProgress ?? getStoredProgress(identity),
          )
          : accountProgress;
        progressLoadRef.current = null;
        saveStoredProgress(resolvedProgress, identity);
        setProgress(resolvedProgress);
        setCanSyncProgress(true);
        setIsProgressLoading(false);
      } catch (error: unknown) {
        if (!active) return;
        progressLoadRef.current = null;
        setProgressLoadError(
          error instanceof Error
            ? `Data akun/progres belum dapat dimuat: ${error.message}`
            : 'Data akun/progres belum dapat dimuat.',
        );
        setCanSyncProgress(true);
        setIsProgressLoading(false);
      }
    };

    void loadUserData();

    return () => {
      active = false;
    };
  }, [authUser]);

  useEffect(() => {
    if (!isTeacher || !authUser) {
      return;
    }

    let active = true;
    let stopListening: (() => void) | null = null;
    const handleLoadError = (error: unknown) => {
      if (!active) return;
      setTeacherHistory({
        userId: authUser.uid,
        attempts: [],
        error: error instanceof Error
          ? `Riwayat kuis siswa gagal dimuat: ${error.message}`
          : 'Riwayat kuis siswa gagal dimuat.',
      });
    };

    void subscribeTeacherQuizAttempts(
      (attempts) => {
        if (active) setTeacherHistory({ userId: authUser.uid, attempts, error: '' });
      },
      handleLoadError,
    )
      .then((unsubscribe) => {
        if (active) stopListening = unsubscribe;
        else unsubscribe();
      })
      .catch(handleLoadError);

    return () => {
      active = false;
      stopListening?.();
    };
  }, [authUser, isTeacher]);

  const markProgressChanged = (identity: StudentIdentity) => {
    const pendingLoad = progressLoadRef.current;
    if (pendingLoad && pendingLoad.userId === identity.id) pendingLoad.hasLocalChanges = true;
    if (identity.id) {
      const latest = getStoredProgress(identity);
      markPendingProgressSync(latest, identity);
      setProgressSyncStatus('pending');
    }
  };

  const syncProgressNow = useCallback(async (
    ownerId: string,
    identity: StudentIdentity,
    snapshot: LearningProgress,
  ): Promise<boolean> => {
    if (!authUserId.current || authUserId.current !== ownerId) return false;
    try {
      await saveAccountProgress(snapshot, identity);
      if (authUserId.current !== ownerId) return false;
      clearPendingProgressSync(ownerId);
      setProgressSyncStatus('sent');
      setProgressSyncError('');
      return true;
    } catch (error: unknown) {
      if (authUserId.current !== ownerId) return false;
      markPendingProgressSync(snapshot, identity, 'error');
      setProgressSyncStatus('error');
      setProgressSyncError(
        error instanceof Error
          ? `Progres tersimpan di perangkat, tetapi gagal disinkronkan: ${error.message}`
          : 'Progres tersimpan di perangkat, tetapi gagal disinkronkan ke Firebase.',
      );
      return false;
    }
  }, []);

  useEffect(() => {
    if (!authUser || !student || !canSyncProgress) return;

    saveStoredProgress(progress, student);
    const alreadySynced = skipNextAccountSyncRef.current;
    if (alreadySynced) {
      skipNextAccountSyncRef.current = null;
      if (alreadySynced.userId === authUser.uid && JSON.stringify(alreadySynced.progress) === JSON.stringify(progress)) {
        return;
      }
    }

    const pendingSync = getPendingProgressSync(student);
    if (!pendingSync) return;

    const timeoutId = window.setTimeout(() => {
      void syncProgressNow(authUser.uid, student, pendingSync.pendingProgress);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [authUser, canSyncProgress, progress, student, syncProgressNow]);

  const handleRetryProgressSync = async () => {
    if (!authUser || !student || !student.id || authUserId.current !== student.id) return;
    const latestProgress = getStoredProgress(student);
    markPendingProgressSync(latestProgress, student, 'pending');
    setProgressSyncStatus('pending');
    setProgressSyncError('');
    await syncProgressNow(student.id, student, latestProgress);
  };

  useEffect(() => {
    if (!authUser || !student) return;
    const handleOnline = () => {
      if (!student.id || authUserId.current !== student.id) return;
      const pendingSync = getPendingProgressSync(student);
      if (!pendingSync) return;
      void syncProgressNow(student.id, student, pendingSync.pendingProgress);
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [authUser, student, syncProgressNow]);

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

  const handleSaveQuizResult = async (result: QuizResult): Promise<void> => {
    if (!student) throw new Error('Identitas siswa belum siap. Jawaban belum dikirim.');

    let updated = saveQuizResult({ ...result, studentName: student.name, studentClass: student.className }, student);
    const storedProgress = getStoredProgress(student);
    const nextProgress = storedProgress.quizResult?.id === result.id ? storedProgress : updated;
    skipNextAccountSyncRef.current = authUser && JSON.stringify(nextProgress) === JSON.stringify(updated)
      ? { userId: authUser.uid, progress: nextProgress }
      : null;
    markProgressChanged(student);
    setProgress(nextProgress);

    if (authUser) {
      void (async () => {
        const ownerId = authUser.uid;
        try {
          const submission = nextProgress.quizSubmissions.find((item) => item.id === result.id);
          if (!submission) throw new Error('Data percobaan kuis tidak ditemukan setelah disimpan.');
          const savedAttempt = await saveAccountQuizAttempt(submission, student);
          if (authUserId.current !== ownerId) return;
          if (savedAttempt.attemptNumber && savedAttempt.attemptNumber !== submission.attemptNumber) {
            updated = setQuizSubmissionAttemptNumber(savedAttempt.id, savedAttempt.attemptNumber, student);
            setProgress(updated);
          }
          await saveAccountProgress(updated, student);
          if (authUserId.current !== ownerId) return;
          clearPendingProgressSync(ownerId);
          setProgressSyncStatus('sent');
          setProgressSyncError('');
        } catch (error) {
          if (authUserId.current !== ownerId) return;
          const message = error instanceof Error ? error.message : 'Kesalahan Firebase tidak diketahui.';
          markPendingProgressSync(getStoredProgress(student), student, 'error');
          setProgressSyncStatus('error');
          setProgressSyncError(`Hasil kuis tersimpan di perangkat, tetapi belum sinkron ke akun: ${message}`);
        }
      })();
    }
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

  const handleSaveHomePromptResponse = (response: HomePromptResponse) => {
    if (!student) return;
    const updated = saveHomePromptResponse(response, student);
    markProgressChanged(student);
    setProgress(updated);
  };

  const handleSaveTeacherReview = async (
    submission: QuizSubmission,
    updates: Pick<QuizSubmission, 'manualEssayScore' | 'teacherNotes'>,
  ): Promise<void> => {
    if (!authUser || !isTeacher || authUserId.current !== authUser.uid) {
      throw new Error('Hanya guru yang sah dapat menyimpan nilai dan catatan.');
    }
    await updateAccountQuizAttempt(submission, updates);
    setTeacherHistory((current) => current?.userId === authUser.uid
      ? {
        ...current,
        attempts: current.attempts.map((item) =>
          item.id === submission.id && item.userId === submission.userId ? { ...item, ...updates } : item,
        ),
      }
      : current);
  };

  const handleResetProgress = async () => {
    if (!student) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh progres belajar, termasuk jawaban pemantik? Progres akan dimulai ulang dari awal.')) {
      const emptyProgress = { ...DEFAULT_PROGRESS, student };
      if (authUser) {
        try {
          await saveAccountProgress(emptyProgress, student);
          await deleteAccountQuizAttempts(student);
        } catch (error) {
          setProgressSyncError(error instanceof Error
            ? `Riwayat kuis belum dapat dihapus: ${error.message}`
            : 'Riwayat kuis belum dapat dihapus dari akun.');
          window.alert('Progres tidak direset karena riwayat akun gagal dihapus.');
          return;
        }
      }
      const reset = resetAllProgress(student);
      if (authUser) clearPendingProgressSync(authUser.uid);
      if (authUser) skipNextAccountSyncRef.current = { userId: authUser.uid, progress: reset };
      setProgress(reset);
      setProgressSyncError('');
      setProgressSyncStatus('sent');
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
        activePage={renderedPage}
        setActivePage={handleSetActivePage}
        progress={progress}
        student={student}
        onLogout={handleLogout}
      />
      <div className="app-content">
        {(roleProfileWarning || progressLoadError || progressSyncError) && (
          <div className="progress-sync-warning" role="alert">
            {roleProfileWarning || progressLoadError || progressSyncError}
          </div>
        )}
        {authUser && (progressSyncStatus === 'pending' || progressSyncStatus === 'error') && (
          <div className="progress-sync-status" role="status" aria-live="polite">
            Tersimpan di perangkat, menunggu sinkronisasi.
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: '0.75rem' }}
              onClick={() => void handleRetryProgressSync()}
            >
              Coba Kirim Lagi (Retry)
            </button>
          </div>
        )}
        {isProgressLoading && (
          <div className="progress-sync-status" role="status" aria-live="polite">
            Progres akun sedang disinkronkan. Anda tetap dapat menggunakan aplikasi.
          </div>
        )}
        <main className="app-main">
        {renderedPage === 'beranda' && (
          <Beranda
            key={`${student.id ?? `${student.name}:${student.className}`}:${progress.homePromptResponse?.submittedAt ?? 'unsaved'}`}
            progress={progress}
            setActivePage={handleSetActivePage}
            onSaveHomePromptResponse={handleSaveHomePromptResponse}
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
            key={student.id ?? `${student.name}:${student.className}`}
            onSaveQuizResult={handleSaveQuizResult} 
            savedResult={progress.quizResult} 
            student={student}
          />
        )}

        {renderedPage === 'guru' && isTeacher && (
          <TeacherDashboard
            submissions={teacherQuizAttempts}
            isLoading={teacherHistoryLoading}
            loadError={teacherHistoryError}
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

        {renderedPage !== 'beranda' && (
          <Footer
            setActivePage={handleSetActivePage}
            isTeacher={isTeacher}
            onResetProgress={handleResetProgress}
          />
        )}
      </div>
    </div>
  );
}

export default App;
