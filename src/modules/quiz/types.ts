export type QuizStackParamList = {
  QuizHub: undefined;
  QuizQuestion: { chapterId: number; retake?: boolean };
  Quiz: { chapterId: number; retake?: boolean };
  QuizResult: {
    chapterId: number;
    score: number;
    total: number;
    userAnswers?: Array<number | string>;
    questions?: any[];
    questionScores?: number[];
    questionFeedbacks?: string[];
  };
};
