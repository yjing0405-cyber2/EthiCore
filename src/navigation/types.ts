export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  MainTabs: { screen?: string; params?: any } | undefined;
  Chapters: undefined;
  Progress: undefined;
  Objectives: undefined;
  CourseObjectives: undefined;
  QuizHub: undefined;
  Quiz: { chapterId: number; retake?: boolean };
  QuizQuestion: { chapterId: number; retake?: boolean };
  QuizResult: {
    chapterId: number;
    score: number;
    total: number;
    userAnswers?: Array<number | string>;
    questions?: any[];
    questionScores?: number[];
    questionFeedbacks?: string[];
  };
  ScenarioGenerator: undefined;
  ScenarioGeneratorHome: undefined;
  ScenarioChapter: { chapterId: number; chapterTitle?: string };
  ScenarioEvaluation: { decision: any; scenario: any; chapterTitle?: string; step?: string };
  ConsequenceTimeline: { scenario: any; decision: any; selectedDecisionId?: string; stage?: string; chapterTitle?: string };
  DecisionOptions: { scenario: any; chapterId?: number; chapterTitle?: string };
  ChapterDetail: { chapterId: number };
  Topic: { chapterId: number; topicId: string };
  Activity: { chapterId: number; topicId: string };
};

export default RootStackParamList;
