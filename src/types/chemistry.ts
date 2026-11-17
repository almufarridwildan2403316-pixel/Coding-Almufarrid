export type SolutionCategory =
  | 'strong_electrolyte'
  | 'weak_electrolyte'
  | 'nonelectrolyte';

export type LampStatus = 'bright' | 'dim' | 'off';
export type BubbleStatus = 'visible' | 'possible' | 'not_expected';
export type ExperimentId = 'percobaan_1' | 'percobaan_2';

export interface SampleScore {
  prediction?: number;
  lamp: number;
  bubbles: number;
  classification?: number;
  total: number;
  maximum: 3;
}

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
  experimentId?: ExperimentId;
  sampleType?: 'prepared' | 'mystery';
  sampleName?: string;
  sampleFormula?: string;
  sampleCondition?: string;
  referenceCategory?: SolutionCategory;
  referenceLamp?: LampStatus;
  referenceBubbles?: BubbleStatus;
  referenceEquation?: string;
  referenceExplanation?: string;
  safetyNote?: string;
  studentName: string;
  studentClass: string;
  prediction: SolutionCategory | '';
  predictionLocked?: boolean;
  lampObservation: LampStatus | '';
  bubbleObservation: BubbleStatus | '';
  conclusion: SolutionCategory | '';
  score?: SampleScore;
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
  studentClass?: string;
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
  studentClass: string;
  submittedAt: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  manualEssayScore?: number;
  teacherNotes?: string;
}

export interface LearningProgress {
  student: StudentIdentity | null;
  testedSolutions: string[]; // List of solution IDs tested in simulation
  worksheetRecords: Record<string, ExperimentRecord>;
  worksheetConclusion: WorksheetConclusion | null;
  quizResult: QuizResult | null;
  quizSubmissions: QuizSubmission[];
  readMaterials: string[]; // IDs of materials read
}

export interface StudentIdentity {
  id?: string;
  email?: string;
  name: string;
  className: string;
}

export interface WorksheetConclusion {
  text: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
}

export type ActivePage =
  | 'beranda'
  | 'materi'
  | 'lab'
  | 'lembar-kerja'
  | 'evaluasi'
  | 'guru'
  | 'hasil';
