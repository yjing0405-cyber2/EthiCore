import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { Ionicons } from '../components/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildScenarioDecisions } from '../data/scenarioDatabase';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 2;
const chapterAccentMap = {
  1: { surface: '#F4F9FF', border: '#0F62FF35', title: '#1D4ED8', subtitle: '#3B82F6', pillBg: '#DBEAFE', pillText: '#1D4ED8', accent: '#2563EB' },
  2: { surface: '#FFF7ED', border: '#F59E0B35', title: '#B45309', subtitle: '#D97706', pillBg: '#FDE68A', pillText: '#B45309', accent: '#F59E0B' },
  3: { surface: '#F0FDF4', border: '#10B98135', title: '#047857', subtitle: '#059669', pillBg: '#D1FAE5', pillText: '#047857', accent: '#10B981' },
  4: { surface: '#FEF2F2', border: '#EF444435', title: '#B91C1C', subtitle: '#DC2626', pillBg: '#FECACA', pillText: '#B91C1C', accent: '#EF4444' },
  5: { surface: '#F5F3FF', border: '#8B5CF635', title: '#6D28D9', subtitle: '#7C3AED', pillBg: '#EDE9FE', pillText: '#6D28D9', accent: '#8B5CF6' },
  6: { surface: '#ECFEFF', border: '#06B6D435', title: '#0F766E', subtitle: '#0D9488', pillBg: '#A5F3FC', pillText: '#0F766E', accent: '#06B6D4' },
  7: { surface: '#FFF1F2', border: '#EC489935', title: '#BE185D', subtitle: '#DB2777', pillBg: '#FBCFE8', pillText: '#BE185D', accent: '#EC4899' },
};


const DecisionOptionsScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const insets = useSafeAreaInsets();
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const scenario = route.params?.scenario;
  const chapterId = route.params?.chapterId ?? scenario?.chapterId ?? scenario?.chapter ?? 1;
  const chapterTitle = route.params?.chapterTitle ?? scenario?.chapterTitle ?? `Chapter ${chapterId}`;
  const accent = chapterAccentMap[chapterId as keyof typeof chapterAccentMap] ?? chapterAccentMap[1];
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  const scenarioNumber = scenario?.additionalNotes?.scenarioNumber ?? (scenario?.title ? 1 : 0);

  const decisions = scenario?.decisions?.length
    ? scenario.decisions
    : buildScenarioDecisions(scenario?.title ?? '', scenarioNumber, scenario?.scenarioSetup);

  const normalizedDecisions = useMemo(
    () => (decisions as any[]).map((d, idx) => ({
      id: d.id ?? `d-${idx}`,
      title: d.title,
      description: d.description ?? '',
      consequenceImageCategory:
        d.decisionCategory === 'ethical' || d.decisionCategory === 'mixed' || d.decisionCategory === 'unethical'
          ? d.decisionCategory
          : typeof d.ethical === 'boolean'
            ? (d.ethical ? 'ethical' : 'unethical')
            : undefined,
      analysis: d.analysis ?? '',
      immediate: d.immediate ?? '',
      immediateExplanation: d.immediateExplanation ?? '',
      ripple: d.ripple ?? '',
      rippleExplanation: d.rippleExplanation ?? '',
      longTerm: d.longTerm ?? '',
      longTermExplanation: d.longTermExplanation ?? '',
      violatedPrinciples: d.violatedPrinciples ?? [],
      recommendedActions: d.recommendedActions ?? [],
    })),
    [decisions]
  );

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

    animations.forEach(animation => animation.start());
    return () => animations.forEach(animation => animation.stop());
  }, [circle1Anim, circle2Anim, circle3Anim]);

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const selectedDecision = normalizedDecisions.find((decision) => decision.id === selectedDecisionId) ?? null;

  const handleViewConsequences = () => {
    if (!selectedDecision) return;

    navigation.navigate('ConsequenceTimeline', {
      decision: selectedDecision,
      scenario,
      selectedDecisionId: selectedDecision.id,
      stage: 'Immediate',
      chapterTitle,
    });
  };

  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1.16, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnimation, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnimation]);

  // Render progress dots
  const renderProgressDots = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressDotsRow}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === CURRENT_STEP;
          const isCompleted = stepNum < CURRENT_STEP;
          const dotStyle = isActive
            ? { backgroundColor: accent.accent, width: 24, transform: [{ scale: pulseAnimation }] }
            : isCompleted
              ? { backgroundColor: accent.accent, width: 12 }
              : { backgroundColor: `${accent.accent}40`, width: 6 };

          return (
            <View key={i} style={styles.dotWrapper}>
              <Animated.View style={[styles.progressDot, dotStyle]} />
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Floating Background Circles */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Animated.View style={[styles.floatingCircle, styles.circleOne, { transform: [{ translateY: circle1TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleTwo, { transform: [{ translateY: circle2TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleThree, { transform: [{ translateY: circle3TranslateY }] }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: accent.surface, borderColor: accent.accent, shadowColor: accent.accent, shadowOpacity: 0.24, shadowRadius: 16, elevation: 5 }]}>
          <View style={[styles.decorCircleTop, { backgroundColor: accent.accent + '12' }]} />
          <View style={[styles.decorCircleBottom, { backgroundColor: accent.accent + '0D' }]} />

          <View style={styles.heroContent}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
                <View style={styles.backButtonCircle}>
                  <Ionicons name="chevron-back" size={18} color="#0F172A" />
                </View>
              </TouchableOpacity>

              <View style={[styles.stepBadge, { backgroundColor: accent.pillBg }]}>
                <View style={[styles.stepDot, { backgroundColor: accent.accent }]} />
                <Text style={[styles.stepBadgeText, { color: accent.accent }]}>STEP {CURRENT_STEP} OF {TOTAL_STEPS}</Text>
              </View>
            </View>

            <Text style={[styles.heroTitle, { color: accent.title }]}>Choose your response</Text>
            <Text style={[styles.heroSubtitle, { color: accent.subtitle }]}>Select the action you would take for this scenario before viewing the consequences.</Text>

            {/* Progress Dots */}
            {renderProgressDots()}
          </View>
        </View>

        {/* Scenario Card */}
        <View style={[styles.scenarioCard, { borderColor: accent.border, shadowColor: accent.accent, shadowOpacity: 0.14, shadowRadius: 12, elevation: 4 }]}>
          <View style={[styles.scenarioAccentBar, { backgroundColor: accent.accent }]} />
          <View style={styles.scenarioContent}>
            {scenario?.scenarioNumber && (
              <Text style={styles.scenarioNumber}>Scenario {scenario.scenarioNumber}</Text>
            )}
            <Text style={styles.scenarioText}>
              {scenario?.scenarioSetup ?? scenario?.moral ?? scenario?.title ?? 'Your Scenario'}
            </Text>
            {scenario?.topics && scenario.topics.length > 0 && (
              <View style={styles.topicsRow}>
                {scenario.topics.map((t: string, i: number) => (
                  <View key={i} style={styles.topicTag}>
                    <Text style={styles.topicText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Select Label */}
        <Text style={styles.selectLabel}>Select Your Decision</Text>

        {/* Decision Options */}
        {normalizedDecisions.map((d, i) => (
          <TouchableOpacity
            key={d.id}
            style={[
              styles.optionCard,
              selectedDecisionId === d.id && styles.optionSelected,
            ]}
            onPress={() => setSelectedDecisionId(d.id)}
            activeOpacity={0.85}
          >
            <View style={styles.optionRow}>
              <View style={[
                styles.radioOuter,
                selectedDecisionId === d.id && styles.radioOuterSelected,
              ]}>
                {selectedDecisionId === d.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>{d.title}</Text>

              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, { opacity: !selectedDecision ? 0.5 : 1, backgroundColor: accent.accent, shadowColor: accent.accent }]}
          disabled={!selectedDecision}
          onPress={handleViewConsequences}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>View Consequences</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Background Floating Circles
  backgroundLayer: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  floatingCircle: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  circleOne: { width: 170, height: 170, top: -24, left: -36, backgroundColor: 'rgba(59, 130, 246, 0.10)' },
  circleTwo: { width: 120, height: 120, top: 220, right: -20, backgroundColor: 'rgba(236, 72, 153, 0.10)' },
  circleThree: { width: 84, height: 84, bottom: 90, left: 44, backgroundColor: 'rgba(16, 185, 129, 0.10)' },

  // Content
  content: { paddingHorizontal: 20, paddingBottom: 32 },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, width: '100%', position: 'relative' },
  backButton: { position: 'absolute', left: 0, alignSelf: 'center', zIndex: 1 },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  backText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },

  // Hero Card
  heroCard: {
    marginHorizontal: 0,
    marginBottom: 14,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: 'rgba(59, 131, 246, 0.04)',
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircleTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  decorCircleBottom: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
  },
  heroContent: { position: 'relative', zIndex: 1 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  stepBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4, lineHeight: 28 },
  heroSubtitle: { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 0 },

  // Progress Dots
  progressContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  progressDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 0,
  },
  progressLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    flex: 1,
    fontWeight: '500',
  },
  progressLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Scenario Card
  scenarioCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  scenarioAccentBar: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#3B82F6',
  },
  scenarioContent: { padding: 16, paddingLeft: 28 },
  scenarioNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  scenarioText: { fontSize: 14, color: '#0F172A', lineHeight: 22, fontWeight: '500' },
  topicsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 6 },
  topicTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: { color: '#2563EB', fontSize: 11, fontWeight: '700' },

  // Select Label
  selectLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Decision Options
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  optionSelected: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  radioOuterSelected: { borderColor: '#2563EB' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563EB' },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', lineHeight: 22 },
  optionDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 18, marginTop: 4 },

  // Next Button
  nextButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  nextText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },

  // Unused styles (kept for compatibility)
  optionDescription: { color: '#475569', fontSize: 13, lineHeight: 18, marginTop: 6 },
  expandBtn: { marginTop: 10, marginLeft: 34, paddingVertical: 4 },
  expandText: { color: '#1D4ED8', fontWeight: '600', fontSize: 12 },
  detailSection: {
    marginTop: 12,
    marginLeft: 34,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  detailBlock: { marginBottom: 12 },
  detailLabel: { fontWeight: '700', color: '#0F172A', fontSize: 12, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailText: { color: '#334155', fontSize: 13, lineHeight: 18 },
  detailExplain: { color: '#64748B', fontSize: 12, lineHeight: 17, marginTop: 3, fontStyle: 'italic' },
  principlesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  principleTag: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#FDE68A' },
  principleText: { color: '#92400E', fontSize: 11, fontWeight: '600' },
  actionItem: { color: '#059669', fontSize: 12, lineHeight: 18, marginLeft: 4 },
  summaryCard: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(30,58,95,0.94)' : '#1E3A5F',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  summaryTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  summaryText: { color: '#BFDBFE', fontSize: 12, lineHeight: 17 },
  thinkingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  thinkingCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  thinkingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    textAlign: 'center',
  },
  thinkingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DecisionOptionsScreen;