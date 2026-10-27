import type { LearningProgress, ExperimentRecord, QuizResult } from '../types/chemistry';

const STORAGE_KEY = 'kimialab_learning_progress_v1';

export const DEFAULT_PROGRESS: LearningProgress = {
  testedSolutions: [],
  worksheetRecords: {},
  quizResult: null,
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
  const updated: LearningProgress = {
    ...current,
    quizResult,
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
