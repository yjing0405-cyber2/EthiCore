export type LearningStackParamList = {
  Chapters: undefined;
  ChapterDetail: { chapterId: number };
  Topic: { chapterId: number; topicId: string };
  Activity: { chapterId: number; topicId: string };
};

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

export type { RootStackParamList } from '../navigation/types';

export interface TopicBox {
  title?: string;
  items?: string[];
  text?: string;
  backgroundColor?: string;
}

export interface TopicActivityQuestion {
  id: number;
  prompt?: string;
  type: 'multiple_choice' | 'true_false' | 'written' | 'matching';
  question: string;
  options?: string[];
  correctAnswer?: number;
  expectedKeywords?: string[];
  explanation?: string;
  pairs?: Array<{
    left: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface TopicActivity {
  title?: string;
  prompt?: string;
  questions: TopicActivityQuestion[];
  passingPercentage?: number; // Minimum score required to pass (default: 75)
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  summary?: string;
  contentSummary?: string;
  quote?: string;
  alignmentTags?: string[];
  completed: boolean;
  /** Source of completion: 'learning' when user marked/finished learning content, 'activity' or 'quiz' when completed via those flows. Used to ensure learning progress counts only learning completions. */
  completedBy?: 'learning' | 'activity' | 'quiz';
  locked?: boolean;
  relatedTopics?: Array<{
    chapterId: number;
    topicId: string;
    title: string;
    chapterTitle?: string;
  }>;
  activity?: TopicActivity;
  table?: {
    leftTitle?: string;
    rightTitle?: string;
    left: string[];
    right: string[];
  };
  contentAfterTable?: string;
  box?: TopicBox;
}

export interface Chapter {
  id: number;
  order?: number;
  title: string;
  description?: string;
  topics: Topic[];
  quizCompleted: boolean;
  highestQuizScore: number;
  // Persisted quiz snapshot so retakes keep the same generated question set
  quizSnapshot?: Quiz;
  // How many times the quiz for this chapter has been attempted
  quizAttempts?: number;
  // Timestamp of the last quiz attempt (ms since epoch)
  lastQuizAttemptAt?: number;
}

export interface QuizQuestion {
  id: number;
  type?: 'multiple_choice' | 'true_false' | 'written';
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation: string;
  expectedKeywords?: string[];
}

export interface Quiz {
  id?: number;
  title?: string;
  description?: string;
  chapterId: number;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore?: number;
}

export interface Progress {
  totalTopics: number;
  completedTopics: number;
  totalChapters: number;
  completedChapters: number;
  // Independent metrics
  learningProgress: number; // percent of topics completed overall
  quizProgress: number;     // percent of quizzes attempted/completed
  activityProgress: number; // percent of activities attempted/completed
  overallProgress: number;  // combined progress across learning, quiz, and activity
  // New multi-metric fields (0-100)
  duration?: number;
  consistency?: number;
  interruptions?: number;
}

export type ActivityAnswerValue = number | string | Record<number, number> | {
  answer?: string;
  score?: number;
  feedback?: string;
};

export interface ActivityAttempt {
  chapterId: number;
  topicId: string;
  selectedAnswers: Record<string, ActivityAnswerValue>;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptedAt: number;
  // Duration of the attempt in seconds (optional)
  durationSeconds?: number;
}

export interface ScenarioHistory {
  id: string;
  scenario: string;
  decision: string;
  outcome: string;
  timestamp: number;
}
export type VerdictType = 'ethical' | 'unethical';

export interface Scenario {
  id: string;
  title: string;
  chapter?: number;
  chapterTitle?: string;
  scenarioNumber?: number;
  scenarioSetup: string;
  moral?: string;
  topics?: string[];
  additionalNotes?: {
    scenarioNumber?: number;
    [key: string]: any;
  };
  decisions?: Decision[];
}

export interface ConsequenceFields {
  immediate?: string;
  immediateExplanation?: string;
  ripple?: string;
  rippleExplanation?: string;
  longTerm?: string;
  longTermExplanation?: string;
}

export interface Decision extends ConsequenceFields {
  id: string;
  title: string;
  decisionCategory?: 'ethical' | 'unethical';
  ethical?: boolean;
  analysis?: string;
  violatedPrinciples?: string[];
  recommendedActions?: string[];
}

export interface AIEvaluationResult {
  verdict: VerdictType;
  label: string;
  reasoning: string;
  principles: string[];
  confidence: number;
  recommendations: string[];
  sentiment: number;
  alignmentWithLearningMaterial?: string;
  possibleConsequences?: string[];
  possibleBenefits?: string[];
  analyzedAt: string;
}

export interface DecisionHistory {
  id: string;
  scenarioTitle: string;
  decisionTitle: string;
  verdict: VerdictType;
  timestamp: string;
  principles: string[];
}

export interface ConsequenceStage {
  stage: 'Immediate' | 'Ripple' | 'LongTerm';
  title: string;
  description: string;
  explanation: string;
  effects: string[];
}