import type { LearningProgress, ExperimentRecord, HomePromptResponse, QuizAnswer, QuizDraft, QuizResult, QuizSubmission, StudentIdentity, WorksheetConclusion } from '../types/chemistry';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { getExperimentRecordKey } from './experimentRecords';

const STORAGE_KEY = 'kimialab_learning_progress_v2';
const ACTIVE_STUDENT_KEY = 'kimialab_active_student_v1';
const QUIZ_DRAFT_STORAGE_KEY = 'kimialab_quiz_draft_v1';

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

const getQuizDraftKey = (student: StudentIdentity): string =>
  `${QUIZ_DRAFT_STORAGE_KEY}:${getStudentStorageScope(student)}`;

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
    Array.isArray(value.quizSubmissions) &&
    Array.isArray(value.readMaterials)
  );
};

const createDefaultProgress = (student: StudentIdentity): LearningProgress => ({
  ...DEFAULT_PROGRESS,
  student,
});

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

  if (!snapshot.exists()) return getStoredProgress(student);
  const remoteProgress: unknown = snapshot.data().progress;
  if (!isLearningProgress(remoteProgress)) {
    throw new Error('Format progres akun tidak valid. Data lokal tidak akan menimpa data tersebut.');
  }

  return { ...remoteProgress, homePromptResponse: remoteProgress.homePromptResponse ?? null, student };
};

export const saveAccountProgress = async (
  progress: LearningProgress,
  student: StudentIdentity,
): Promise<void> => {
  if (!firestore || !student.id) {
    throw new Error('Firebase belum dikonfigurasi untuk menyimpan progres akun.');
  }

  await setDoc(doc(firestore, 'studentProgress', student.id), {
    progress: { ...progress, student },
    updatedAt: serverTimestamp(),
  });
};

export const saveStoredProgress = (progress: LearningProgress, student: StudentIdentity): boolean => {
  try {
    localStorage.setItem(getProgressKey(student), JSON.stringify({ ...progress, student }));
    return true;
  } catch (e) {
    console.error('Error saving progress to localStorage:', e);
    return false;
  }
};

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

export const getQuizDraft = (student: StudentIdentity): QuizDraft | null => {
  const raw = localStorage.getItem(getQuizDraftKey(student));
  if (!raw) return null;

  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) throw new Error('Format draf kuis tidak valid.');

  if (typeof parsed.attemptId === 'string' && isRecord(parsed.answers)) {
    return {
      attemptId: parsed.attemptId,
      answers: parseQuizAnswers(parsed.answers),
    };
  }

  return {
    attemptId: `submission-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    answers: parseQuizAnswers(parsed),
  };
};

export const saveQuizDraft = (student: StudentIdentity, draft: QuizDraft): void => {
  localStorage.setItem(getQuizDraftKey(student), JSON.stringify(draft));
};

export const clearQuizDraft = (student: StudentIdentity): void => {
  localStorage.removeItem(getQuizDraftKey(student));
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

export const saveQuizResult = (quizResult: QuizResult, student: StudentIdentity): LearningProgress => {
  const current = getStoredProgress(student);
  const submission: QuizSubmission = {
    id: quizResult.id ?? `submission-${Date.now()}`,
    studentName: student.name,
    studentClass: student.className,
    submittedAt: quizResult.completedAt,
    answers: quizResult.submissionData ?? [],
    score: quizResult.score,
    totalQuestions: quizResult.totalQuestions,
    correctAnswers: quizResult.correctAnswers,
    manualEssayScore: quizResult.manualEssayScore ?? 0,
    teacherNotes: quizResult.teacherNotes ?? '',
  };

  const updated: LearningProgress = {
    ...current,
    quizResult,
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
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  return createDefaultProgress(student);
};
