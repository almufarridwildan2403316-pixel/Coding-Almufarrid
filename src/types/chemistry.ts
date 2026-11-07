export type SolutionCategory =
  | 'strong_electrolyte'
  | 'weak_electrolyte'
  | 'nonelectrolyte';

export type LampStatus = 'bright' | 'dim' | 'off';
export type BubbleStatus = 'visible' | 'possible' | 'not_expected';

export interface Solution {
  id: string; // S01 - S06
  name: string;
  formula: string;
  category: SolutionCategory;
  categoryLabel: string;
  expectedLamp: LampStatus;
  expectedBubbles: BubbleStatus;
  degreeOfIonization: string; // e.g. "α = 1", "0 < α < 1", "α = 0"
  particleModel: string;
  equation: string;
  ions: {
    positive: string;
    negative: string;
    neutral?: string;
  };
  liquidColor: string;
  accentColor: string;
  description: string;
  explanation: string;
}

export interface ExperimentRecord {
  solutionId: string;
  prediction: SolutionCategory | '';
  lampObservation: LampStatus | '';
  bubbleObservation: BubbleStatus | '';
  conclusion: SolutionCategory | '';
  notes?: string;
  completed: boolean;
  completedAt?: string;
}

export type QuizQuestionType = 'multiple-choice' | 'essay';

export interface QuizAnswer {
  questionId: number;
  questionType: QuizQuestionType;
  selectedOption?: number;
  essayText?: string;
}

export interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  category: 'Konsep' | 'Klasifikasi' | 'Interpretasi Data' | 'Persamaan Reaksi' | 'Penalaran';
  explanation: string;
}

export interface QuizResult {
  id?: string;
  studentName?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  submissionData: QuizAnswer[];
  essayAnswers: Record<number, string>;
  manualEssayScore?: number;
  teacherNotes?: string;
}

export interface QuizSubmission {
  id: string;
  studentName: string;
  submittedAt: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  manualEssayScore?: number;
  teacherNotes?: string;
}

export interface LearningProgress {
  testedSolutions: string[]; // List of solution IDs tested in simulation
  worksheetRecords: Record<string, ExperimentRecord>;
  quizResult: QuizResult | null;
  quizSubmissions: QuizSubmission[];
  readMaterials: string[]; // IDs of materials read
}

export type ActivePage =
  | 'beranda'
  | 'materi'
  | 'lab'
  | 'lembar-kerja'
  | 'evaluasi'
  | 'guru'
  | 'hasil';
