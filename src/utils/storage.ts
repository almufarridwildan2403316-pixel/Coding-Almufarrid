import type { LearningProgress, ExperimentRecord, HomePromptResponse, QuizAnswer, QuizDraft, QuizResult, QuizSubmission, StudentIdentity, WorksheetConclusion } from '../types/chemistry';
import {
  collection,
  collectionGroup,
  doc,
  type Firestore,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { firebaseAuth, firestore, isVerifiedTeacherUid } from './firebase';
import { getExperimentRecordKey } from './experimentRecords';

const STORAGE_KEY = 'kimialab_learning_progress_v2';
const ACTIVE_STUDENT_KEY = 'kimialab_active_student_v1';
const PENDING_SYNC_STORAGE_KEY = 'kimialab_pending_sync_v1';
const QUIZ_DRAFT_STORAGE_KEY = 'kimialab_quiz_draft_v1';
export const EVALUATION_QUIZ_ID = 'electrolyte-evaluation-v1';
const QUIZ_ATTEMPTS_COLLECTION = 'quizAttempts';
const QUIZ_ATTEMPT_COUNTERS_COLLECTION = 'quizAttemptCounters';

export const DEFAULT_PROGRESS: LearningProgress = {
  student: null,
  testedSolutions: [],
  worksheetRecords: {},
  worksheetConclusion: null,
  homePromptResponse: null,
  quizResult: null,
  quizSubmissions: [],
  readMaterials: [],
};

const getGuestStorageScope = (student: StudentIdentity): string => {
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID');
  return encodeURIComponent(`${normalize(student.name)}|${normalize(student.className)}`);
};

const getStudentStorageScope = (student: StudentIdentity): string =>
  student.id ? `account:${encodeURIComponent(student.id)}` : `guest:${getGuestStorageScope(student)}`;

const getProgressKey = (student: StudentIdentity): string =>
  student.id
    ? `${STORAGE_KEY}:account:${encodeURIComponent(student.id)}`
    : `${STORAGE_KEY}:${getGuestStorageScope(student)}`;

const getQuizDraftKey = (student: StudentIdentity, quizId: string): string =>
  `${QUIZ_DRAFT_STORAGE_KEY}:${getStudentStorageScope(student)}:${encodeURIComponent(quizId)}`;

const getLegacyQuizDraftKey = (student: StudentIdentity): string =>
  `${QUIZ_DRAFT_STORAGE_KEY}:${getStudentStorageScope(student)}`;

const getQuizUserId = (student: StudentIdentity): string => student.id ?? 'guest';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isQuizAnswer = (value: unknown): value is QuizAnswer => {
  if (
    !isRecord(value)
    || typeof value.questionId !== 'number'
    || !Number.isSafeInteger(value.questionId)
    || value.questionId < 1
  ) return false;
  if (value.questionType === 'multiple-choice') {
    return typeof value.selectedOption === 'number'
      && Number.isSafeInteger(value.selectedOption)
      && value.selectedOption >= 0;
  }
  return value.questionType === 'essay' && typeof value.essayText === 'string';
};

const isQuizSubmission = (value: unknown): value is QuizSubmission => {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.studentName === 'string'
    && typeof value.studentClass === 'string'
    && typeof value.submittedAt === 'string'
    && Number.isFinite(Date.parse(value.submittedAt))
    && Number.isFinite(value.score)
    && Number.isFinite(value.totalQuestions)
    && Number.isFinite(value.correctAnswers)
    && Array.isArray(value.answers)
    && value.answers.every(isQuizAnswer);
};

const parseQuizSubmission = (value: unknown, documentId: string, userId?: string): QuizSubmission => {
  if (!isRecord(value)) {
    throw new Error(`Format riwayat kuis ${documentId} tidak valid.`);
  }
  const submittedAtValue = value.submittedAt;
  const submittedAt = typeof submittedAtValue === 'string'
    ? submittedAtValue
    : submittedAtValue instanceof Timestamp
      ? typeof value.clientSubmittedAt === 'string'
        ? value.clientSubmittedAt
        : submittedAtValue.toDate().toISOString()
      : '';
  const normalized = { ...value, submittedAt };
  if (!isQuizSubmission(normalized)) {
    throw new Error(`Format riwayat kuis ${documentId} tidak valid.`);
  }
  return {
    ...normalized,
    id: documentId,
    userId: typeof normalized.userId === 'string' ? normalized.userId : userId,
    quizId: typeof normalized.quizId === 'string' ? normalized.quizId : EVALUATION_QUIZ_ID,
    questionVersion: typeof normalized.questionVersion === 'string'
      ? normalized.questionVersion
      : 'v1',
    attemptNumber: Number.isSafeInteger(normalized.attemptNumber) && Number(normalized.attemptNumber) > 0
      ? Number(normalized.attemptNumber)
      : undefined,
    status: 'submitted',
    manualEssayScore: Number.isFinite(normalized.manualEssayScore) ? Number(normalized.manualEssayScore) : undefined,
    teacherNotes: typeof normalized.teacherNotes === 'string' ? normalized.teacherNotes : '',
  };
};

const mergeQuizSubmissions = (...groups: QuizSubmission[][]): QuizSubmission[] =>
  [...new Map(groups.flat().map((submission) => [submission.id, submission])).values()]
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));

