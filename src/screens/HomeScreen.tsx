import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgress } from '../context/ProgressContext';
import type { RootStackParamList } from '../navigation/types';
import { ProgressTracker, HomeScreenSkeleton, CourseCompletionModal } from '../components';
import { loadCompletionModalDismissed, saveCompletionModalDismissed } from '../utils/storage';
import { Ionicons } from '../components/Ionicons';
import { APP_COLORS } from '../theme/appTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  // Background
  bg: {
    primary: '#F0F4F8',
    secondary: '#F8FAFC',
    card: '#FFFFFF',
  },
  // Hero gradient (purple-blue from video)
  hero: {
    start: '#4F46E5',
    mid: '#6366F1',
    end: '#7C3AED',
  },
  // Module card pastels (from video)
  module: {
    objectives: { bg: '#fefed29f', icon: '#c88738', text: '#c88738' },
    learning:   { bg: '#FFF4F1', icon: '#FF6B6B', text: '#B42318' },
    quiz:       { bg: '#F2FFF6', icon: '#34C759', text: '#166534' },
    scenarios:  { bg: '#F4F9FF', icon: '#0F62FF', text: '#1D4ED8' },
  },
  // Text
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    muted: '#94A3B8',
    white: '#FFFFFF',
  },
  // Accents
  accent: {
    blue: '#3B82F6',
    indigo: '#4F46E5',
    emerald: '#10B981',
    rose: '#F43F5E',
  },
  // Progress
  progress: {
    track: '#E2E8F0',
    fill: '#10B981',
  },
};

const quoteSlides = [
  { text: '"Ethics is knowing the difference between what you have a right to do and what is right to do."', author: '— Potter Stewart' },
  { text: '"The time is always right to do what is right."', author: '— Martin Luther King Jr.' },
  { text: '"Integrity is doing the right thing, even when no one is watching."', author: '— H. Jackson Brown Jr.' },
  { text: '"Character is what you do when no one is watching."', author: '— John Wooden' },
];

/* ═══════════════════════════════════════════════
   Floating Orb — Subtle ambient effect
   ═══════════════════════════════════════════════ */
interface OrbProps {
  size: number; color: string;
  position: { top?: number; bottom?: number; left?: number; right?: number };
  duration: number; delay?: number;
  translateRange: [number, number];
}

const FloatingOrb: React.FC<OrbProps> = ({ size, color, position, duration, delay = 0, translateRange }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [anim, duration, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: translateRange });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.7, 0.4] });

  return (
    <Animated.View pointerEvents="none" style={[styles.orb, { width: size, height: size, backgroundColor: color, ...position, opacity }, { transform: [{ translateY }] }]} />
  );
};

/* ═══════════════════════════════════════════════
   Module Card — Pastel version matching video
   ═══════════════════════════════════════════════ */
interface ModuleCardProps {
  icon: string;
  colors: { bg: string; icon: string; text: string };
  title: string;
  subtitle: string;
  onPress: () => void;
  index: number;
  progress?: { completed: number; total: number };
}

