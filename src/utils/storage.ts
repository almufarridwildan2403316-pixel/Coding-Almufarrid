import type { LearningProgress, ExperimentRecord, QuizResult, QuizSubmission } from '../types/chemistry';

const STORAGE_KEY = 'kimialab_learning_progress_v1';

export const DEFAULT_PROGRESS: LearningProgress = {
  testedSolutions: [],
  worksheetRecords: {},
  quizResult: null,
  quizSubmissions: [],
  readMaterials: [],
};

export const getStoredProgress = (): LearningProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      testedSolutions: Array.isArray(parsed.testedSolutions) ? parsed.testedSolutions : [],
      worksheetRecords: parsed.worksheetRecords || {},
      quizResult: parsed.quizResult || null,
      quizSubmissions: Array.isArray(parsed.quizSubmissions) ? parsed.quizSubmissions : [],
      readMaterials: Array.isArray(parsed.readMaterials) ? parsed.readMaterials : [],
    };
  } catch (e) {
    console.error('Error loading progress from localStorage:', e);
    return DEFAULT_PROGRESS;
  }
};

export const saveStoredProgress = (progress: LearningProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress to localStorage:', e);
  }
};

export const markSolutionTested = (solutionId: string): LearningProgress => {
  const current = getStoredProgress();
  if (!current.testedSolutions.includes(solutionId)) {
    const updated: LearningProgress = {
      ...current,
      testedSolutions: [...current.testedSolutions, solutionId],
    };
    saveStoredProgress(updated);
    return updated;
  }
  return current;
};

export const saveWorksheetRecord = (record: ExperimentRecord): LearningProgress => {
  const current = getStoredProgress();
  const updated: LearningProgress = {
    ...current,
    worksheetRecords: {
      ...current.worksheetRecords,
      [record.solutionId]: record,
    },
  };
  saveStoredProgress(updated);
  return updated;
};

export const saveQuizResult = (quizResult: QuizResult): LearningProgress => {
  const current = getStoredProgress();
  const submission: QuizSubmission = {
    id: quizResult.id ?? `submission-${Date.now()}`,
    studentName: quizResult.studentName ?? 'Siswa',
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

  saveStoredProgress(updated);
  return updated;
};

export const updateQuizSubmission = (submissionId: string, updates: Partial<QuizSubmission>): LearningProgress => {
  const current = getStoredProgress();
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

  saveStoredProgress(updated);
  return updated;
};

export const resetAllProgress = (): LearningProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
  return DEFAULT_PROGRESS;
};