const getLatestQuizResult = (
  currentResult: QuizResult | null,
  submissions: QuizSubmission[],
): QuizResult | null => {
  const latestSubmission = submissions.find((submission) => submission.quizId === EVALUATION_QUIZ_ID);
  if (!latestSubmission) return currentResult;
  if (currentResult && Date.parse(currentResult.completedAt) > Date.parse(latestSubmission.submittedAt)) {
    return currentResult;
  }
  return {
    id: latestSubmission.id,
    quizId: latestSubmission.quizId,
    questionVersion: latestSubmission.questionVersion ?? 'v1',
    attemptNumber: latestSubmission.attemptNumber,
    studentName: latestSubmission.studentName,
    studentClass: latestSubmission.studentClass,
    score: latestSubmission.score,
    totalQuestions: latestSubmission.totalQuestions,
    correctAnswers: latestSubmission.correctAnswers,
    completedAt: latestSubmission.submittedAt,
    submissionData: latestSubmission.answers,
    essayAnswers: Object.fromEntries(
      latestSubmission.answers
        .filter((answer) => answer.questionType === 'essay')
        .map((answer) => [answer.questionId, answer.essayText ?? '']),
    ),
    manualEssayScore: latestSubmission.manualEssayScore,
    teacherNotes: latestSubmission.teacherNotes,
  };
};

const getAccountQuizAttemptsRef = (database: Firestore, studentId: string) =>
  collection(doc(database, 'studentProgress', studentId), QUIZ_ATTEMPTS_COLLECTION);

const getAccountQuizAttemptRef = (database: Firestore, studentId: string, attemptId: string) =>
  doc(getAccountQuizAttemptsRef(database, studentId), encodeURIComponent(attemptId));

const getAccountQuizAttemptCounterRef = (database: Firestore, studentId: string, quizId: string) =>
  doc(collection(doc(database, 'studentProgress', studentId), QUIZ_ATTEMPT_COUNTERS_COLLECTION), encodeURIComponent(quizId));

const isLearningProgress = (value: unknown): value is LearningProgress => {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.testedSolutions) &&
    isRecord(value.worksheetRecords) &&
    (value.worksheetConclusion === null || isRecord(value.worksheetConclusion)) &&
    (value.homePromptResponse === undefined ||
      value.homePromptResponse === null ||
      (isRecord(value.homePromptResponse) &&
        typeof value.homePromptResponse.text === 'string' &&
        typeof value.homePromptResponse.submittedAt === 'string')) &&
    (value.quizResult === null || isRecord(value.quizResult)) &&
    (value.quizSubmissions === undefined || Array.isArray(value.quizSubmissions)) &&
    Array.isArray(value.readMaterials)
  );
};

export interface PendingProgressSync {
  ownerId: string;
  syncStatus: 'pending' | 'error' | 'sent';
  pendingUpdatedAt: string;
  pendingProgress: LearningProgress;
}

const getPendingSyncKey = (ownerId: string): string =>
  `${PENDING_SYNC_STORAGE_KEY}:${encodeURIComponent(ownerId)}`;