const ModuleCard: React.FC<ModuleCardProps> = ({ icon, colors, title, subtitle, onPress, index, progress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = 200 + index * 100;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, index]);

  const handlePressIn = () => {
    Animated.timing(pressAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(pressAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.moduleCardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.moduleCardTouchable}>
        <Animated.View
          style={[
            styles.moduleCardInner,
            {
              backgroundColor: colors.bg,
              borderColor: colors.icon + '35',
              borderWidth: 1.2,
            },
            { transform: [{ scale: pressAnim }] },
          ]}
        >
          <View style={styles.moduleTopRow}>
            <View style={[styles.moduleIconBg, { backgroundColor: colors.icon + '20' }]}>
              <Ionicons name={icon as any} size={22} color={colors.icon} />
            </View>
            <View style={[styles.moduleArrow, { backgroundColor: colors.icon + '15' }]}>
              <Ionicons name="arrow-forward" size={12} color={colors.icon} />
            </View>
          </View>
          <Text style={[styles.moduleCardTitle, { color: colors.text }]} numberOfLines={2}>{title}</Text>
          {progress && progress.total > 0 && (
            <View style={styles.moduleProgressBox}>
              <View style={styles.moduleProgressTrack}>
                <View style={[styles.moduleProgressFill, { width: `${(progress.completed / progress.total) * 100}%`, backgroundColor: colors.icon }]} />
              </View>
              <Text style={[styles.moduleProgressText, { color: colors.text + 'AA' }]}>{progress.completed}/{progress.total}</Text>
            </View>
          )}
          <Text style={[styles.moduleCardSubtitle, { color: colors.text + '99' }]}>{subtitle}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ═══════════════════════════════════════════════
   Main Screen — Light theme matching video
   ═══════════════════════════════════════════════ */
type HomeScreenProps = { navigation: StackNavigationProp<RootStackParamList, 'Home'> };

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { progress, chapters, lastVisitedTopic } = useProgress();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const quoteFade = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => { 
    StatusBar.setBarStyle('dark-content');
    const t = setTimeout(() => setIsLoading(false), 600); 
    return () => clearTimeout(t); 
  }, []);

  useEffect(() => {
    (async () => {
      const dismissed = await loadCompletionModalDismissed();
      setShowCompletionModal(false);
    })();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(heroFade, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
      Animated.timing(heroScale, { toValue: 1, duration: 600, delay: 100, useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerSlide, heroFade, heroScale]);

  const completedTopics = useMemo(() => chapters.reduce((acc, ch) => acc + ch.topics.filter(t => t.completed).length, 0), [chapters]);
  const totalTopics = useMemo(() => chapters.reduce((acc, ch) => acc + ch.topics.length, 0), [chapters]);
  const attemptedQuizzes = useMemo(() => chapters.filter(ch => ch.quizCompleted || (ch.quizAttempts ?? 0) > 0).length, [chapters]);
  const totalQuizzes = chapters.length;
  const clampedChapterScores = chapters.map(ch => Math.min(100, Math.max(0, ch.highestQuizScore ?? 0)));
  const bestScore = clampedChapterScores.length > 0 ? Math.max(...clampedChapterScores) : 0;

  const learningPercentage = totalTopics > 0 ? Math.min(100, Math.max(0, Math.round((completedTopics / totalTopics) * 100))) : 0;
  const quizPercentage = progress.quizProgress ?? (totalQuizzes > 0 ? Math.round((attemptedQuizzes / totalQuizzes) * 100) : 0);
  const activitiesPercentage = progress.activityProgress ?? 0;
  const displayOverallProgress = progress.overallProgress;

  const ringSize = Math.min(180, Math.floor(SCREEN_WIDTH * 0.34));

  const navigateToTab = useCallback((tabName: 'LearningTab' | 'ObjectivesTab' | 'QuizTab' | 'ScenarioTab') => {
    switch (tabName) {
      case 'ObjectivesTab':
        navigation.navigate('MainTabs', {
          screen: 'Objectives',
        });
        return;
      case 'LearningTab':
        navigation.navigate('MainTabs', { screen: 'Learn' });
        return;
      case 'QuizTab':
        navigation.navigate('MainTabs', { screen: 'Quiz' });
        return;
      case 'ScenarioTab':
        navigation.navigate('MainTabs', { screen: 'Scenarios' });
        return;
    }
  }, [navigation]);

  const navigateToTopic = useCallback((chapterId: number, topicId: string) => {
    navigation.navigate('MainTabs', {
      screen: 'Learn',
      params: { screen: 'Topic', params: { chapterId, topicId } },
    });
  }, [navigation]);

  const resumeTopic = useMemo(() => {
    if (!lastVisitedTopic) return null;
    const savedChapter = chapters.find(ch => ch.id === lastVisitedTopic.chapterId);
    const topicIndex = savedChapter?.topics.findIndex(t => t.id === lastVisitedTopic.topicId) ?? -1;
    const savedTopic = savedChapter?.topics[topicIndex];
    if (!savedChapter || topicIndex === -1 || !savedTopic) return null;
    const previousTopicsCount = chapters.filter(ch => ch.id < savedChapter.id).reduce((count, ch) => count + ch.topics.length, 0);
    const lessonNumber = previousTopicsCount + topicIndex + 1;
    const chapterCompletedCount = savedChapter.topics.filter(t => t.completed).length;
    const chapterProgress = savedChapter.topics.length > 0 ? Math.round((chapterCompletedCount / savedChapter.topics.length) * 100) : 0;
    const resumeProgress = Math.max(0, Math.min(100, lastVisitedTopic.progress ?? chapterProgress));
    return { chapter: savedChapter, topic: savedTopic, lessonNumber, lessonTotal: totalTopics, chapterProgress: resumeProgress };
  }, [lastVisitedTopic, chapters, totalTopics]);

  const handleResumeLearning = useCallback(() => {
    if (!resumeTopic) return;

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              routes: [
                {
                  name: 'Learn',
                  state: {
                    routes: [
                      { name: 'Chapters' },
                      {
                        name: 'Topic',
                        params: { chapterId: resumeTopic.chapter.id, topicId: resumeTopic.topic.id },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  }, [resumeTopic, navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(quoteFade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setQuoteIndex(prev => (prev + 1) % quoteSlides.length);
        Animated.timing(quoteFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [quoteFade]);

  useEffect(() => {
    const completedAllLearning = completedTopics === totalTopics && totalTopics > 0;
    const attemptedAllQuizzes = attemptedQuizzes === totalQuizzes && totalQuizzes > 0;
    const hasActivities = chapters.some(ch => ch.topics.some(topic => topic.activity));
    const completedActivities = !hasActivities || (progress.activityProgress ?? 0) >= 100;
    const courseCompleted = completedAllLearning && attemptedAllQuizzes && completedActivities;
    (async () => {
      const modalDismissed = await loadCompletionModalDismissed();
      if (courseCompleted && !showCompletionModal && !modalDismissed) setShowCompletionModal(true);
    })();
  }, [completedTopics, totalTopics, attemptedQuizzes, totalQuizzes, chapters, progress.activityProgress, showCompletionModal]);

  const currentQuote = quoteSlides[quoteIndex];

  if (isLoading) return <HomeScreenSkeleton />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CourseCompletionModal visible={showCompletionModal} onClose={async () => { setShowCompletionModal(false); await saveCompletionModalDismissed(true); }} />

      {/* Light background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.bg.primary }]} />

      {/* Subtle ambient orbs */}
      <View style={styles.bgLayer} pointerEvents="none">
        <FloatingOrb size={200} color="rgba(99,102,241,0.06)" position={{ top: -40, right: -40 }} duration={15000} translateRange={[0, -20]} />
        <FloatingOrb size={160} color="rgba(16,185,129,0.05)" position={{ top: 200, left: -30 }} duration={18000} delay={2000} translateRange={[0, 16]} />
        <FloatingOrb size={120} color="rgba(59,130,246,0.05)" position={{ bottom: 150, right: 20 }} duration={14000} delay={1000} translateRange={[0, -12]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false} overScrollMode="never">

        {/* ── Hero Card — Purple gradient matching video ── */}
        <Animated.View style={[styles.heroWrapper, { opacity: heroFade, transform: [{ scale: heroScale }] }]}>
          <LinearGradient colors={[COLORS.hero.start, COLORS.hero.mid, COLORS.hero.end]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
              <Text style={styles.headerTitle}>EthiCore</Text>
              <Text style={styles.headerSubtitle}>Learn ethics through modules, quizzes and Scenarios</Text>
            </Animated.View>

            <View style={styles.heroHeader}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroLabel}>OVERALL PROGRESS</Text>
              </View>
              <View style={[styles.ringContainer, { width: ringSize, height: ringSize }]}>
                <ProgressTracker 
                  learningProgress={learningPercentage} 
                  quizProgress={quizPercentage} 
                  activitiesProgress={activitiesPercentage} 
                  overallProgress={displayOverallProgress} 
                  size={ringSize} 
                  strokeWidth={10} 
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Resume Card — White card matching video ── */}
        {resumeTopic && completedTopics < totalTopics && (
          <Animated.View style={styles.resumeWrapper}>
            <TouchableOpacity activeOpacity={0.9} onPress={handleResumeLearning} style={styles.resumeTouchable}>
              <View style={styles.resumeInner}>
                <View style={styles.resumeLeft}>
                  <View style={[styles.resumeIconBg, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="time" size={20} color={COLORS.accent.emerald} />
                  </View>
                  <View style={styles.resumeTextBlock}>
                    <View style={styles.resumeMetaRow}>
                      <View style={styles.resumeStatusPill}>
                        <View style={[styles.resumeStatusDot, { backgroundColor: COLORS.accent.emerald }]} />
                        <Text style={[styles.resumeStatusText, { color: COLORS.accent.emerald }]}>In Progress</Text>
                      </View>
                    </View>
                    <Text style={styles.resumeTitle} numberOfLines={1}>{resumeTopic.topic.title}</Text>
                    <Text style={styles.resumeSubtitle}>Chapter {resumeTopic.chapter.id} • Lesson {resumeTopic.lessonNumber} of {resumeTopic.lessonTotal}</Text>
                    <View style={styles.resumeProgressRow}>
                      <View style={styles.resumeTrack}>
                        <View style={[styles.resumeFill, { width: `${resumeTopic.chapterProgress}%` }]} />
                      </View>
                      <Text style={styles.resumePercentText}>{resumeTopic.chapterProgress}%</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.resumeCta}>
                  <LinearGradient colors={['#10B981', '#14B8A6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.resumeCtaGradient}>
                    <Text style={styles.resumeCtaText}>Resume</Text>
                    <Ionicons name="arrow-forward" size={12} color="#FFF" />
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── Section Title ── */}
        <Text style={styles.sectionTitle}>Continue Learning</Text>

        {/* ── Module Grid — Pastel cards matching video ── */}
        <View style={styles.moduleGrid}>
          <ModuleCard 
            icon="flag-outline" 
            colors={COLORS.module.objectives}
            title="Course Objectives" 
            subtitle="View learning goals" 
            onPress={() => navigateToTab('ObjectivesTab')} 
            index={0} 
          />
          <ModuleCard 
            icon="book-outline" 
            colors={COLORS.module.learning}
            title="Learning Module" 
            subtitle="Start learning" 
            onPress={() => navigateToTab('LearningTab')} 
            index={1} 
            progress={totalTopics > 0 ? { completed: completedTopics, total: totalTopics } : undefined} 
          />
          <ModuleCard 
            icon="book-pen" 
            colors={COLORS.module.quiz}
            title="Quiz Module" 
            subtitle="Test your knowledge" 
            onPress={() => navigateToTab('QuizTab')} 
            index={2} 
          />
          <ModuleCard 
            icon="lightbulb" 
            colors={COLORS.module.scenarios}
            title="Ethical Scenarios" 
            subtitle="Decision-making practice" 
            onPress={() => navigateToTab('ScenarioTab')} 
            index={3} 
          />
        </View>

        {/* ── Quote Card ── */}
        <Animated.View style={[styles.quoteWrapper, { opacity: quoteFade, transform: [{ translateY: quoteFade.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
          <View style={styles.quoteInner}>
            <View style={styles.quoteIconBg}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.accent.indigo} />
            </View>
            <Text style={styles.quoteText}>{currentQuote.text}</Text>
            <Text style={styles.quoteAuthor}>{currentQuote.author}</Text>
          </View>
        </Animated.View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  /* ── Base ── */
  container: { flex: 1, backgroundColor: COLORS.bg.primary },
  bgLayer: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: 999 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },

  /* ── Header ── */
  header: { marginBottom: 20, alignItems: 'flex-start' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 4, letterSpacing: -0.8 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20, letterSpacing: 0.2 },

  /* ── Hero ── */
  heroWrapper: { marginBottom: 20 },
  heroCard: { 
    borderRadius: 28, 
    padding: 24, 
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
      android: { elevation: 0 },
    }),
  },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  heroTextBlock: { flex: 1 },
  heroLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.75)', letterSpacing: 1, marginBottom: 8 },
  heroPercentRow: { flexDirection: 'row', alignItems: 'baseline' },
  heroPercent: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2 },
  ringContainer: { marginLeft: 8 },
  heroStatsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 16, 
    paddingVertical: 14,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  heroStatLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.3 },
  heroStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },

  /* ── Resume ── */
  resumeWrapper: { marginBottom: 20 },
  resumeTouchable: { 
    borderRadius: 20, 
    ...Platform.select({
      ios: { shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16 },
      android: { elevation: 0 },
    }),
  },
  resumeInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.bg.card, 
    borderRadius: 20, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
  },
  resumeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  resumeIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  resumeTextBlock: { flex: 1 },
  resumeMetaRow: { marginBottom: 3 },
  resumeStatusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start', 
    gap: 4, 
    backgroundColor: '#ECFDF5', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 8,
  },
  resumeStatusDot: { width: 5, height: 5, borderRadius: 3 },
  resumeStatusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  resumeTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text.primary, marginBottom: 2, letterSpacing: -0.2 },
  resumeSubtitle: { fontSize: 12, color: COLORS.text.muted, marginBottom: 8 },
  resumeProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resumeTrack: { flex: 1, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  resumeFill: { height: '100%', backgroundColor: COLORS.accent.emerald, borderRadius: 3 },
  resumePercentText: { fontSize: 12, fontWeight: '800', color: COLORS.accent.emerald, minWidth: 32, textAlign: 'right' },
  resumeCta: { marginLeft: 10 },
  resumeCtaGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12,
  },
  resumeCtaText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },

  /* ── Section Title ── */
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary, marginBottom: 14, letterSpacing: -0.3, marginTop: 4 },

  /* ── Module Grid ── */
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  moduleCardWrapper: { width: '48%', marginBottom: 12 },
  moduleCardTouchable: { borderRadius: 20, flex: 1 },
  moduleCardInner: { 
    borderRadius: 20, 
    padding: 16, 
    height: 170,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
      android: { elevation: 0 },
    }),
  },
  moduleTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  moduleIconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  moduleCardTitle: { fontSize: 14, fontWeight: '800', lineHeight: 20, marginBottom: 3, letterSpacing: -0.2 },
  moduleCardSubtitle: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
  moduleProgressBox: { marginVertical: 6 },
  moduleProgressTrack: { height: 3, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  moduleProgressFill: { height: '100%', borderRadius: 2 },
  moduleProgressText: { fontSize: 10, fontWeight: '700' },
  moduleArrow: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  /* ── Quote ── */
  quoteWrapper: { marginBottom: 16 },
  quoteInner: { 
    backgroundColor: COLORS.bg.card, 
    borderRadius: 20, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: { shadowColor: '#1E293B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 0 },
    }),
  },
  quoteIconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12,
  },
  quoteText: { fontSize: 14, lineHeight: 24, fontStyle: 'italic', color: COLORS.text.secondary, marginBottom: 10, letterSpacing: 0.1 },
  quoteAuthor: { fontSize: 13, fontWeight: '800', color: COLORS.accent.indigo },
});

export default HomeScreen;