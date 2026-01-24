// Quiz utility functions for randomizing answers
import { QuizQuestion } from './quizData';

export interface ShuffledQuizQuestion extends Omit<QuizQuestion, 'correctOptionIndex'> {
  options: string[];
  correctOptionIndex: number;
  originalQuestion: QuizQuestion;
}

/**
 * Fisher-Yates shuffle algorithm
 */
const shuffleArray = <T>(array: T[]): { shuffled: T[]; indexMap: number[] } => {
  const shuffled = [...array];
  const indexMap = array.map((_, i) => i);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    [indexMap[i], indexMap[j]] = [indexMap[j], indexMap[i]];
  }
  
  return { shuffled, indexMap };
};

/**
 * Shuffles the options of a quiz question and returns a new question
 * with randomized option order and updated correct answer index
 */
export const shuffleQuestionOptions = (question: QuizQuestion): ShuffledQuizQuestion => {
  const { shuffled, indexMap } = shuffleArray(question.options);
  
  // Find the new position of the correct answer
  const newCorrectIndex = indexMap.indexOf(question.correctOptionIndex);
  
  return {
    ...question,
    options: shuffled,
    correctOptionIndex: newCorrectIndex,
    originalQuestion: question,
  };
};

/**
 * Shuffles options for all questions in an array
 */
export const shuffleAllQuestions = (questions: QuizQuestion[]): ShuffledQuizQuestion[] => {
  return questions.map(shuffleQuestionOptions);
};

/**
 * Get letter label for option index (A, B, C, D)
 */
export const getOptionLabel = (index: number): string => {
  return String.fromCharCode(65 + index); // 65 = 'A'
};

/**
 * Validate that answers are sufficiently randomized across questions
 * Returns true if answers are distributed across all options
 */
export const validateAnswerDistribution = (questions: ShuffledQuizQuestion[]): boolean => {
  if (questions.length < 4) return true;
  
  const answerCounts = [0, 0, 0, 0];
  questions.forEach(q => {
    if (q.correctOptionIndex >= 0 && q.correctOptionIndex < 4) {
      answerCounts[q.correctOptionIndex]++;
    }
  });
  
  // Check that no single option has more than 50% of the answers
  const maxAllowed = Math.ceil(questions.length / 2);
  return !answerCounts.some(count => count > maxAllowed);
};