export const getPendingProgressSync = (student: StudentIdentity): PendingProgressSync | null => {
  if (!student.id) return null;
  try {
    const raw = localStorage.getItem(getPendingSyncKey(student.id));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) ||
      parsed.ownerId !== student.id ||
      (parsed.syncStatus !== 'pending' && parsed.syncStatus !== 'error' && parsed.syncStatus !== 'sent') ||
      typeof parsed.pendingUpdatedAt !== 'string' ||
      !isLearningProgress(parsed.pendingProgress)) return null;
    return {
      ownerId: parsed.ownerId,
      syncStatus: parsed.syncStatus,
      pendingUpdatedAt: parsed.pendingUpdatedAt,
      pendingProgress: { ...parsed.pendingProgress, student },
    };
  } catch (error) {
    console.error('Error loading pending sync queue from localStorage:', error);
    return null;
  }
};

export const markPendingProgressSync = (
  progress: LearningProgress,
  student: StudentIdentity,
  syncStatus: 'pending' | 'error' = 'pending',
): PendingProgressSync | null => {
  if (!student.id) return null;
  const pending: PendingProgressSync = {
    ownerId: student.id,
    syncStatus,
    pendingUpdatedAt: new Date().toISOString(),
    pendingProgress: { ...progress, student },
  };
  try {
    localStorage.setItem(getPendingSyncKey(student.id), JSON.stringify(pending));
  } catch (error) {
    console.error('Error saving pending sync queue to localStorage:', error);
  }
  return pending;
};

export const clearPendingProgressSync = (ownerId: string): void => {
  try {
    localStorage.removeItem(getPendingSyncKey(ownerId));
  } catch (error) {
    console.error('Error clearing pending sync queue from localStorage:', error);
  }
};

const createDefaultProgress = (student: StudentIdentity): LearningProgress => ({
  ...DEFAULT_PROGRESS,
  student,
});

const loadAccountQuizAttempts = async (studentId: string): Promise<QuizSubmission[]> => {
  if (!firestore) throw new Error('Firestore belum dikonfigurasi untuk memuat riwayat kuis.');
  const snapshot = await getDocs(getAccountQuizAttemptsRef(firestore, studentId));
  return snapshot.docs.map((attempt) => parseQuizSubmission(attempt.data(), attempt.data().id ?? attempt.id, studentId));
};

const migrateLegacyQuizAttempts = async (
  student: StudentIdentity,
  legacySubmissions: QuizSubmission[],
): Promise<void> => {
  if (!firestore || !student.id || legacySubmissions.length === 0) return;
  const database = firestore;
  const studentId = student.id;

  const submissions = legacySubmissions
    .map((submission) => parseQuizSubmission(submission, submission.id, studentId))
    .filter((submission) => submission.quizId === EVALUATION_QUIZ_ID)
    .sort((left, right) => left.submittedAt.localeCompare(right.submittedAt));

  await Promise.all(submissions.map(async (submission, index) => {
    const attemptRef = getAccountQuizAttemptRef(database, studentId, submission.id);
    await runTransaction(database, async (transaction) => {
      const existing = await transaction.get(attemptRef);
      if (existing.exists()) return;
      transaction.set(attemptRef, {
        ...submission,
        userId: studentId,
        quizId: EVALUATION_QUIZ_ID,
        attemptNumber: submission.attemptNumber ?? index + 1,
        status: 'submitted',
        clientSubmittedAt: submission.submittedAt,
        submittedAt: serverTimestamp(),
        migratedAt: serverTimestamp(),
      });
    });
  }));

  const counterRef = getAccountQuizAttemptCounterRef(database, studentId, EVALUATION_QUIZ_ID);
  const highestAttempt = Math.max(
    submissions.length,
    ...submissions.map((submission, index) => submission.attemptNumber ?? index + 1),
  );
  await runTransaction(database, async (transaction) => {
    const counter = await transaction.get(counterRef);
    const currentCount = counter.exists() && Number.isSafeInteger(counter.data().attemptCount)
      ? Number(counter.data().attemptCount)
      : 0;
    if (currentCount < highestAttempt) {
      transaction.set(counterRef, {
        quizId: EVALUATION_QUIZ_ID,
        attemptCount: highestAttempt,
        updatedAt: serverTimestamp(),
      });
    }
  });
};

