import type { LearningProgress, ExperimentRecord, QuizResult, QuizSubmission, StudentIdentity, WorksheetConclusion } from '../types/chemistry';
import { supabase } from './supabase';

const STORAGE_KEY = 'kimialab_learning_progress_v2';
const ACTIVE_STUDENT_KEY = 'kimialab_active_student_v1';

export const DEFAULT_PROGRESS: LearningProgress = {
  student: null,
  testedSolutions: [],
  worksheetRecords: {},
  worksheetConclusion: null,
  quizResult: null,
  quizSubmissions: [],
  readMaterials: [],
};

const getProgressKey = (student: StudentIdentity): string => {
  if (student.id) return `${STORAGE_KEY}:account:${encodeURIComponent(student.id)}`;
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID');
  return `${STORAGE_KEY}:${encodeURIComponent(`${normalize(student.name)}|${normalize(student.className)}`)}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isLearningProgress = (value: unknown): value is LearningProgress => {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.testedSolutions) &&
    isRecord(value.worksheetRecords) &&
    (value.worksheetConclusion === null || isRecord(value.worksheetConclusion)) &&
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
  if (!supabase || !student.id) {
    throw new Error('Supabase belum dikonfigurasi untuk memuat progres akun.');
  }

  const { data, error } = await supabase
    .from('student_progress')
    .select('progress')
    .eq('user_id', student.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) return getStoredProgress(student);
  if (!isLearningProgress(data.progress)) {
    throw new Error('Format progres akun tidak valid. Data lokal tidak akan menimpa data tersebut.');
  }

  return { ...data.progress, student };
};

export const saveAccountProgress = async (
  progress: LearningProgress,
  student: StudentIdentity,
): Promise<void> => {
  if (!supabase || !student.id) {
    throw new Error('Supabase belum dikonfigurasi untuk menyimpan progres akun.');
  }

  const { error } = await supabase.from('student_progress').upsert({
    user_id: student.id,
    progress: { ...progress, student },
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
};

export const saveStoredProgress = (progress: LearningProgress, student: StudentIdentity): void => {
  try {
    localStorage.setItem(getProgressKey(student), JSON.stringify({ ...progress, student }));
  } catch (e) {
    console.error('Error saving progress to localStorage:', e);
  }
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
  const updated: LearningProgress = {
    ...current,
    worksheetRecords: {
      ...current.worksheetRecords,
      [record.solutionId]: record,
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

  saveStoredProgress(updated, student);
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
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  return createDefaultProgress(student);
};
