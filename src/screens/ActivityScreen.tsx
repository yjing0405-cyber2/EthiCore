import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { loadActivityAttempt } from '../utils/storage';
import type { LearningStackParamList, ActivityAnswerValue, ActivityAttempt } from '../types';


type ActivityScreenProps = {
  navigation: StackNavigationProp<LearningStackParamList, 'Activity'>;
  route: RouteProp<LearningStackParamList, 'Activity'>;
};

type ShuffledOption = {
  text: string;
  originalIndex: number;
};

type ShuffledQuestion = {
  id: number;
  type: string;
  question: string;
  prompt?: string;
  correctAnswer?: number;
  options?: ShuffledOption[];
  explanation?: string;
};

const shuffleArray = <T,>(items: T[]) => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const ActivityScreen: React.FC<ActivityScreenProps> = ({ navigation, route }) => {
  const { chapterId, topicId } = route.params;
  const insets = useSafeAreaInsets();
  const { chapters, markTopicComplete, recordActivityTaken } = useProgress();
  const chapter = chapters.find(c => c.id === chapterId);
  const topic = chapter?.topics.find(t => t.id === topicId);
  const activity = topic?.activity;

  const currentTopicIndex = chapter?.topics.findIndex(t => t.id === topicId) ?? -1;
  const nextTopic = currentTopicIndex >= 0 && chapter && currentTopicIndex < chapter.topics.length - 1
    ? chapter.topics[currentTopicIndex + 1]
    : undefined;
  const nextChapter = chapters.find(c => c.id === chapterId + 1);
  const nextTopicRoute = nextTopic
    ? { chapterId, topicId: nextTopic.id }
    : nextChapter?.topics?.[0]
      ? { chapterId: nextChapter.id, topicId: nextChapter.topics[0].id }
      : null;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, ActivityAnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState<ActivityAttempt | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  // Track when the user started this activity to measure duration
  const [startTime, setStartTime] = useState<number>(Date.now());

  const shuffleActivityQuestions = () => {
    if (!activity) {
      setShuffledQuestions([]);
      return;
    }

    const cappedQuestions = activity.questions.slice(0, 10);
    const shuffledQuestionOrder = shuffleArray(cappedQuestions);

    setShuffledQuestions(
      shuffledQuestionOrder.map(question => ({
        ...question,
        options: question.options
          ? shuffleArray(question.options.map((text, originalIndex) => ({ text, originalIndex })))
          : undefined,
      }))
    );
  };

  useEffect(() => {
    let mounted = true;

    const restoreLatestAttempt = async () => {
      const savedAttempt = await loadActivityAttempt(chapterId, topicId);
      if (!mounted) {
        return;
      }

      if (savedAttempt) {
        setLatestAttempt(savedAttempt);
        setSelectedAnswers(savedAttempt.selectedAnswers);
        setSubmitted(false);
        setShuffledQuestions([]);
      } else {
        shuffleActivityQuestions();
      }

      // reset start time when restoring or starting a fresh activity
      setStartTime(Date.now());
    };

    restoreLatestAttempt();

    return () => {
      mounted = false;
    };
  }, [chapterId, topicId]);


  if (!chapter || !topic || !activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No activity available for this topic.</Text>
      </View>
    );
  }

  const calculateScore = (answers = selectedAnswers) => {
    const cappedQuestions = activity.questions.slice(0, 10);
    let correctAnswers = 0;

    cappedQuestions.forEach(question => {
      const questionKey = String(question.id);
      const selected = answers[questionKey];

      if (selected === question.correctAnswer) correctAnswers++;
    });

    const percentage = Math.round((correctAnswers / cappedQuestions.length) * 100);
    return { correctAnswers, totalQuestions: cappedQuestions.length, percentage };
  };

  const getScoreStatus = () => {
    return true;
  };

  const handleCompleteActivity = async () => {
    // Mark the current topic complete on activity completion, regardless of score.
    await markTopicComplete(chapterId, topicId, true, 'activity', false);

    if (nextTopicRoute) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Chapters' },
            { name: 'ChapterDetail', params: { chapterId } },
          ],
        })
      );
      navigation.navigate('Topic', nextTopicRoute);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Chapters' },
            { name: 'ChapterDetail', params: { chapterId } },
          ],
        })
      );
    }
  };

  const handleSelectAnswer = (questionId: number, answerIndex: number, pairIndex?: number) => {
    if (submitted || latestAttempt) {
      return;
    }

    setSelectedAnswers(prev => {
      const questionKey = String(questionId);

      if (pairIndex !== undefined) {
        const currentPairAnswers = (prev[questionKey] as Record<number, number> | undefined) || {};
        return {
          ...prev,
          [questionKey]: {
            ...currentPairAnswers,
            [pairIndex]: answerIndex,
          },
        };
      }

      return {
        ...prev,
        [questionKey]: answerIndex,
      };
    });
    setSubmitted(false);
  };



  const handleCheckAnswers = async () => {
    if (!isActivityFinished() || submitted || !!latestAttempt) {
      return;
    }

    const score = calculateScore();
    const durationSeconds = Math.max(0, Math.round((Date.now() - startTime) / 1000));

    const attempt: ActivityAttempt = {
      chapterId,
      topicId,
      selectedAnswers,
      ...score,
      passed: true,
      attemptedAt: Date.now(),
      durationSeconds,
    };

    setLatestAttempt(attempt);
    await recordActivityTaken(attempt, false);
    setSubmitted(true);
  };

  const handleRetakePress = () => {
    if (latestAttempt || submitted) {
      setShowRetakeWarning(true);
    }
  };

  const confirmRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setLatestAttempt(null);
    setShowRetakeWarning(false);
    shuffleActivityQuestions();
    setStartTime(Date.now());
  };

  const cancelRetake = () => {
    setShowRetakeWarning(false);
  };

  const isActivityFinished = () =>
    activity.questions.every(question => {
      const answer = selectedAnswers[String(question.id)];
      return typeof answer === 'number';
    });

  const getQuestionExplanation = (question: ShuffledQuestion) => {
    if (question.explanation?.trim()) {
      return question.explanation.trim();
    }

    const correctOptionText = question.options?.find(option => option.originalIndex === question.correctAnswer)?.text;
    const selectedText = typeof selectedAnswers[String(question.id)] === 'number'
      ? question.options?.find(option => option.originalIndex === selectedAnswers[String(question.id)])?.text
      : undefined;

    const coreReason = question.question.toLowerCase().includes('privacy')
      ? 'It best protects people’s privacy, consent, and responsible data handling.'
      : question.question.toLowerCase().includes('ethic')
        ? 'It best reflects ethical judgment, fairness, honesty, or professional responsibility.'
        : question.question.toLowerCase().includes('law') || question.question.toLowerCase().includes('rule')
          ? 'It aligns with the governing rule, principle, or legal duty described in the topic.'
          : 'It matches the strongest learning principle in the topic and is the most defensible choice.';

    return `The correct answer is "${correctOptionText ?? 'the best-supported option'}". ${coreReason} ${selectedText ? `Your selected choice was "${selectedText}".` : ''}`;
  };

  const renderQuestion = (question: ShuffledQuestion, index: number) => {
    const questionKey = String(question.id);
    const selected = selectedAnswers[questionKey];
    const topicPrefix = `ch${chapterId}-t${topicId.replace(/\./g, '-')}`;

    return (
      <View key={`${topicPrefix}-q${question.id}`} style={styles.questionCard}>
        <Text style={styles.questionNumber}>Question {index + 1}</Text>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.options?.map((option) => {
          const optionSelected = selected === option.originalIndex;
          const isCorrect =
            submitted &&
            question.correctAnswer !== undefined &&
            option.originalIndex === question.correctAnswer;
          const isWrong =
            submitted &&
            optionSelected &&
            question.correctAnswer !== undefined &&
            option.originalIndex !== question.correctAnswer;

          return (
            <TouchableOpacity
              key={`${topicPrefix}-q${question.id}-opt${option.originalIndex}`}
              style={[
                styles.optionButton,
                optionSelected && styles.optionButtonSelected,
                isCorrect && styles.optionButtonCorrect,
                isWrong && styles.optionButtonWrong,
              ]}
              onPress={() => handleSelectAnswer(question.id, option.originalIndex)}
              disabled={submitted || !!latestAttempt}
            >
              <Text style={[styles.optionText, optionSelected && styles.optionTextSelected]}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}

        {submitted && question.correctAnswer !== undefined && (
          <View style={styles.feedbackCard}>
            <Text style={styles.answerFeedback}>
              {selected === question.correctAnswer ? 'Correct answer!' : 'Try again — review the topic.'}
            </Text>
            <Text style={styles.explanationText}>{getQuestionExplanation(question)}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerCard}>
          <View style={styles.headerCardTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerLabel}>Topic Activity</Text>
              <Text style={styles.headerTitle}>{activity.title || topic.title}</Text>
              <Text style={styles.headerSubtitle}>{chapter.title}</Text>
            </View>
          </View>
        </View>

        {activity.prompt ? (
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{activity.prompt}</Text>
          </View>
        ) : null}

        {(shuffledQuestions.length > 0 ? shuffledQuestions : activity.questions.map(question => ({
          ...question,
          options: question.options?.map((text, originalIndex) => ({ text, originalIndex })),
        }))).map((question, index) => renderQuestion(question, index))}

        {!showRetakeWarning && (
          <>
            {!submitted && !latestAttempt && (
              <TouchableOpacity
                style={[styles.submitButton, !isActivityFinished() && styles.submitButtonDisabled]}
                onPress={handleCheckAnswers}
                disabled={!isActivityFinished() || submitted || !!latestAttempt}
              >
                <Text style={[styles.submitButtonText, (!isActivityFinished() || submitted || !!latestAttempt) && styles.submitButtonTextDisabled]}>
                  Check Answers
                </Text>
              </TouchableOpacity>
            )}

            {(submitted || latestAttempt) && (
              <TouchableOpacity
                style={[styles.submitButton, styles.retryButton]}
                onPress={handleRetakePress}
              >
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>Retake Activity</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {(submitted || latestAttempt) && (
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Ionicons name="trophy" size={24} color="#10B981" />
            </View>
            {(() => {
              const { correctAnswers, totalQuestions, percentage } =
                submitted ? calculateScore() : latestAttempt ?? calculateScore();
              return (
                <>
                  <View style={styles.scoreDisplay}>
                    <Text style={styles.scorePercentage}>{percentage}%</Text>
                    <Text style={styles.scoreBreakdown}>{correctAnswers} out of {totalQuestions} questions correct</Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.submitButton, styles.completeButton]} 
                    onPress={handleCompleteActivity}
                  >
                    <View style={styles.completeButtonContent}>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                      <Text style={styles.submitButtonText}>Continue to the Next Topic</Text>
                    </View>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        )}

        <Modal
          transparent
          visible={showRetakeWarning}
          animationType="fade"
          onRequestClose={cancelRetake}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>Retake Activity?</Text>
              <Text style={styles.warningText}>
                This activity has already been completed. Are you sure you want to retake it? Your previous answers and progress may be overwritten.
              </Text>
              <View style={styles.warningButtons}>
                <TouchableOpacity style={styles.warningCancelButton} onPress={cancelRetake}>
                  <Text style={styles.warningCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.warningConfirmButton} onPress={confirmRetake}>
                  <Text style={styles.warningConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  emptyText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  promptCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionNumber: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
    marginBottom: 6,
  },
  questionText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#60A5FA',
  },
  optionButtonCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  optionButtonWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
  },
  optionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },

  feedbackCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  answerFeedback: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  completeButton: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  warningCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  warningButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  warningCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  warningCancelText: {
    color: '#334155',
    fontWeight: '600',
  },
  warningConfirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#DC2626',
  },
  warningConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '800',
    color: '#3B82F6',
    marginBottom: 4,
  },
  scoreBreakdown: {
    fontSize: 14,
    color: '#64748B',
  },
  passRequirement: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  passText: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#F97316',
  },
});

export default ActivityScreen;