export const loadTeacherQuizAttempts = async (): Promise<QuizSubmission[]> => {
  if (!firestore) throw new Error('Firestore belum dikonfigurasi untuk memuat riwayat kuis guru.');
  const uid = firebaseAuth?.currentUser?.uid;
  if (!uid || !(await isVerifiedTeacherUid(uid))) {
    throw new Error('Akses rekap siswa hanya tersedia untuk guru yang sah.');
  }
  const snapshot = await getDocs(collectionGroup(firestore, QUIZ_ATTEMPTS_COLLECTION));
  return snapshot.docs.map((attempt) => {
    const userId = attempt.ref.parent.parent?.id;
    return parseQuizSubmission(attempt.data(), attempt.data().id ?? attempt.id, userId);
  }).sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
};

export const updateAccountQuizAttempt = async (
  submission: QuizSubmission,
  updates: Pick<QuizSubmission, 'manualEssayScore' | 'teacherNotes'>,
): Promise<void> => {
  if (!firestore || !submission.userId) {
    throw new Error('Identitas akun pemilik hasil kuis tidak tersedia.');
  }
  const uid = firebaseAuth?.currentUser?.uid;
  if (!uid || !(await isVerifiedTeacherUid(uid))) {
    throw new Error('Hanya guru yang sah dapat menyimpan nilai dan catatan.');
  }
  const maximumEssayScore = submission.questionVersion === 'v2' || submission.questionVersion === 'v3' ? 40 : 100;
  if (updates.manualEssayScore === undefined ||
    !Number.isFinite(updates.manualEssayScore) ||
    updates.manualEssayScore < 0 ||
    updates.manualEssayScore > maximumEssayScore ||
    typeof updates.teacherNotes !== 'string') {
    throw new Error('Nilai atau catatan guru tidak valid.');
  }
  await updateDoc(getAccountQuizAttemptRef(firestore, submission.userId, submission.id), {
    manualEssayScore: updates.manualEssayScore,
    teacherNotes: updates.teacherNotes,
    gradedBy: uid,
    gradedAt: serverTimestamp(),
  });
};

export const deleteAccountQuizAttempts = async (student: StudentIdentity): Promise<void> => {
  if (!firestore || !student.id) {
    throw new Error('Firebase belum dikonfigurasi untuk menghapus riwayat kuis akun.');
  }
  const [attempts, counters] = await Promise.all([
    getDocs(getAccountQuizAttemptsRef(firestore, student.id)),
    getDocs(collection(doc(firestore, 'studentProgress', student.id), QUIZ_ATTEMPT_COUNTERS_COLLECTION)),
  ]);
  const refs = [...attempts.docs, ...counters.docs].map((snapshot) => snapshot.ref);
  for (let offset = 0; offset < refs.length; offset += 450) {
    const batch = writeBatch(firestore);
    refs.slice(offset, offset + 450).forEach((reference) => batch.delete(reference));
    await batch.commit();
  }
};

export const getActiveStudent = (): StudentIdentity | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.name !== 'string' || typeof parsed?.className !== 'string') return null;
    return { name: parsed.name, className: parsed.className };
  } catch (e) {
    console.error('Error loading active student from localStorage:', e);
    return null;
  }
};

export const saveActiveStudent = (student: StudentIdentity): void => {
  try {
    localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(student));
  } catch (e) {
    console.error('Error saving active student to localStorage:', e);
  }
};

export const clearActiveStudent = (): void => {
  try {
    localStorage.removeItem(ACTIVE_STUDENT_KEY);
  } catch (e) {
    console.error('Error clearing active student from localStorage:', e);
  }
};

export const getStoredProgress = (student: StudentIdentity): LearningProgress => {
  try {
    const raw = localStorage.getItem(getProgressKey(student));
    if (!raw) return createDefaultProgress(student);
    const parsed = JSON.parse(raw);
    return {
      student,
      testedSolutions: Array.isArray(parsed.testedSolutions) ? parsed.testedSolutions : [],
      worksheetRecords: parsed.worksheetRecords || {},
      worksheetConclusion: parsed.worksheetConclusion || null,
      homePromptResponse: isRecord(parsed.homePromptResponse) &&
        typeof parsed.homePromptResponse.text === 'string' &&
        typeof parsed.homePromptResponse.submittedAt === 'string'
        ? { text: parsed.homePromptResponse.text, submittedAt: parsed.homePromptResponse.submittedAt }
        : null,
      quizResult: parsed.quizResult || null,
      quizSubmissions: Array.isArray(parsed.quizSubmissions) ? parsed.quizSubmissions : [],
      readMaterials: Array.isArray(parsed.readMaterials) ? parsed.readMaterials : [],
    };
  } catch (e) {
    console.error('Error loading progress from localStorage:', e);
    return createDefaultProgress(student);
  }
};

