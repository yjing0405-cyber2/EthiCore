import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypewriterText } from '@/components/TypewriterText';
import { chapters, courseObjectives } from '../data/courseData';
import { saveScenarioResult } from '../utils/storage';
import { useNetworkStatus } from '../utils/network';
import { evaluateWithGemini, EvaluationResult } from '../services/geminiBridge';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SINGLE AI LIFECYCLE STATE MACHINE
// ─────────────────────────────────────────────────────────────────────────────
type AIState =
  | 'Idle'
  | 'Thinking'
  | 'Typing'
  | 'Paused'
  | 'Completed'
  | 'Exited'
  | 'Error';

const AI_STATE_TRANSITIONS: Record<AIState, AIState[]> = {
  Idle:      ['Thinking', 'Exited'],
  Thinking:  ['Typing', 'Paused', 'Exited', 'Error'],
  Typing:    ['Paused', 'Completed', 'Exited', 'Error'],
  Paused:    ['Typing', 'Exited'],
  Completed: ['Exited'],
  Exited:    [],
  Error:     ['Thinking', 'Exited'],
};

function canTransition(from: AIState, to: AIState): boolean {
  return from === to || AI_STATE_TRANSITIONS[from].includes(to);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPING SEQUENCE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────
type SectionKey =
  | 'summary'
  | 'principles'
  | 'recommendation'
  | 'alignment'
  | 'ethicalPrinciples'
  | 'takeaway';

interface SectionConfig {
  key: SectionKey;
  getText: (ctx: EvaluationContext) => string;
}

interface EvaluationContext {
  evaluationResult: EvaluationResult | null;
  decision: any;
  scenario: any;
  effectiveVerdict: string | null;
  isUnethical: boolean;
  evaluationSummary: string;
  evaluationRecommendation: string;
  alignmentText: string;
  consequenceItems: string[];
  benefitItems: string[];
  principles: string[];
  takeawayText: string;
  hasAIPrinciples: boolean;
  aiPrinciplesText: string;
  learningMaterialText: string;
  ethicalPrinciplesText: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. UTILITIES (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeDisplayText = (value?: string | null) => {
  if (!value) return '';
  return String(value)
    .replace(/\bundefined\b/gi, '')
    .replace(/\bnull\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const isValidEvaluationResult = (value: unknown): value is EvaluationResult => {
  if (!value || typeof value !== 'object') return false;
  const verdict = (value as Partial<EvaluationResult>).verdict;
  const reasoning = (value as Partial<EvaluationResult>).reasoning;
  return (verdict === 'ethical' || verdict === 'unethical') && typeof reasoning === 'string' && reasoning.trim().length > 0;
};

const TOTAL_STEPS = 4;
const CURRENT_STEP = 4;

const chapterAccentMap = {
  1: { surface: '#F4F9FF', border: '#0F62FF35', title: '#1D4ED8', subtitle: '#3B82F6', pillBg: '#DBEAFE', accent: '#2563EB' },
  2: { surface: '#FFF7ED', border: '#F59E0B35', title: '#B45309', subtitle: '#D97706', pillBg: '#FDE68A', accent: '#F59E0B' },
  3: { surface: '#F0FDF4', border: '#10B98135', title: '#047857', subtitle: '#059669', pillBg: '#D1FAE5', accent: '#10B981' },
  4: { surface: '#FEF2F2', border: '#EF444435', title: '#B91C1C', subtitle: '#DC2626', pillBg: '#FECACA', accent: '#EF4444' },
  5: { surface: '#F5F3FF', border: '#8B5CF635', title: '#6D28D9', subtitle: '#7C3AED', pillBg: '#EDE9FE', accent: '#8B5CF6' },
  6: { surface: '#ECFEFF', border: '#06B6D435', title: '#0F766E', subtitle: '#0D9488', pillBg: '#A5F3FC', accent: '#06B6D4' },
  7: { surface: '#FFF1F2', border: '#EC489935', title: '#BE185D', subtitle: '#DB2777', pillBg: '#FBCFE8', accent: '#EC4899' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN SCREEN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ScenarioEvaluationScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const insets = useSafeAreaInsets();
  const { decision, scenario } = route.params || {};
  const { isOnline, isLoading } = useNetworkStatus();
  const scenarioTitle = sanitizeDisplayText(scenario?.title);
  const scenarioSetup = sanitizeDisplayText(scenario?.scenarioSetup);
  const scenarioBody = scenarioSetup.toLowerCase() === scenarioTitle.toLowerCase() ? '' : scenarioSetup;

  const chapterNumber = Number(scenario?.chapter ?? scenario?.chapterId ?? scenario?.additionalNotes?.chapter ?? 0);
  const accent = chapterAccentMap[chapterNumber as keyof typeof chapterAccentMap] ?? chapterAccentMap[1];

  // ── Derived data (memoized) ──
  const chapterTitle = useMemo(
    () => route.params?.chapterTitle ?? route.params?.scenario?.chapterTitle ?? `Chapter ${route.params?.scenario?.chapterId ?? route.params?.scenario?.chapter ?? 1}`,
    [route.params]
  );

  const curriculumChapters = useMemo(() => chapters.filter(chapter => Number(chapter.id) <= 7), []);

  // Evaluation result state needs to be available for derived memos
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(
    isValidEvaluationResult(decision?.evaluationResult) ? decision.evaluationResult : null,
  );

  const effectiveVerdict = evaluationResult?.verdict ?? null;
  const isUnethical = effectiveVerdict === 'unethical';

  const evaluationSummary = sanitizeDisplayText(evaluationResult?.reasoning || '');
  const evaluationRecommendation = sanitizeDisplayText(evaluationResult?.recommendations?.[0] || '');
  const alignmentText = sanitizeDisplayText(evaluationResult?.alignmentWithLearningMaterial || '');
  const consequenceItems: string[] = (evaluationResult?.possibleConsequences || [])
    .map((item: string | null | undefined) => sanitizeDisplayText(item)).filter(Boolean) as string[];
  const benefitItems: string[] = (evaluationResult?.possibleBenefits || [])
    .map((item: string | null | undefined) => sanitizeDisplayText(item)).filter(Boolean) as string[];

  const principles = useMemo(() => {
    const sourceText = [
      scenario?.scenarioSetup, scenario?.title, decision?.title, decision?.analysis,
      decision?.immediate, decision?.ripple, decision?.longTerm,
      decision?.immediateExplanation, decision?.rippleExplanation, decision?.longTermExplanation,
    ].filter(Boolean).join(' ').toLowerCase();
    const inferredPrinciples: string[] = [];
    if (/(privacy|data|personal|confidential|information|record)/.test(sourceText)) inferredPrinciples.push('Privacy and Data Protection');
    if (/(harm|safety|risk|security|unsafe|damage)/.test(sourceText)) inferredPrinciples.push('Safety and Non-Maleficence');
    if (/(transparency|disclose|report|notify|honest|consent|permission)/.test(sourceText)) inferredPrinciples.push('Transparency and Accountability');
    if (/(fair|justice|equal|responsib|trust|stakeholder)/.test(sourceText)) inferredPrinciples.push('Fairness and Stakeholder Trust');
    const explicitPrinciples = Array.isArray(decision?.violatedPrinciples) && decision.violatedPrinciples.length > 0 ? decision.violatedPrinciples : [];
    return [...explicitPrinciples, ...inferredPrinciples].filter((value, index, self) => self.indexOf(value) === index).slice(0, 4);
  }, [decision, scenario]);

  const summarizeTakeaway = useCallback((text: string, category: string, signals: string[] = []) => {
    const cleanedText = sanitizeDisplayText(text) || 'This decision needs a more careful ethical review.';
    const sentences = cleanedText.split(/(?<=[.!?])\s+/).map(sentence => sentence.trim()).filter(Boolean);
    let core = sentences[0] || cleanedText;
    core = core.replace(/^(The user chose .*? and |The course-based analysis .*? that |This decision .*? that )/i, '').trim();
    const signal = signals.length > 0 ? ` It shows the key concern is ${signals[0]}.` : '';
    if (category === 'unethical') return `Key takeaway: ${core}${signal} Action: choose a safer option that protects people and aligns with course ethics.`;
    return `Key takeaway: ${core}${signal} Action: keep this direction while maintaining safeguards and stakeholder care.`;
  }, []);

  const takeawayText = useMemo(() => {
    if (evaluationSummary && effectiveVerdict) return summarizeTakeaway(evaluationSummary, effectiveVerdict, []);
    return 'The AI is evaluating this decision. The ethical classification will appear when the evaluation is complete.';
  }, [evaluationSummary, effectiveVerdict, summarizeTakeaway]);

  const hasAIPrinciples = (evaluationResult?.principles?.length ?? 0) > 0;
  const aiPrinciplesText = (evaluationResult?.principles ?? [])
    .map((item: string | null | undefined) => sanitizeDisplayText(item))
    .filter(Boolean).join(' • ');

  const learningMaterialText = useMemo(() => [
    `Alignment with the learning material: ${sanitizeDisplayText(alignmentText) || 'No alignment details are available yet.'}`,
    'Possible consequences:',
    ...consequenceItems.map(item => `• ${sanitizeDisplayText(item)}`),
    'Possible benefits:',
    ...benefitItems.map(item => `• ${sanitizeDisplayText(item)}`),
  ].join('\n'), [alignmentText, consequenceItems, benefitItems]);

  const ethicalPrinciplesText = useMemo(() =>
    principles.length > 0
      ? principles.map(principle => `• ${sanitizeDisplayText(principle)}`).filter(Boolean).join('\n')
      : '• No specific ethical principle summary is available yet.',
    [principles]
  );

  // ── Evaluation context object passed to sections ──
  const evalCtx = useMemo<EvaluationContext>(() => ({
    evaluationResult, decision, scenario, effectiveVerdict, isUnethical,
    evaluationSummary, evaluationRecommendation, alignmentText, consequenceItems, benefitItems,
    principles, takeawayText, hasAIPrinciples, aiPrinciplesText, learningMaterialText, ethicalPrinciplesText,
  }), [evaluationResult, decision, scenario, effectiveVerdict, isUnethical,
    evaluationSummary, evaluationRecommendation, alignmentText, consequenceItems, benefitItems,
    principles, takeawayText, hasAIPrinciples, aiPrinciplesText, learningMaterialText, ethicalPrinciplesText]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. STATE MACHINE (single source of truth)
  // ─────────────────────────────────────────────────────────────────────────────
  const [aiState, setAiState] = useState<AIState>('Idle');
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [generationRun, setGenerationRun] = useState(0);

  // Modal states
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  // Typing sequence state
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  // Per-section typing positions (char index within each section's text)
  const [sectionPositions, setSectionPositions] = useState<Record<number, number>>({});

  // Refs for cleanup
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const autoScrollEnabledRef = useRef(true);
  const lastOnlineRef = useRef<boolean | null>(null);
  const prevAiStateRef = useRef<AIState | null>(null);

  // ── Helper: safe state transition ──
  const transitionTo = useCallback((nextState: AIState) => {
    if (!isMountedRef.current) return;
    setAiState(prev => {
      if (!canTransition(prev, nextState)) {
        console.warn(`Invalid AI state transition: ${prev} → ${nextState}`);
        return prev;
      }
      return nextState;
    });
  }, []);

  // ── Helper: clear all timers ──
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(() => { fn(); }, delay);
    timersRef.current.push(t);
    return t;
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SECTION DEFINITIONS (sequential evaluation flow)
  // ─────────────────────────────────────────────────────────────────────────────
  const sections: SectionConfig[] = useMemo(() => [
    {
      key: 'summary',
      getText: (ctx) => ctx.evaluationSummary || 'AI is generating the evaluation...',
    },
    {
      key: 'principles',
      getText: (ctx) => ctx.aiPrinciplesText,
    },
    {
      key: 'recommendation',
      getText: (ctx) => ctx.evaluationRecommendation || (ctx.evaluationResult ? 'Waiting for AI response...' : 'AI has not produced a recommendation yet.'),
    },
    {
      key: 'alignment',
      getText: (ctx) => ctx.learningMaterialText,
    },
    {
      key: 'ethicalPrinciples',
      getText: (ctx) => ctx.ethicalPrinciplesText,
    },
    {
      key: 'takeaway',
      getText: (ctx) => ctx.takeawayText,
    },
  ], []);

  const currentSectionText = useMemo(() => {
    if (activeSectionIndex >= sections.length) return '';
    return sections[activeSectionIndex].getText(evalCtx);
  }, [activeSectionIndex, sections, evalCtx]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. AI GENERATION (runs ONCE per scenario)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;

    const loadEvaluation = async () => {
      if (!decision || !scenario) {
        return;
      }

      // If already have evaluation, skip generation
      if (evaluationResult) {
        transitionTo('Thinking');
        scheduleTimer(() => transitionTo('Typing'), 1500);
        return;
      }

      transitionTo('Thinking');

      try {
        const courseContext = [
          ...curriculumChapters.flatMap(chapter =>
            chapter.topics.map(topic => `${topic.title}: ${topic.summary} ${topic.contentSummary || ''}`)
          ),
          ...courseObjectives,
        ].join('\n');

        const result = await evaluateWithGemini(decision, scenario, courseContext);
        if (isMountedRef.current) {
          setEvaluationResult(result as any);
          setEvaluationError(null);
          // Thinking → Typing after a brief pause
          scheduleTimer(() => transitionTo('Typing'), 1200);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setEvaluationError(err instanceof Error ? err.message : 'The evaluation service is unavailable. Please try again.');
          transitionTo('Error');
        }
      }
    };

    loadEvaluation();

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decision, scenario, generationRun, curriculumChapters]);

  // ── Save scenario result ──
  useEffect(() => {
    if (!decision || !evaluationResult) return;
    const item = {
      id: `${Date.now()}`,
      title: scenario?.title || decision?.title || 'Scenario',
      decisionTitle: decision.title,
      verdict: (effectiveVerdict === 'unethical' ? 'Unethical' : 'Ethical') as 'Ethical' | 'Unethical',
      timestamp: new Date().toISOString(),
      violatedPrinciples: decision?.violatedPrinciples ?? [],
      mappedModules: decision?.mappedModules ?? {},
      raw: { scenario, decision },
    };
    saveScenarioResult(item);
  }, [decision, scenario, effectiveVerdict]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. TYPING SEQUENCE CONTROLLER
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSectionComplete = useCallback(() => {
    if (!isMountedRef.current) return;
    const nextIndex = activeSectionIndex + 1;
    if (nextIndex >= sections.length) {
      transitionTo('Completed');
    } else {
      setActiveSectionIndex(nextIndex);
      // Typing state remains — next section will auto-type
    }
  }, [activeSectionIndex, sections.length, transitionTo]);

  const handleSectionStart = useCallback(() => {
    scrollToLatestContent();
  }, []);

  // ── Per-section pause/resume position tracking ──
  const handleTypingProgress = useCallback((sectionIdx: number, charIndex: number) => {
    setSectionPositions(prev => ({ ...prev, [sectionIdx]: charIndex }));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. USER ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  // ── Stop button → Pause modal ──
  const handleStopPress = useCallback(() => {
    if (aiState === 'Typing') {
      prevAiStateRef.current = aiState;
      transitionTo('Paused');
      setShowPauseModal(true);
    } else if (aiState === 'Paused') {
      // Already paused → resume
      transitionTo('Typing');
    }
  }, [aiState, transitionTo]);

  // ── Pause modal: Pause ──
  const handleConfirmPause = useCallback(() => {
    setShowPauseModal(false);
    transitionTo('Paused');
  }, [transitionTo]);

  // ── Pause modal: Continue ──
  const handleCancelPause = useCallback(() => {
    setShowPauseModal(false);
    // Restore previous AI state if available
    const prev = prevAiStateRef.current;
    prevAiStateRef.current = null;
    if (prev && prev !== 'Paused') {
      transitionTo(prev);
    }
  }, [transitionTo]);

  // ── Resume button ──
  const handleResume = useCallback(() => {
    transitionTo('Typing');
  }, [transitionTo]);

  const resetToScenarioLibrary = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Scenarios' } }],
    });
  }, [navigation]);

  const resetToDashboard = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
    });
  }, [navigation]);

  // ── Back button → Back modal ──
  const handleBackPress = useCallback(() => {
    if (aiState === 'Thinking' || aiState === 'Typing') {
      prevAiStateRef.current = aiState;
      transitionTo('Paused');
      setShowBackModal(true);
    } else if (aiState === 'Paused') {
      clearAllTimers();
      transitionTo('Exited');
      resetToScenarioLibrary();
    } else {
      resetToScenarioLibrary();
    }
  }, [aiState, clearAllTimers, resetToScenarioLibrary, transitionTo]);

  // ── Back modal: Leave → cleanup & navigate ──
  const handleConfirmBack = useCallback(() => {
    setShowBackModal(false);
    clearAllTimers();
    transitionTo('Exited');
    resetToScenarioLibrary();
  }, [clearAllTimers, resetToScenarioLibrary, transitionTo]);

  // ── Back modal: Stay → restore previous state ──
  const handleCancelBack = useCallback(() => {
    setShowBackModal(false);
    const prev = prevAiStateRef.current;
    prevAiStateRef.current = null;
    if (prev && prev !== 'Paused') {
      transitionTo(prev);
    }
  }, [transitionTo]);

  // ── Try Another Scenario ──
  const handleTryAnotherScenario = useCallback(() => {
    clearAllTimers();
    transitionTo('Exited');
    resetToScenarioLibrary();
  }, [clearAllTimers, resetToScenarioLibrary, transitionTo]);

  // ── Return to Dashboard ──
  const handleReturnToDashboard = useCallback(() => {
    clearAllTimers();
    transitionTo('Exited');
    resetToDashboard();
  }, [clearAllTimers, resetToDashboard, transitionTo]);

  // ── Retry on error ──
  const handleRetry = useCallback(() => {
    setEvaluationError(null);
    setEvaluationResult(null);
    setActiveSectionIndex(0);
    setSectionPositions({});
    setGenerationRun(prev => prev + 1);
    transitionTo('Idle');
  }, [transitionTo]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. NAVIGATION OVERRIDE (beforeRemove listener)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      const actionType = e.data?.action?.type;
      // Only intercept GO_BACK / POP
      if (actionType !== 'GO_BACK' && actionType !== 'POP') return;

      // If in an active AI state, prevent and show modal
      if (aiState === 'Thinking' || aiState === 'Typing') {
        e.preventDefault();
        prevAiStateRef.current = aiState;
        transitionTo('Paused');
        setShowBackModal(true);
      } else if (aiState === 'Paused') {
        e.preventDefault();
        clearAllTimers();
        transitionTo('Exited');
        resetToScenarioLibrary();
      }
      // Otherwise allow navigation
    });
    return unsubscribe;
  }, [navigation, aiState, clearAllTimers, resetToScenarioLibrary, transitionTo]);

  // ── Android hardware back button ──
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (aiState === 'Thinking' || aiState === 'Typing') {
          prevAiStateRef.current = aiState;
          transitionTo('Paused');
          setShowBackModal(true);
          return true; // prevent default
        }
        if (aiState === 'Paused') {
          clearAllTimers();
          transitionTo('Exited');
          resetToScenarioLibrary();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [aiState, clearAllTimers, resetToScenarioLibrary, transitionTo])
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. NETWORK HANDLING
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;

    if (isOnline === false) {
      lastOnlineRef.current = false;
      return;
    }

    const hasRecovered = lastOnlineRef.current === false && isOnline === true;
    if (hasRecovered && aiState === 'Error') {
      // Auto-retry on reconnect
      handleRetry();
    }

    lastOnlineRef.current = isOnline;
  }, [isLoading, isOnline, aiState, handleRetry]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. SCROLLING
  // ─────────────────────────────────────────────────────────────────────────────
  const scrollToLatestContent = useCallback(() => {
    if (!autoScrollEnabledRef.current) return;
    scheduleTimer(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [scheduleTimer]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    autoScrollEnabledRef.current = distanceFromBottom <= 110;
  }, []);

  // Auto-scroll on section change
  useEffect(() => {
    scrollToLatestContent();
  }, [activeSectionIndex, scrollToLatestContent]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. ANIMATIONS (preserved from original)
  // ─────────────────────────────────────────────────────────────────────────────
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const stepPulseAnimation = useRef(new Animated.Value(1)).current;
  const stopButtonPulse = useRef(new Animated.Value(1)).current;
  const stopButtonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(stepPulseAnimation, { toValue: 1.16, duration: 700, useNativeDriver: true }),
        Animated.timing(stepPulseAnimation, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulseAnim.start();
    return () => pulseAnim.stop();
  }, []);

  useEffect(() => {
    if (aiState === 'Thinking' || aiState === 'Typing') {
      const pulseAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(stopButtonPulse, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(stopButtonPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulseAnim.start();
      return () => pulseAnim.stop();
    }
  }, [aiState]);

  useEffect(() => {
    const animations = [
      Animated.loop(Animated.sequence([
        Animated.timing(circle1Anim, { toValue: 1, duration: 7600, useNativeDriver: true }),
        Animated.timing(circle1Anim, { toValue: 0, duration: 7600, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle2Anim, { toValue: 1, duration: 9600, delay: 1400, useNativeDriver: true }),
        Animated.timing(circle2Anim, { toValue: 0, duration: 9600, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle3Anim, { toValue: 1, duration: 11600, delay: 2600, useNativeDriver: true }),
        Animated.timing(circle3Anim, { toValue: 0, duration: 11600, useNativeDriver: true }),
      ])),
    ];
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. DERIVED UI STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const aiStatusText = useMemo(() => {
    switch (aiState) {
      case 'Idle': return 'Preparing evaluation...';
      case 'Thinking': return 'AI is analyzing your decision...';
      case 'Typing': return 'AI is typing...';
      case 'Paused': return 'Evaluation paused';
      case 'Completed': return 'Evaluation complete';
      case 'Error': return 'Evaluation failed';
      case 'Exited': return 'Evaluation exited';
      default: return '';
    }
  }, [aiState]);

  const aiStatusDotColor = useMemo(() => {
    switch (aiState) {
      case 'Thinking': return '#F59E0B';
      case 'Typing': return '#10B981';
      case 'Paused': return '#F59E0B';
      case 'Completed': return '#064bd5';
      case 'Error': return '#EF4444';
      default: return '#94a3b8';
    }
  }, [aiState]);

  // Which floating button to show
  const floatingButtonConfig = useMemo(() => {
    switch (aiState) {
      case 'Typing':
        return { type: 'stop' as const };
      case 'Paused':
        return { type: 'resume' as const };
      case 'Completed':
      case 'Error':
        return { type: 'tryAnother' as const };
      default:
        return { type: 'none' as const };
    }
  }, [aiState]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const renderProgressDots = () => (
    <View style={styles.progressRow}>
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === CURRENT_STEP;
        const isCompleted = stepNum < CURRENT_STEP;
        const dotStyle = isActive
          ? { backgroundColor: accent.accent, width: 24, transform: [{ scale: stepPulseAnimation }] }
          : isCompleted
            ? { backgroundColor: accent.accent, width: 12 }
            : { backgroundColor: `${accent.accent}40`, width: 6 };
        return <Animated.View key={stepNum} style={[styles.progressDot, dotStyle]} />;
      })}
    </View>
  );

  // ── Render a section with TypewriterText if active, else plain text ──
  const renderSection = (sectionIdx: number, style: any, title?: string) => {
    const section = sections[sectionIdx];
    if (!section) return null;
    const text = section.getText(evalCtx);
    const isActive = activeSectionIndex === sectionIdx && (aiState === 'Typing' || aiState === 'Paused' || aiState === 'Thinking');
    const isPast = activeSectionIndex > sectionIdx;
    const isFuture = activeSectionIndex < sectionIdx;

    if (isFuture) return null;

    const resumeFrom = sectionPositions[sectionIdx] || 0;

    return (
      <View style={style}>
        {title ? <Text style={{ fontWeight: '700', marginBottom: 8 }}>{title}</Text> : null}
        {isActive ? (
          <TypewriterText
            text={text}
            speed={20}
            style={styles.analysisText}
            onStart={handleSectionStart}
            onComplete={handleSectionComplete}
            pauseTyping={aiState !== 'Typing'}
            resumeFrom={resumeFrom}
            onProgress={(charIndex: number) => handleTypingProgress(sectionIdx, charIndex)}
          />
        ) : (
          <Text style={styles.analysisText}>{text}</Text>
        )}
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 16. OFFLINE SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  // 17. MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Background floating circles */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Animated.View style={[styles.floatingCircle, styles.circleOne, { transform: [{ translateY: circle1TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleTwo, { transform: [{ translateY: circle2TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleThree, { transform: [{ translateY: circle3TranslateY }] }]} />
      </View>

      {/* ── Pause Confirmation Modal ── */}
      <Modal visible={showPauseModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pause evaluation?</Text>
            <Text style={styles.modalMessage}>
              Would you like to pause the AI response? You can resume anytime from where you left off.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelPause}>
                <Text style={styles.modalButtonText}>Continue Typing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleConfirmPause}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Pause</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Back Confirmation Modal ── */}
      <Modal visible={showBackModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Leave evaluation?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to leave? Your progress will be saved, but you'll return to the chapter selection.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelBack}>
                <Text style={styles.modalButtonText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleConfirmBack}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => scrollToLatestContent()}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      >
        {/* AI Status Header */}
        <View style={styles.aiStatusHeader}>
          <View style={styles.aiStatusDot}>
            {(aiState === 'Thinking' || aiState === 'Typing') && (
              <Animated.View style={[styles.aiStatusPulse, {
                transform: [{ scale: stopButtonPulse }],
                opacity: stopButtonOpacity
              }]} />
            )}
            <View style={[styles.aiStatusDotInner, { backgroundColor: aiStatusDotColor }]} />
          </View>
          <Text style={styles.aiStatusText}>{aiStatusText}</Text>
        </View>

        {/* Thinking indicator */}
        {aiState === 'Thinking' && (
          <View style={styles.thinkingBanner}>
            <ActivityIndicator size="small" color={accent.accent} style={{ marginRight: 10 }} />
            <Text style={styles.thinkingBannerText}>AI is analyzing your decision...</Text>
          </View>
        )}

        {/* Error banner */}
        {aiState === 'Error' && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{evaluationError || 'Something went wrong while generating the evaluation.'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: accent.surface, borderColor: accent.border, shadowColor: accent.accent, shadowOpacity: 0.16, shadowRadius: 14, elevation: 4 }]}>
          <View style={[styles.decorCircleTop, { backgroundColor: `${accent.accent}12` }]} />
          <View style={[styles.decorCircleBottom, { backgroundColor: `${accent.accent}0D` }]} />
          <View style={styles.heroContent}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.8}>
                <View style={styles.backButtonCircle}>
                  <Ionicons name="chevron-back" size={18} color="#0F172A" />
                </View>
              </TouchableOpacity>
              <View style={[styles.stepBadge, { backgroundColor: accent.pillBg }]}>
                <View style={[styles.stepDot, { backgroundColor: accent.accent }]} />
                <Text style={[styles.stepBadgeText, { color: accent.title }]}>STEP {CURRENT_STEP} OF {TOTAL_STEPS}</Text>
              </View>
            </View>
            <Text style={[styles.heroTitle, { color: accent.title }]}>Review the evaluation</Text>
            <Text style={[styles.heroSubtitle, { color: accent.subtitle }]}>See how the choice aligns with the course values and what the next step should be.</Text>
            {renderProgressDots()}
          </View>
        </View>

        {scenarioTitle || scenarioSetup ? (
          <View style={[styles.scenarioCard, { borderColor: `${accent.accent}35`, borderLeftColor: accent.accent }]}>
            <Text style={styles.scenarioTitle}>
              {scenarioTitle || 'Scenario'}
            </Text>
            {scenarioBody ? (
              <Text style={styles.scenarioBody}>{scenarioBody}</Text>
            ) : null}
          </View>
        ) : null}

        {/* AI result */}
        <View style={[styles.headerBadge, { backgroundColor: evaluationResult ? (isUnethical ? '#FEE2E2' : '#DCFCE7') : '#E2E8F0' }]}>
          {evaluationResult ? (
            <Ionicons name={isUnethical ? 'thumbs-down' : 'thumbs-up'} size={50} color={isUnethical ? '#B91C1C' : '#047857'} />
          ) : (
            <ActivityIndicator size="large" color="#64748B" />
          )}
        </View>

        <Text style={styles.resultTitle}>{evaluationResult ? (isUnethical ? 'Unethical Decision' : 'Ethical Decision') : 'AI Evaluation in Progress'}</Text>
        <Text style={styles.resultSubtitle}>
          {evaluationResult ? (isUnethical ? 'The AI classified this choice as unethical.' : 'The AI classified this choice as ethical.') : 'The AI is deciding whether this choice is ethical or unethical.'}
        </Text>

        {/* Decision card */}
        <View style={styles.decisionCard}>
          <Text style={{ fontWeight: '700' }}>Your Decision</Text>
          <Text style={{ marginTop: 6 }}>{decision?.title}</Text>
          <Text style={{ marginTop: 6, color: '#64748B', fontSize: 12 }}>{chapterTitle}</Text>
        </View>

        {/* Analysis Card */}
        <View style={[styles.analysisCard, { backgroundColor: evaluationResult ? (isUnethical ? '#FEEFF0' : '#E6FBF2') : '#F8FAFC' }]}>
          <View style={styles.analysisHeaderRow}>
            <Text style={styles.analysisTitle}>Evaluation</Text>
          </View>

          {/* Section 0: Summary */}
          {activeSectionIndex >= 0 && renderSection(0, {}, undefined)}

          {/* Section 1: AI Principles */}
          {activeSectionIndex >= 1 && hasAIPrinciples && renderSection(1, styles.signalBox, 'AI principles')}

          {/* Section 2: Recommendation */}
          {activeSectionIndex >= 2 && renderSection(2, styles.recommendationBox, 'Recommended action')}
        </View>

        {/* Section 3: Alignment with learning material */}
        {activeSectionIndex >= 3 && renderSection(3, styles.learningCard, 'Alignment with the learning material')}

        {/* Section 4: Ethical Principles */}
        {activeSectionIndex >= 4 && renderSection(4, styles.principlesCard, 'Relevant Ethical Principles')}

        {/* Section 5: Key Takeaway */}
        {activeSectionIndex >= 5 && renderSection(5, styles.takeawayCard, 'Key Takeaway')}

      </ScrollView>

      {/* ── Floating Action Button ── */}
      <View style={styles.floatingButtonContainer}>
        {floatingButtonConfig.type === 'stop' && (
          <Animated.View style={{ transform: [{ scale: stopButtonPulse }] }}>
            <TouchableOpacity style={styles.stopButton} onPress={handleStopPress} activeOpacity={0.8}>
              <View style={styles.stopButtonContent}>
                <View style={styles.stopButtonSquare} />
                <Text style={styles.stopButtonText}>Stop</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {floatingButtonConfig.type === 'resume' && (
          <TouchableOpacity style={styles.resumeButton} onPress={handleResume} activeOpacity={0.8}>
            <View style={styles.resumeButtonContent}>
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.resumeButtonText}>Resume evaluation</Text>
            </View>
          </TouchableOpacity>
        )}

        {floatingButtonConfig.type === 'tryAnother' && (
          <>
            <TouchableOpacity style={styles.tryAnotherButton} onPress={handleTryAnotherScenario} activeOpacity={0.8}>
              <Text style={styles.tryAnotherButtonText}>Try Another Scenario</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardButton} onPress={handleReturnToDashboard} activeOpacity={0.8}>
              <Text style={styles.dashboardButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 18. STYLES (preserved from original, with additions)
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E2E8F0' },
  backgroundLayer: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  floatingCircle: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  circleOne: { width: 170, height: 170, top: -24, left: -36, backgroundColor: 'rgba(59, 130, 246, 0.16)' },
  circleTwo: { width: 120, height: 120, top: 220, right: -20, backgroundColor: 'rgba(236, 72, 153, 0.16)' },
  circleThree: { width: 84, height: 84, bottom: 90, left: 44, backgroundColor: 'rgba(16, 185, 129, 0.16)' },
  content: { padding: 16, paddingBottom: 140 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, width: '100%', position: 'relative' },
  backButton: { position: 'absolute', left: 0, alignSelf: 'center', zIndex: 1 },
  backButtonCircle: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
  },

  // AI Status Header
  aiStatusHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, alignSelf: 'center',
  },
  aiStatusDot: { width: 10, height: 10, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  aiStatusDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  aiStatusPulse: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.3)' },
  aiStatusText: { fontSize: 13, fontWeight: '600', color: '#374151' },

  // Thinking Banner
  thinkingBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12,
  },
  thinkingBannerText: { fontSize: 14, fontWeight: '500', color: '#475569' },

  // Error Banner
  errorBanner: {
    backgroundColor: '#FEE2E2', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#FCA5A5',
  },
  errorBannerText: { color: '#B91C1C', lineHeight: 20, fontWeight: '600', marginBottom: 10 },
  retryButton: { backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  retryButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  headerBadge: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12 },
  heroCard: {
    borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1.5, overflow: 'hidden', position: 'relative',
    ...Platform.select({ android: { elevation: 0 } }),
  },
  decorCircleTop: { position: 'absolute', top: -34, right: -34, width: 128, height: 128, borderRadius: 64 },
  decorCircleBottom: { position: 'absolute', bottom: -28, left: -28, width: 96, height: 96, borderRadius: 48 },
  heroContent: { position: 'relative', zIndex: 1 },
  stepBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  stepBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, lineHeight: 30 },
  heroSubtitle: { fontSize: 13.5, color: '#64748B', lineHeight: 20, marginBottom: 14 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  progressDot: { height: 6, borderRadius: 3 },
  scenarioCard: {
    marginBottom: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: { elevation: 1 },
    }),
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
  },
  scenarioBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
  },
  resultTitle: { textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  resultSubtitle: { textAlign: 'center', color: '#64748B', marginBottom: 12 },
  decisionCard: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.88)' : '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: Platform.OS === 'ios' ? 0 : 1, borderColor: Platform.OS === 'ios' ? 'transparent' : '#E6EEF9', overflow: 'hidden' },
  analysisCard: { padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E6EEF9', backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.86)' : '#fff', overflow: 'hidden' },
  analysisHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  analysisTitle: { fontWeight: '700' },
  analysisText: { color: '#334155', lineHeight: 20 },
  signalBox: { marginTop: 10, backgroundColor: '#EFF6FF', padding: 10, borderRadius: 10 },
  signalTitle: { fontWeight: '700', color: '#1E3A8A', marginBottom: 4 },
  signalText: { color: '#1D4ED8', fontSize: 12.5, lineHeight: 18 },
  recommendationBox: { marginTop: 10, backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  recommendationTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  recommendationText: { color: '#475569', lineHeight: 19 },
  learningCard: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.86)' : '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E6EEF9', overflow: 'hidden' },
  learningCardTitle: { fontWeight: '700', marginTop: 6, marginBottom: 4 },
  learningCardText: { color: '#475569', lineHeight: 19 },
  principlesCard: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.86)' : '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E6EEF9', overflow: 'hidden' },
  principlesBulletText: { color: '#334155', lineHeight: 20 },
  takeawayCard: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.86)' : '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E6EEF9', marginBottom: 12, overflow: 'hidden' },
  takeawayText: { color: '#334155', lineHeight: 20, marginTop: 8 },

  // Floating Button Container
  floatingButtonContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingBottom: 24, paddingTop: 12,
    backgroundColor: 'rgba(226, 232, 240, 0.9)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.5)',
  },

  // Stop Button
  stopButton: {
    backgroundColor: '#BB1E16', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  stopButtonContent: { flexDirection: 'row', alignItems: 'center' },
  stopButtonSquare: { width: 12, height: 12, backgroundColor: '#EF4444', borderRadius: 2, marginRight: 10 },
  stopButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },

  // Resume Button
  resumeButton: {
    backgroundColor: '#0F766E', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    shadowColor: '#0F766E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  resumeButtonContent: { flexDirection: 'row', alignItems: 'center' },
  resumeButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3, marginLeft: 8 },

  // Try Another Scenario Button
  tryAnotherButton: {
    backgroundColor: '#1D4ED8', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flex: 1,
    shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  tryAnotherButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  dashboardButton: {
    marginTop: 12,
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardButtonText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },

  // Offline
  offlineContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' },
  offlineTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  offlineText: { textAlign: 'center', color: '#475569', marginBottom: 24, lineHeight: 20 },
  offlineButton: { backgroundColor: '#1D4ED8', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  offlineButtonText: { color: '#FFFFFF', fontWeight: '700' },

  // Modals
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', padding: 24 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 18, padding: 20, elevation: 0 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#0F172A' },
  modalMessage: { color: '#475569', lineHeight: 20, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#E5E7EB' },
  modalButtonPrimary: { backgroundColor: '#1D4ED8', marginLeft: 10 },
  modalButtonText: { color: '#0F172A', fontWeight: '700' },
  modalButtonPrimaryText: { color: '#fff' },
});

export default ScenarioEvaluationScreen;