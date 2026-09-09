import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  useWindowDimensions,
  Dimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { useBottomNavigationHeight } from '../hooks';
import { buildQuizzes } from '@/data/quizQuestions';
import type { QuizStackParamList } from '../modules/quiz/types';
import { logEvent } from '@/utils/api';
import { enqueue } from '@/utils/syncQueue';
import { APP_COLORS } from '@/theme/appTheme';
import { getChapterAccent } from '@/utils/chapterColors';
import { scoreWritingResponse } from '@/utils/quizWriting';

const { width: SCREEN_W } = Dimensions.get('window');

const COLORS = {
  bg: '#F0F4F8',
  surface: '#FFFFFF',
  primary: APP_COLORS.primary,
  primaryLight: APP_COLORS.infoLight,
  success: APP_COLORS.success,
  successLight: APP_COLORS.successLight,
  danger: APP_COLORS.danger,
  dangerLight: APP_COLORS.dangerLight,
  warning: APP_COLORS.warning,
  warningLight: APP_COLORS.warningLight,
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

type QuizScreenProps = {
  navigation: any;
  route: any;
};

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const { chapterId, retake } = route.params as any;
  const insets = useSafeAreaInsets();
  const { chapters, recordQuizTaken } = useProgress();
  const navBarHeight = useBottomNavigationHeight();
  const topInset = insets.top;
  const bottomInset = insets.bottom;
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  const circle1Anim = useRef(new Animated.ValueXY()).current;
  const circle2Anim = useRef(new Animated.ValueXY()).current;
  const circle3Anim = useRef(new Animated.ValueXY()).current;
  const guardEnabledRef = useRef(false);
  const exitAlertOpenRef = useRef(false);
  const isExitingRef = useRef(false);
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef<Animated.Value[]>([]).current;

  const chapter = chapters.find(c => c.id === chapterId);
  const quizBank = useRef(buildQuizzes(chapters)).current;
  const quiz = quizBank.find((q: { chapterId: number }) => q.chapterId === chapterId);
  const [accentMain, accentSoft] = getChapterAccent(chapterId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | string>>([]);
  const [questionScores, setQuestionScores] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotalQuestions, setQuizTotalQuestions] = useState(0);
  const [quizUserAnswers, setQuizUserAnswers] = useState<Array<number | string>>([]);
  const [showRetakePrompt, setShowRetakePrompt] = useState(!!retake);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [writtenFeedback, setWrittenFeedback] = useState<string | null>(null);
  const [writtenScore, setWrittenScore] = useState<number | null>(null);
  const [questionFeedbacks, setQuestionFeedbacks] = useState<string[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const animations = [
      Animated.loop(Animated.parallel([
        Animated.sequence([
          Animated.timing(circle1Anim.x, { toValue: 18, duration: 7800, useNativeDriver: true }),
          Animated.timing(circle1Anim.x, { toValue: -14, duration: 7600, useNativeDriver: true }),
          Animated.timing(circle1Anim.x, { toValue: 0, duration: 6200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(circle1Anim.y, { toValue: -18, duration: 7200, useNativeDriver: true }),
          Animated.timing(circle1Anim.y, { toValue: 14, duration: 7600, useNativeDriver: true }),
          Animated.timing(circle1Anim.y, { toValue: 0, duration: 6400, useNativeDriver: true }),
        ]),
      ])),
      Animated.loop(Animated.parallel([
        Animated.sequence([
          Animated.timing(circle2Anim.x, { toValue: -12, duration: 9800, delay: 1400, useNativeDriver: true }),
          Animated.timing(circle2Anim.x, { toValue: 10, duration: 8600, useNativeDriver: true }),
          Animated.timing(circle2Anim.x, { toValue: 0, duration: 6800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(circle2Anim.y, { toValue: 16, duration: 9200, delay: 1400, useNativeDriver: true }),
          Animated.timing(circle2Anim.y, { toValue: -10, duration: 8800, useNativeDriver: true }),
          Animated.timing(circle2Anim.y, { toValue: 0, duration: 7600, useNativeDriver: true }),
        ]),
      ])),
      Animated.loop(Animated.parallel([
        Animated.sequence([
          Animated.timing(circle3Anim.x, { toValue: 12, duration: 11200, delay: 2600, useNativeDriver: true }),
          Animated.timing(circle3Anim.x, { toValue: -8, duration: 9200, useNativeDriver: true }),
          Animated.timing(circle3Anim.x, { toValue: 0, duration: 7800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(circle3Anim.y, { toValue: -14, duration: 10800, delay: 2600, useNativeDriver: true }),
          Animated.timing(circle3Anim.y, { toValue: 10, duration: 9400, useNativeDriver: true }),
          Animated.timing(circle3Anim.y, { toValue: 0, duration: 7800, useNativeDriver: true }),
        ]),
      ])),
    ];
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, [circle1Anim, circle2Anim, circle3Anim]);

  const circle1TranslateX = circle1Anim.x.interpolate({ inputRange: [-14, 18], outputRange: [-14, 18] });
  const circle1TranslateY = circle1Anim.y.interpolate({ inputRange: [-18, 14], outputRange: [-18, 14] });
  const circle2TranslateX = circle2Anim.x.interpolate({ inputRange: [-12, 10], outputRange: [-12, 10] });
  const circle2TranslateY = circle2Anim.y.interpolate({ inputRange: [-10, 16], outputRange: [-10, 16] });
  const circle3TranslateX = circle3Anim.x.interpolate({ inputRange: [-8, 12], outputRange: [-8, 12] });
  const circle3TranslateY = circle3Anim.y.interpolate({ inputRange: [-14, 10], outputRange: [-14, 10] });

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuestionScores([]);
    setQuestionFeedbacks([]);
    setStarted(false);
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizTotalQuestions(0);
    setQuizUserAnswers([]);
    setWrittenAnswer('');
    setWrittenFeedback(null);
    setWrittenScore(null);
    setQuestionFeedbacks([]);
    setTimeRemainingSeconds((quiz?.timeLimit ?? 0) * 60);
    setShowRetakePrompt(!!retake);
    guardEnabledRef.current = false;
    exitAlertOpenRef.current = false;
    isExitingRef.current = false;
  }, [chapterId]);

  useEffect(() => {
    Animated.timing(cardFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [started, currentQuestion, cardFadeAnim]);

  useEffect(() => {
    if (!started) return;
    (async () => {
      try {
        await logEvent({ type: 'quiz_started', payload: { chapterId } });
      } catch {
        await enqueue({ type: 'event', payload: { type: 'quiz_started', payload: { chapterId } } });
      }
    })();
  }, [started, chapterId]);

  useEffect(() => {
    const beforeRemove = (e: any) => {
      const action = e?.data?.action;
      const destName = action?.payload?.name ?? action?.payload?.screen ?? action?.payload?.route?.name;
      const isAllowed = ['QuizResult', 'QuizHub', 'QuizQuestion', 'HomeTab', 'Home', 'Dashboard'].includes(destName);
      if (!guardEnabledRef.current || quizCompleted || showRetakePrompt || isAllowed || isExitingRef.current) return;
      if (exitAlertOpenRef.current) return;
      e.preventDefault();
      handleLeaveQuiz();
    };
    const unsub = navigation.addListener('beforeRemove', beforeRemove as any);
    return () => unsub();
  }, [navigation, started, showRetakePrompt, answers]);

  if (!chapter || !quiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Quiz not found</Text>
      </View>
    );
  }

  const allTopicsComplete = chapter?.topics?.every(t => t.completed) ?? false;
  const quizPassed = chapter?.quizCompleted && chapter.highestQuizScore >= 75;
  const activeQuiz = quiz;
  const question = activeQuiz.questions[currentQuestion];
  const totalQuestions = activeQuiz.questions.length;
  const effectiveTimeLimitMinutes = Math.max(1, totalQuestions);
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const canSubmit = question?.type === 'written' ? writtenAnswer.trim().length > 0 : selectedAnswer !== null;

  useEffect(() => {
    if (!started || !totalQuestions) return;
    Animated.timing(progressAnim, {
      toValue: ((currentQuestion + 1) / totalQuestions) * 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, started, totalQuestions]);

  useEffect(() => {
    if (!started || !quiz) return;

    const initialTime = effectiveTimeLimitMinutes * 60;
    setTimeRemainingSeconds(initialTime);

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, effectiveTimeLimitMinutes]);

  useEffect(() => {
    if (!question) return;

    const storedAnswer = answers[currentQuestion];

    if (question.type === 'written') {
      setSelectedAnswer(null);
      setWrittenAnswer(typeof storedAnswer === 'string' ? storedAnswer : '');
      setWrittenFeedback(null);
      setWrittenScore(null);
    } else {
      setSelectedAnswer(typeof storedAnswer === 'number' ? storedAnswer : null);
      setWrittenAnswer('');
      setWrittenFeedback(null);
      setWrittenScore(null);
    }

  }, [currentQuestion, question, answers]);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleWrittenAnswerChange = (text: string) => {
    setWrittenAnswer(text);
    if (!text.trim()) {
      setWrittenFeedback(null);
      setWrittenScore(null);
    }
  };

  const handleRetake = () => {
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizTotalQuestions(0);
    setQuizUserAnswers([]);
    setStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuestionScores([]);
    setQuestionFeedbacks([]);
    setShowRetakePrompt(false);
    guardEnabledRef.current = false;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion === 0) return;

    const previousQuestionIndex = currentQuestion - 1;
    const previousAnswer = answers[previousQuestionIndex];

    if (activeQuiz.questions[previousQuestionIndex]?.type === 'written') {
      setWrittenAnswer(typeof previousAnswer === 'string' ? previousAnswer : '');
      setWrittenFeedback(null);
      setWrittenScore(null);
    } else {
      setSelectedAnswer(typeof previousAnswer === 'number' ? previousAnswer : null);
    }

    setCurrentQuestion(previousQuestionIndex);
  };

  // ───────────────────────────────────────────────
  // FIXED: Replace answers at currentQuestion index
  // instead of appending. Prevents double-counting
  // when navigating Previous → Next.
  // ───────────────────────────────────────────────
  const handleSubmit = async (overrideAnswer?: number | string, skipSelectionValidation = false) => {
    const currentQuestionType = question?.type ?? 'multiple_choice';
    const answerValue = typeof overrideAnswer === 'number' || typeof overrideAnswer === 'string'
      ? overrideAnswer
      : currentQuestionType === 'written'
        ? writtenAnswer
        : selectedAnswer;

    if (currentQuestionType === 'written') {
      if (!writtenAnswer.trim()) {
        Alert.alert('Write a response', 'Please enter a short explanation before continuing.');
        return;
      }

      const result = scoreWritingResponse(writtenAnswer, question.expectedKeywords ?? []);
      setWrittenScore(result.score);
      setWrittenFeedback(result.feedback);

      // FIX: write to currentQuestion index, never append
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = writtenAnswer;

      const updatedQuestionScores = [...questionScores];
      updatedQuestionScores[currentQuestion] = result.score;

      const updatedQuestionFeedbacks = [...questionFeedbacks];
      updatedQuestionFeedbacks[currentQuestion] = result.feedback;

      setAnswers(updatedAnswers);
      setQuestionScores(updatedQuestionScores);
      setQuestionFeedbacks(updatedQuestionFeedbacks);

      if (isLastQuestion) {
        const correctCount = updatedQuestionScores.filter(score => score >= 65).length;
        const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        await recordQuizTaken(chapterId, scorePercent);
        setQuizCompleted(true);
        setStarted(false);
        setShowRetakePrompt(false);
        guardEnabledRef.current = false;

        (async () => {
          try {
            await logEvent({ type: 'quiz_completed', payload: { chapterId, scorePercent } });
          } catch {
            await enqueue({ type: 'event', payload: { type: 'quiz_completed', payload: { chapterId, scorePercent } } });
          }
        })();

        navigation.navigate('QuizResult', {
          chapterId,
          score: correctCount,
          total: totalQuestions,
          userAnswers: updatedAnswers,
          questionScores: updatedQuestionScores,
          questionFeedbacks: updatedQuestionFeedbacks,
          questions: activeQuiz.questions,
        });
        setSelectedAnswer(null);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setWrittenAnswer('');
        setWrittenFeedback(null);
        setWrittenScore(null);
      }
      return;
    }

    if (!skipSelectionValidation && answerValue === null) {
      Alert.alert('Select an answer', 'Please choose an answer before continuing.');
      return;
    }

    const chosenAnswer = typeof answerValue === 'number' ? answerValue : selectedAnswer;

    // FIX: write to currentQuestion index, never append
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = chosenAnswer ?? -1;

    const updatedQuestionScores = [...questionScores];
    updatedQuestionScores[currentQuestion] = chosenAnswer === question.correctAnswer ? 100 : 0;

    const updatedQuestionFeedbacks = [...questionFeedbacks];
    updatedQuestionFeedbacks[currentQuestion] = question.explanation ?? '';

    setAnswers(updatedAnswers);
    setQuestionScores(updatedQuestionScores);
    setQuestionFeedbacks(updatedQuestionFeedbacks);

    if (isLastQuestion) {
      const correctCount = updatedQuestionScores.filter(score => score >= 65).length;
      const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      await recordQuizTaken(chapterId, scorePercent);
      setQuizCompleted(true);
      setStarted(false);
      setShowRetakePrompt(false);
      guardEnabledRef.current = false;

      (async () => {
        try {
          await logEvent({ type: 'quiz_completed', payload: { chapterId, scorePercent } });
        } catch {
          await enqueue({ type: 'event', payload: { type: 'quiz_completed', payload: { chapterId, scorePercent } } });
        }
      })();

      navigation.navigate('QuizResult', {
        chapterId,
        score: correctCount,
        total: totalQuestions,
        userAnswers: updatedAnswers,
        questionScores: updatedQuestionScores,
        questionFeedbacks: updatedQuestionFeedbacks,
        questions: activeQuiz.questions,
      });
      setSelectedAnswer(null);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const formatTimeLabel = (seconds: number | null) => {
    if (seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const goToQuizHub = () => {
    navigation.navigate('MainTabs', {
      screen: 'Quiz',
    });
  };

  const handleLeaveQuiz = () => {
    if (!guardEnabledRef.current || quizCompleted || showRetakePrompt) {
      exitAlertOpenRef.current = false;
      isExitingRef.current = true;
      goToQuizHub();
      return;
    }

    if (exitAlertOpenRef.current) return;
    exitAlertOpenRef.current = true;

    Alert.alert(
      'Exit quiz?',
      'Your progress will be lost. Are you sure?',
      [
        {
          text: 'Stay',
          style: 'cancel',
          onPress: () => {
            exitAlertOpenRef.current = false;
            isExitingRef.current = false;
          },
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            exitAlertOpenRef.current = false;
            isExitingRef.current = true;
            goToQuizHub();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Ambient Background */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateX: circle1TranslateX }, { translateY: circle1TranslateY }] }]} />
        <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateX: circle2TranslateX }, { translateY: circle2TranslateY }] }]} />
        <Animated.View style={[styles.orb, styles.orb3, { transform: [{ translateX: circle3TranslateX }, { translateY: circle3TranslateY }] }]} />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: 8 + topInset }]}> 
        <TouchableOpacity style={styles.headerBackButton} onPress={handleLeaveQuiz}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerChapter}>Chapter {chapter.id}</Text>
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: navBarHeight + 180, paddingHorizontal: isCompact ? 16 : 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ── INTRO STATE ── */}
        {!started && (
          <Animated.View style={{ opacity: cardFadeAnim }}>
            {/* Chapter Context */}
            <View style={styles.chapterContextCard}>
              <View style={styles.chapterContextIcon}>
                <Ionicons name="book-outline" size={20} color={accentMain} />
              </View>
              <View style={styles.chapterContextText}>
                <Text style={styles.chapterContextLabel}>Chapter</Text>
                <Text style={styles.chapterContextTitle} numberOfLines={2}>{chapter.title}</Text>
              </View>
            </View>

            {/* Quiz Start Card */}
            <View style={styles.startCard}>
              <View style={styles.startCardVisual}>
                <View style={[styles.startCardIconWrap, !allTopicsComplete && styles.startCardIconWrapDisabled]}>
                  <Ionicons name="help-circle-outline" size={32} color={allTopicsComplete ? accentMain : COLORS.textMuted} />
                </View>
                <Text style={styles.startCardTitle}>Chapter Quiz</Text>
                <Text style={styles.startCardSubtitle}>
                  {totalQuestions} questions · {Math.ceil(totalQuestions * 0.75)} correct to pass
                </Text>
              </View>

              <View style={styles.startCardDivider} />

              <View style={styles.startCardActions}>
                <View style={styles.startCardMetaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="list-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.metaBadgeText}>{totalQuestions} Qs</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.metaBadgeText}>~{effectiveTimeLimitMinutes} min</Text>
                  </View>
                </View>

                <TouchableOpacity
                    style={[styles.startButton, !allTopicsComplete && styles.startButtonDisabled, { backgroundColor: accentMain }]}
                  onPress={() => {
                    setShowRetakePrompt(false);
                    setStarted(true);
                    guardEnabledRef.current = true;
                  }}
                  disabled={!allTopicsComplete}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startButtonText}>
                    {allTopicsComplete ? 'Start Quiz' : 'Locked'}
                  </Text>
                  {allTopicsComplete && <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>

                {!allTopicsComplete && (
                  <View style={styles.lockNotice}>
                    <Ionicons name="lock-closed-outline" size={14} color={COLORS.danger} />
                    <Text style={styles.lockNoticeText}>Complete all topics to unlock</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Best Score Card */}
            {chapter.quizCompleted && (
              <View style={styles.scoreHistoryCard}>
                <View style={styles.scoreHistoryHeader}>
                  <Ionicons name="trophy-outline" size={16} color="#F59E0B" />
                  <Text style={styles.scoreHistoryLabel}>Best Score</Text>
                </View>
                <View style={styles.scoreHistoryBody}>
                  <Text style={[styles.scoreHistoryValue, quizPassed ? styles.scoreHistoryPassed : styles.scoreHistoryFailed]}>
                    {chapter.highestQuizScore}%
                  </Text>
                  <View style={[styles.scoreHistoryPill, quizPassed ? styles.scoreHistoryPillPassed : styles.scoreHistoryPillFailed]}>
                    <Text style={[styles.scoreHistoryPillText, quizPassed ? styles.scoreHistoryPillTextPassed : styles.scoreHistoryPillTextFailed]}>
                      {quizPassed ? 'Passed' : 'Failed'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── ACTIVE QUIZ STATE ── */}
        {started && (
          <View>
            {/* Progress */}
            <Animated.View style={[styles.progressWrap, { opacity: cardFadeAnim }]}> 
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Question {currentQuestion + 1}</Text>
                <View style={styles.progressMeta}>
                  <Text style={styles.progressFraction}>{currentQuestion + 1}/{totalQuestions}</Text>
                  {quiz.timeLimit ? (
                    <View style={[styles.timerBadge, (timeRemainingSeconds ?? 0) <= 30 && styles.timerBadgeWarning]}>
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color={(timeRemainingSeconds ?? 0) <= 30 ? COLORS.danger : COLORS.textSecondary}
                      />
                      <Text style={[styles.progressTimer, (timeRemainingSeconds ?? 0) <= 30 && styles.progressTimerWarning]}>
                        {formatTimeLabel(timeRemainingSeconds)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
                  ]}
                />
              </View>
            </Animated.View>

            {/* Question */}
            <Animated.View style={[styles.questionCard, { opacity: cardFadeAnim }]}>
              <Text style={styles.questionText}>{question.question}</Text>
            </Animated.View>

            {/* Options */}
            {question.type === 'written' ? (
              <View style={styles.writtenWrap}>
                <TextInput
                  style={styles.writtenInput}
                  value={writtenAnswer}
                  onChangeText={handleWrittenAnswerChange}
                  placeholder="Write a short answer here..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {writtenFeedback ? (
                  <View style={styles.writtenFeedbackCard}>
                    <Text style={styles.writtenFeedbackTitle}>System feedback</Text>
                    <Text style={styles.writtenFeedbackText}>{writtenFeedback}</Text>
                    {writtenScore !== null && (
                      <Text style={styles.writtenScoreText}>Score: {writtenScore}%</Text>
                    )}
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.optionsWrap}>
                {question.options?.map((option: string, index: number) => {
                  const isSelected = index === selectedAnswer;
                  return (
                    <TouchableOpacity
                      key={`ch${chapterId}-q${currentQuestion}-opt${index}`}
                      style={[
                        styles.option,
                        isSelected && styles.optionSelected,
                        isSelected && { borderColor: accentMain, backgroundColor: `${accentMain}14` },
                      ]}
                      onPress={() => handleSelectAnswer(index)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected, isSelected && { backgroundColor: accentMain }]}> 
                        <Text style={[styles.optionLetterText, isSelected && styles.optionLetterTextSelected]}>
                          {getOptionLetter(index)}
                        </Text>
                      </View>
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected, isSelected && { color: accentMain }]}> 
                        {option}
                      </Text>
                      {isSelected && (
                        <View style={styles.optionCheck}>
                          <Ionicons name="checkmark-circle-outline" size={22} color={accentMain} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Submit */}
      {started && (
        <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 32 + bottomInset : 24 + bottomInset }]}> 
          <View style={styles.footerActions}>
            {currentQuestion > 0 ? (
              <TouchableOpacity style={styles.prevBtn} onPress={handlePreviousQuestion} activeOpacity={0.85}>
                <Ionicons name="arrow-back-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.prevBtnText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.footerSpacer} />
            )}

            <TouchableOpacity
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled, { backgroundColor: accentMain }]}
              onPress={() => handleSubmit()}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              </Text>
              {!isLastQuestion && <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  notFoundText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },

  // ── Ambient Background ──
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5,
  },
  orb1: {
    width: 280,
    height: 280,
    top: -80,
    right: -60,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  orb2: {
    width: 200,
    height: 200,
    top: 180,
    left: -80,
    backgroundColor: 'rgba(16, 185, 129, 0.07)',
  },
  orb3: {
    width: 160,
    height: 160,
    bottom: 120,
    right: -40,
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerChapter: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 40,
  },

  // ── Scroll ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },

  // ── Chapter Context ──
  chapterContextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    },
  chapterContextIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterContextText: {
    flex: 1,
  },
  chapterContextLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  chapterContextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  // ── Start Card ──
  startCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    },
  startCardVisual: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  startCardIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  startCardIconWrapDisabled: {
    backgroundColor: COLORS.borderLight,
  },
  startCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  startCardSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  startCardDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
  },
  startCardActions: {
    padding: 20,
  },
  startCardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    },
  startButtonDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  lockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  lockNoticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.danger,
  },

  // ── Score History ──
  scoreHistoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreHistoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scoreHistoryBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreHistoryValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  scoreHistoryPassed: {
    color: COLORS.success,
  },
  scoreHistoryFailed: {
    color: COLORS.danger,
  },
  scoreHistoryPill: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  scoreHistoryPillPassed: {
    backgroundColor: COLORS.successLight,
  },
  scoreHistoryPillFailed: {
    backgroundColor: COLORS.dangerLight,
  },
  scoreHistoryPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreHistoryPillTextPassed: {
    color: '#047857',
  },
  scoreHistoryPillTextFailed: {
    color: '#B91C1C',
  },

  // ── Progress ──
  progressWrap: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressFraction: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timerBadgeWarning: {
    backgroundColor: COLORS.dangerLight,
  },
  progressTimer: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  progressTimerWarning: {
    color: COLORS.danger,
  },

  progressTrack: {
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  // ── Question ──
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },

  // ── Written Response ──
  writtenWrap: {
    gap: 12,
  },
  writtenInput: {
    minHeight: 130,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  writtenFeedbackCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  writtenFeedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  writtenFeedbackText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  writtenScoreText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },

  // ── Options ──
  optionsWrap: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionLetterSelected: {
    backgroundColor: COLORS.primary,
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  optionLetterTextSelected: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionCheck: {
    marginLeft: 8,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  footerSpacer: {
    flex: 1,
  },
  prevBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    },
  submitBtnDisabled: {
    backgroundColor: COLORS.border,
    shadowOpacity: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default QuizScreen;