export const loadAccountProgress = async (student: StudentIdentity): Promise<LearningProgress> => {
  if (!firestore || !student.id) {
    throw new Error('Firebase belum dikonfigurasi untuk memuat progres akun.');
  }

  const progressRef = doc(firestore, 'studentProgress', student.id);
  const snapshot = await getDoc(progressRef);

  if (!snapshot.exists()) {
    const attempts = await loadAccountQuizAttempts(student.id);
    const storedProgress = getStoredProgress(student);
    const quizSubmissions = mergeQuizSubmissions(storedProgress.quizSubmissions, attempts);
    return {
      ...storedProgress,
      quizResult: getLatestQuizResult(storedProgress.quizResult, quizSubmissions),
      quizSubmissions,
    };
  }
  const remoteProgress: unknown = snapshot.data().progress;
  if (!isLearningProgress(remoteProgress)) {
    throw new Error('Format progres akun tidak valid. Data lokal tidak akan menimpa data tersebut.');
  }

  const legacySubmissions = Array.isArray(remoteProgress.quizSubmissions)
    ? remoteProgress.quizSubmissions.map((submission) => {
      if (!isRecord(submission) || typeof submission.id !== 'string') {
        throw new Error('Format riwayat kuis lama tidak valid.');
      }
      return parseQuizSubmission(submission, submission.id, student.id);
    })
    : [];
  await migrateLegacyQuizAttempts(student, legacySubmissions);
  const attempts = await loadAccountQuizAttempts(student.id);
  const quizSubmissions = mergeQuizSubmissions(legacySubmissions, attempts);
  return {
    ...remoteProgress,
    quizResult: getLatestQuizResult(remoteProgress.quizResult, quizSubmissions),
    homePromptResponse: remoteProgress.homePromptResponse ?? null,
    quizSubmissions,
    student,
  };
};

export const saveAccountProgress = async (
  progress: LearningProgress,
  student: StudentIdentity,
): Promise<void> => {
  if (!firestore || !student.id) {
    throw new Error('Firebase belum dikonfigurasi untuk menyimpan progres akun.');
  }

  const sanitizeSubmission = (submission: QuizSubmission): QuizSubmission => {
    const answerOnly = { ...submission } as QuizSubmission & Record<string, unknown>;
    delete answerOnly.manualEssayScore;
    delete answerOnly.teacherNotes;
    delete answerOnly.essayScore;
    delete answerOnly.gradedBy;
    delete answerOnly.gradedAt;
    return answerOnly;
  };
  const sanitizedProgress: LearningProgress = {
    ...progress,
    quizSubmissions: progress.quizSubmissions.map(sanitizeSubmission),
    quizResult: progress.quizResult
      ? (() => {
        const result = { ...progress.quizResult } as typeof progress.quizResult & Record<string, unknown>;
        delete result.manualEssayScore;
        delete result.teacherNotes;
        delete result.essayScore;
        delete result.gradedBy;
        delete result.gradedAt;
        return result;
      })()
      : null,
  };

  await setDoc(doc(firestore, 'studentProgress', student.id), {
    progress: { ...sanitizedProgress, student },
    updatedAt: serverTimestamp(),
  });
};

export interface LocalStorageSaveResult {
  success: boolean;
  error?: Error;
}

export const trySaveStoredProgress = (progress: LearningProgress, student: StudentIdentity): LocalStorageSaveResult => {
  try {
    localStorage.setItem(getProgressKey(student), JSON.stringify({ ...progress, student }));
    return { success: true };
  } catch (e) {
    console.error('Error saving progress to localStorage:', e);
    return {
      success: false,
      error: e instanceof Error ? e : new Error('Penyimpanan browser mengalami kesalahan.'),
    };
  }
};

export const saveStoredProgress = (progress: LearningProgress, student: StudentIdentity): boolean =>
  trySaveStoredProgress(progress, student).success;

