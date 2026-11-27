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

export interface QuizDraft {
  userId: string;
  quizId: string;
  attemptId: string;
  questionVersion?: string;
  answers: Record<number, QuizAnswer>;
  lastQuestionId: number | null;
  status: 'draft';
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  question: string;
  cognitiveLevel: 'C3' | 'C4' | 'C5';
  context?: string;
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  options?: string[];
  correctIndex?: number;
  category: string;
  explanation: string;
  answerGuide?: string;
  rubric?: Array<{ id: string; criterion: string; points: number }>;
}

export type QuizGradingStatus = 'PENDING_ESSAY_GRADING' | 'COMPLETED';

export interface QuizEssayAssessment {
  rubricScores?: Record<string, number>;
  score: number;
  feedback: string;
}

export interface QuizGradingInput {
  essay1Score: number;
  essay2Score: number;
  essay1Feedback: string;
  essay2Feedback: string;
}

export interface QuizResult {
  id?: string;
  userId?: string;
  quizId?: string;
  questionVersion?: string;
  attemptNumber?: number;
  studentName?: string;
  studentClass?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  submissionData: QuizAnswer[];
  essayAnswers: Record<number, string>;
  multipleChoiceQuestions?: number;
  wrongAnswers?: number;
  gradingStatus?: QuizGradingStatus;
  essay1Assessment?: QuizEssayAssessment;
  essay2Assessment?: QuizEssayAssessment;
  totalEssayScore?: number;
  finalScore?: number;
  gradedBy?: string;
  gradedAt?: string;
  manualEssayScore?: number;
  teacherNotes?: string;
}

export interface QuizSubmission {
  id: string;
  userId?: string;
  quizId?: string;
  questionVersion?: string;
  attemptNumber?: number;
  status?: 'submitted';
  studentName: string;
  studentClass: string;
  submittedAt: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  multipleChoiceQuestions?: number;
  wrongAnswers?: number;
  gradingStatus?: QuizGradingStatus;
  essay1Assessment?: QuizEssayAssessment;
  essay2Assessment?: QuizEssayAssessment;
  totalEssayScore?: number;
  finalScore?: number;
  gradedBy?: string;
  gradedAt?: string;
  manualEssayScore?: number;
  teacherNotes?: string;
}

export interface HomePromptResponse {
  text: string;
  submittedAt: string;
}

export interface LearningProgress {
  student: StudentIdentity | null;
  testedSolutions: string[]; // List of solution IDs tested in simulation
  worksheetRecords: Record<string, ExperimentRecord>;
  worksheetConclusion: WorksheetConclusion | null;
  homePromptResponse?: HomePromptResponse | null;
  quizResult: QuizResult | null;
  quizSubmissions: QuizSubmission[];
  readMaterials: string[]; // IDs of materials read
}

export interface StudentIdentity {
  id?: string;
  email?: string;
  name: string;
  className: string;
  role?: 'student' | 'teacher';
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
