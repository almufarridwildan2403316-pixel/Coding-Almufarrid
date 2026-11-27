import {
  QUIZ_QUESTIONS,
  QUIZ_QUESTIONS_V2_ESSAYS,
  QUIZ_QUESTIONS_V3_ESSAYS,
  QUIZ_QUESTION_VERSION,
} from '../data/evaluationQuiz';
import type { QuizAnswer, QuizEssayAssessment, QuizGradingInput, QuizQuestion } from '../types/chemistry';

export const MULTIPLE_CHOICE_QUESTION_COUNT = 10;
export const MULTIPLE_CHOICE_POINTS_PER_CORRECT = 5;
export const MULTIPLE_CHOICE_MAX_SCORE = 50;
export const ESSAY_MAX_SCORE = 25;

export const calculateMultipleChoiceScore = (correctAnswers: number): number => {
  if (!Number.isSafeInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > MULTIPLE_CHOICE_QUESTION_COUNT) {
    throw new Error('Jumlah jawaban benar pilihan ganda tidak valid.');
  }
  return correctAnswers * MULTIPLE_CHOICE_POINTS_PER_CORRECT;
};

export const gradeMultipleChoiceAnswers = (
  answers: QuizAnswer[],
  version: string,
): { correctAnswers: number; wrongAnswers: number; score: number } => {
  const questions = getQuestionsForVersion(version).filter((question) => question.type === 'multiple-choice');
  if (version !== QUIZ_QUESTION_VERSION || questions.length !== MULTIPLE_CHOICE_QUESTION_COUNT) {
    throw new Error('Kunci jawaban untuk versi evaluasi ini tidak tersedia.');
  }
  const answerById = new Map(
    answers
      .filter((answer) => answer.questionType === 'multiple-choice')
      .map((answer) => [answer.questionId, answer]),
  );
  if (answerById.size !== MULTIPLE_CHOICE_QUESTION_COUNT) {
    throw new Error('Evaluasi harus memuat tepat 10 jawaban pilihan ganda yang berbeda.');
  }
  let correctAnswers = 0;
  for (const question of questions) {
    const answer = answerById.get(question.id);
    if (!answer || typeof answer.selectedOption !== 'number' || !Number.isSafeInteger(answer.selectedOption) || answer.selectedOption < 0 || answer.selectedOption > 4) {
      throw new Error(`Jawaban pilihan ganda nomor ${question.id} tidak valid.`);
    }
    if (answer.selectedOption === question.correctIndex) correctAnswers += 1;
  }
  const wrongAnswers = MULTIPLE_CHOICE_QUESTION_COUNT - correctAnswers;
  return { correctAnswers, wrongAnswers, score: calculateMultipleChoiceScore(correctAnswers) };
};

export const getQuestionsForVersion = (version?: string): QuizQuestion[] => {
  if (version === QUIZ_QUESTION_VERSION) return QUIZ_QUESTIONS;
  const multipleChoiceQuestions = QUIZ_QUESTIONS.filter((question) => question.type === 'multiple-choice');
  if (version === 'v3') return [...multipleChoiceQuestions, ...QUIZ_QUESTIONS_V3_ESSAYS];
  if (version === 'v2') return [...multipleChoiceQuestions, ...QUIZ_QUESTIONS_V2_ESSAYS];
  return [];
};

export const getMultipleChoiceMaximumForVersion = (version?: string): number =>
  version === QUIZ_QUESTION_VERSION ? MULTIPLE_CHOICE_MAX_SCORE : 100;

export const getEssayMaximumForVersion = (version?: string): number => {
  if (version === QUIZ_QUESTION_VERSION) return ESSAY_MAX_SCORE * 2;
  if (version === 'v2' || version === 'v3') return 40;
  return 100;
};

const buildEssayAssessment = (
  question: QuizQuestion,
  score: number,
  feedback: string,
): QuizEssayAssessment => {
  if (question.type !== 'essay' || !question.rubric?.length) {
    throw new Error(`Rubrik untuk soal ${question.id} tidak tersedia.`);
  }
  if (typeof feedback !== 'string') throw new Error(`Feedback soal ${question.id} tidak valid.`);
  const maximumScore = question.rubric.reduce((total, criterion) => total + criterion.points, 0);
  if (!Number.isSafeInteger(score) || score < 0 || score > maximumScore) {
    throw new Error(`Nilai Esai ${question.id - 10} harus berupa bilangan bulat antara 0 dan ${maximumScore}.`);
  }
  return { score, feedback: feedback.trim() };
};

export const buildQuizGrading = (
  input: QuizGradingInput,
  pgScore: number,
): {
  essay1Assessment: QuizEssayAssessment;
  essay2Assessment: QuizEssayAssessment;
  totalEssayScore: number;
  finalScore: number;
} => {
  if (!Number.isSafeInteger(pgScore) || pgScore < 0 || pgScore > MULTIPLE_CHOICE_MAX_SCORE || pgScore % 5 !== 0) {
    throw new Error('Nilai pilihan ganda harus berada antara 0 dan 50.');
  }
  const essay1Question = QUIZ_QUESTIONS.find((question) => question.id === 11);
  const essay2Question = QUIZ_QUESTIONS.find((question) => question.id === 12);
  if (!essay1Question || !essay2Question) throw new Error('Rubrik evaluasi versi aktif tidak lengkap.');

  const essay1Assessment = buildEssayAssessment(essay1Question, input.essay1Score, input.essay1Feedback);
  const essay2Assessment = buildEssayAssessment(essay2Question, input.essay2Score, input.essay2Feedback);
  const totalEssayScore = essay1Assessment.score + essay2Assessment.score;
  const finalScore = pgScore + totalEssayScore;
  if (totalEssayScore > ESSAY_MAX_SCORE * 2 || finalScore > 100) {
    throw new Error('Total nilai evaluasi melebihi batas maksimum.');
  }

  return { essay1Assessment, essay2Assessment, totalEssayScore, finalScore };
};