const parseQuizAnswers = (value: unknown): Record<number, QuizAnswer> => {
  if (!isRecord(value)) throw new Error('Format jawaban draf kuis tidak valid.');

  const answers: Record<number, QuizAnswer> = {};
  for (const [key, answer] of Object.entries(value)) {
    const questionId = Number(key);
    if (!Number.isSafeInteger(questionId) || !isQuizAnswer(answer) || answer.questionId !== questionId) {
      throw new Error('Isi jawaban draf kuis tidak valid.');
    }
    answers[questionId] = answer;
  }
  return answers;
};

export const getQuizDraft = (student: StudentIdentity, quizId = EVALUATION_QUIZ_ID): QuizDraft | null => {
  const storageKey = getQuizDraftKey(student, quizId);
  let raw = localStorage.getItem(storageKey);
  let needsMigration = false;
  if (!raw) {
    raw = localStorage.getItem(getLegacyQuizDraftKey(student));
    needsMigration = Boolean(raw);
  }
  if (!raw) return null;

  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) throw new Error('Format draf kuis tidak valid.');

  const answers = 'answers' in parsed ? parseQuizAnswers(parsed.answers) : parseQuizAnswers(parsed);
  const isNewFormat = 'userId' in parsed || 'quizId' in parsed || 'lastQuestionId' in parsed
    || 'status' in parsed || 'updatedAt' in parsed;
  const inferredLastQuestionId = Object.keys(answers)
    .map(Number)
    .filter(Number.isSafeInteger)
    .reduce<number | null>((latest, questionId) => latest === null ? questionId : Math.max(latest, questionId), null);
  let draft: QuizDraft;
  if (isNewFormat) {
    if (
      typeof parsed.userId !== 'string'
      || typeof parsed.quizId !== 'string'
      || typeof parsed.attemptId !== 'string'
      || typeof parsed.updatedAt !== 'string'
      || parsed.status !== 'draft'
      || (parsed.lastQuestionId !== null && (
        typeof parsed.lastQuestionId !== 'number'
        || !Number.isSafeInteger(parsed.lastQuestionId)
        || parsed.lastQuestionId < 1
      ))
    ) {
      throw new Error('Format draf kuis tidak lengkap.');
    }
    draft = {
      userId: parsed.userId,
      quizId: parsed.quizId,
      attemptId: parsed.attemptId,
      questionVersion: typeof parsed.questionVersion === 'string' ? parsed.questionVersion : undefined,
      answers,
      lastQuestionId: parsed.lastQuestionId,
      status: 'draft',
      updatedAt: parsed.updatedAt,
    };
  } else {
    draft = {
      userId: getQuizUserId(student),
      quizId,
      attemptId: typeof parsed.attemptId === 'string' && parsed.attemptId
        ? parsed.attemptId
        : `submission-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      answers,
      lastQuestionId: inferredLastQuestionId,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
  }

  if (
    draft.userId !== getQuizUserId(student)
    || draft.quizId !== quizId
    || !draft.attemptId
    || draft.status !== 'draft'
    || !Number.isFinite(Date.parse(draft.updatedAt))
  ) {
    throw new Error('Draf kuis tidak cocok dengan pengguna atau kuis ini.');
  }

  if (needsMigration || !isNewFormat) {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    if (needsMigration) localStorage.removeItem(getLegacyQuizDraftKey(student));
  }
  return draft;
};

export const saveQuizDraft = (student: StudentIdentity, draft: QuizDraft): void => {
  if (
    draft.userId !== getQuizUserId(student)
    || !draft.quizId
    || !draft.attemptId
    || draft.status !== 'draft'
    || !Number.isFinite(Date.parse(draft.updatedAt))
    || (draft.lastQuestionId !== null && (!Number.isSafeInteger(draft.lastQuestionId) || draft.lastQuestionId < 1))
  ) {
    throw new Error('Draf kuis tidak cocok dengan pengguna atau statusnya.');
  }
  const storageKey = getQuizDraftKey(student, draft.quizId);
  const existingRaw = localStorage.getItem(storageKey);
  if (existingRaw) {
    const existing: unknown = JSON.parse(existingRaw);
    if (
      isRecord(existing)
      && typeof existing.attemptId === 'string'
      && existing.attemptId !== draft.attemptId
      && existing.questionVersion !== draft.questionVersion
    ) {
      const archiveKey = `${storageKey}:archived:${encodeURIComponent(existing.attemptId)}`;
      if (!localStorage.getItem(archiveKey)) localStorage.setItem(archiveKey, existingRaw);
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(draft));
};

export const clearQuizDraft = (student: StudentIdentity, quizId = EVALUATION_QUIZ_ID): void => {
  localStorage.removeItem(getLegacyQuizDraftKey(student));
  localStorage.removeItem(getQuizDraftKey(student, quizId));
};

export const markSolutionTested = (solutionId: string, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  if (!current.testedSolutions.includes(solutionId)) {
    const updated: LearningProgress = {
      ...current,
      testedSolutions: [...current.testedSolutions, solutionId],
    };
    saveStoredProgress(updated, student);
    return updated;
  }
  return current;
};

export const saveWorksheetRecord = (record: ExperimentRecord, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const recordKey = record.experimentId
    ? getExperimentRecordKey(record.experimentId, record.solutionId)
    : record.solutionId;
  const updated: LearningProgress = {
    ...current,
    worksheetRecords: {
      ...current.worksheetRecords,
      [recordKey]: record,
    },
  };
  saveStoredProgress(updated, student);
  return updated;
};

export const saveWorksheetConclusion = (conclusion: WorksheetConclusion, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const updated: LearningProgress = { ...current, worksheetConclusion: conclusion };
  saveStoredProgress(updated, student);
  return updated;
};

export const saveHomePromptResponse = (response: HomePromptResponse, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const updated: LearningProgress = { ...current, homePromptResponse: response };
  if (!saveStoredProgress(updated, student)) {
    throw new Error('Jawaban pemantik gagal disimpan di perangkat. Periksa ruang penyimpanan browser lalu coba lagi.');
  }
  return updated;
};

export const saveAccountQuizAttempt = async (
  submission: QuizSubmission,
  student: StudentIdentity,
): Promise<QuizSubmission> => {
  if (!firestore || !student.id) {
    throw new Error('Firebase belum dikonfigurasi untuk menyimpan percobaan kuis akun.');
  }

  const studentId = student.id;
  const quizId = submission.quizId ?? EVALUATION_QUIZ_ID;
  const sanitizedSubmission = { ...submission } as QuizSubmission & Record<string, unknown>;
  delete sanitizedSubmission.manualEssayScore;
  delete sanitizedSubmission.teacherNotes;
  delete sanitizedSubmission.essayScore;
  delete sanitizedSubmission.gradedBy;
  delete sanitizedSubmission.gradedAt;
  const attemptRef = getAccountQuizAttemptRef(firestore, studentId, submission.id);
  const counterRef = getAccountQuizAttemptCounterRef(firestore, studentId, quizId);
  const progressRef = doc(firestore, 'studentProgress', studentId);

  return runTransaction(firestore, async (transaction) => {
    const [existingAttempt, counter, progressSnapshot] = await Promise.all([
      transaction.get(attemptRef),
      transaction.get(counterRef),
      transaction.get(progressRef),
    ]);

    if (existingAttempt.exists()) {
      const saved = parseQuizSubmission(existingAttempt.data(), submission.id, studentId);
      if (saved.userId !== studentId || saved.quizId !== quizId) {
        throw new Error('ID percobaan ini sudah digunakan untuk data kuis lain.');
      }
      const confirmedSubmission: QuizSubmission = {
        ...sanitizedSubmission,
        id: submission.id,
        userId: studentId,
        quizId,
        questionVersion: submission.questionVersion ?? saved.questionVersion ?? 'v1',
        attemptNumber: saved.attemptNumber ?? submission.attemptNumber,
        status: 'submitted',
      };
      transaction.set(attemptRef, {
        ...confirmedSubmission,
        clientSubmittedAt: sanitizedSubmission.submittedAt,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return confirmedSubmission;
    }

    const embeddedAttempts: unknown = progressSnapshot.exists()
      ? progressSnapshot.data().progress?.quizSubmissions
      : [];
    const legacyAttemptCount = Array.isArray(embeddedAttempts)
      ? embeddedAttempts.filter((item) =>
        isRecord(item) && (item.quizId === undefined || item.quizId === quizId),
      ).length
      : 0;
    const currentCount = counter.exists() && Number.isSafeInteger(counter.data().attemptCount)
      ? Number(counter.data().attemptCount)
      : 0;
    const attemptNumber = Math.max(
      currentCount,
      legacyAttemptCount,
      submission.attemptNumber ?? 0,
    );
    const savedSubmission: QuizSubmission = {
      ...sanitizedSubmission,
      userId: studentId,
      quizId,
      attemptNumber,
      status: 'submitted',
    };

    transaction.set(attemptRef, {
      ...savedSubmission,
      clientSubmittedAt: submission.submittedAt,
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    transaction.set(counterRef, {
      quizId,
      attemptCount: attemptNumber,
      updatedAt: serverTimestamp(),
    });
    return savedSubmission;
  });
};

export const setQuizSubmissionAttemptNumber = (
  submissionId: string,
  attemptNumber: number,
  student: StudentIdentity,
): LearningProgress => {
  if (!Number.isSafeInteger(attemptNumber) || attemptNumber < 1) {
    throw new Error('Nomor percobaan kuis tidak valid.');
  }
  const current = getStoredProgress(student);
  const updatedSubmissions = current.quizSubmissions.map((submission) =>
    submission.id === submissionId ? { ...submission, attemptNumber } : submission,
  );
  const updated: LearningProgress = {
    ...current,
    quizResult: current.quizResult?.id === submissionId
      ? { ...current.quizResult, attemptNumber }
      : current.quizResult,
    quizSubmissions: updatedSubmissions,
  };
  if (!saveStoredProgress(updated, student)) {
    throw new Error('Nomor percobaan gagal disimpan di perangkat.');
  }
  return updated;
};

export const saveQuizResult = (quizResult: QuizResult, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const quizId = quizResult.quizId ?? EVALUATION_QUIZ_ID;
  const submissionId = quizResult.id ?? `submission-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const existingSubmission = current.quizSubmissions.find((item) => item.id === submissionId);
  const previousAttempts = current.quizSubmissions.filter((item) =>
    item.quizId === undefined || item.quizId === quizId,
  );
  const attemptNumber = existingSubmission?.attemptNumber ?? Math.max(
    previousAttempts.length,
    ...previousAttempts.map((item) => item.attemptNumber ?? 0),
  ) + 1;
  const resultWithAttempt: QuizResult = {
    ...quizResult,
    id: submissionId,
    quizId,
    questionVersion: quizResult.questionVersion ?? 'v1',
    attemptNumber,
  };
  const submission: QuizSubmission = {
    id: submissionId,
    userId: student.id ?? 'guest',
    quizId,
    questionVersion: resultWithAttempt.questionVersion ?? 'v1',
    attemptNumber,
    status: 'submitted',
    studentName: student.name,
    studentClass: student.className,
    submittedAt: resultWithAttempt.completedAt,
    answers: resultWithAttempt.submissionData ?? [],
    score: resultWithAttempt.score,
    totalQuestions: resultWithAttempt.totalQuestions,
    correctAnswers: resultWithAttempt.correctAnswers,
    manualEssayScore: resultWithAttempt.manualEssayScore,
    teacherNotes: resultWithAttempt.teacherNotes ?? '',
  };

  const updated: LearningProgress = {
    ...current,
    quizResult: resultWithAttempt,
    quizSubmissions: [submission, ...current.quizSubmissions.filter((item) => item.id !== submission.id)],
  };

  if (!saveStoredProgress(updated, student)) {
    throw new Error('Hasil kuis gagal disimpan di perangkat. Periksa ruang penyimpanan browser lalu coba lagi.');
  }
  return updated;
};

export const updateQuizSubmission = (submissionId: string, updates: Partial<QuizSubmission>, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const updatedSubmissions = current.quizSubmissions.map((submission) => {
    if (submission.id !== submissionId) return submission;
    return {
      ...submission,
      ...updates,
    };
  });

  const updated: LearningProgress = {
    ...current,
    quizSubmissions: updatedSubmissions,
  };

  saveStoredProgress(updated, student);
  return updated;
};

export const resetAllProgress = (student: StudentIdentity): LearningProgress => {
  try {
    localStorage.removeItem(getProgressKey(student));
    clearQuizDraft(student);
    if (student.id) clearPendingProgressSync(student.id);
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  return createDefaultProgress(student);
};
