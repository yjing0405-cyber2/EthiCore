import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '../components/Ionicons';
import { defaultScenarioCatalog } from '../data/scenarioDatabase';

const chapterAccentMap = {
  1: { surface: '#F4F9FF', surfaceEnd: '#EFF6FF', border: '#0F62FF15', title: '#1D4ED8', subtitle: '#3B82F6', pillBg: '#DBEAFE', pillText: '#1D4ED8', accent: '#2563EB' },
  2: { surface: '#FFF7ED', surfaceEnd: '#FFF5F0', border: '#F59E0B15', title: '#B45309', subtitle: '#D97706', pillBg: '#FDE68A', pillText: '#B45309', accent: '#F59E0B' },
  3: { surface: '#F0FDF4', surfaceEnd: '#ECFDF5', border: '#10B98115', title: '#047857', subtitle: '#059669', pillBg: '#D1FAE5', pillText: '#047857', accent: '#10B981' },
  4: { surface: '#FEF2F2', surfaceEnd: '#FEF2F2', border: '#EF444415', title: '#B91C1C', subtitle: '#DC2626', pillBg: '#FECACA', pillText: '#B91C1C', accent: '#EF4444' },
  5: { surface: '#F5F3FF', surfaceEnd: '#F3F0FF', border: '#8B5CF615', title: '#6D28D9', subtitle: '#7C3AED', pillBg: '#EDE9FE', pillText: '#6D28D9', accent: '#8B5CF6' },
  6: { surface: '#ECFEFF', surfaceEnd: '#E0F2FE', border: '#06B6D415', title: '#0F766E', subtitle: '#0D9488', pillBg: '#A5F3FC', pillText: '#0F766E', accent: '#06B6D4' },
  7: { surface: '#FFF1F2', surfaceEnd: '#FFF1F2', border: '#EC489915', title: '#BE185D', subtitle: '#DB2777', pillBg: '#FBCFE8', pillText: '#BE185D', accent: '#EC4899' },
};

const TOTAL_STEPS = 4;

const ScenarioChapterScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const insets = useSafeAreaInsets();
  const chapterId = route.params?.chapterId ?? 1;
  const chapterTitle = route.params?.chapterTitle ?? `Chapter ${chapterId}`;
  const accent = chapterAccentMap[chapterId as keyof typeof chapterAccentMap] ?? chapterAccentMap[1];

  const scenarios = defaultScenarioCatalog.filter((scenario: any) => scenario.chapter === chapterId);
  const currentStep = 1;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1.12, duration: 650, useNativeDriver: true }),
        Animated.timing(pulseAnimation, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnimation]);

  const renderProgressDots = () => {
    return Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const isActive = i + 1 === currentStep;

      return (
        <Animated.View
          key={i}
          style={[
            styles.progressDot,
            isActive
              ? [styles.progressDotActive, { backgroundColor: accent.accent, transform: [{ scale: pulseAnimation }] }]
              : [styles.progressDotInactive, { backgroundColor: `${accent.accent}40` }],
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: accent.surface, borderColor: accent.border, marginTop: insets.top + 12 }]}>
        <View style={[styles.decorCircleTop, { backgroundColor: `${accent.accent}12` }]} />
        <View style={[styles.decorCircleBottom, { backgroundColor: `${accent.accent}0A` }]} />
        
        <View style={styles.heroContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
              <View style={styles.backButtonCircle}>
                <Ionicons name="chevron-back" size={18} color="#0F172A" />
              </View>
            </TouchableOpacity>

            <View style={[styles.stepBadge, { backgroundColor: `${accent.accent}18` }]}>
              <View style={[styles.stepDot, { backgroundColor: accent.accent }]} />
              <Text style={[styles.stepBadgeText, { color: accent.title }]}>STEP {currentStep} OF {TOTAL_STEPS}</Text>
            </View>
          </View>
          
          <Text style={[styles.heroTitle, { color: accent.title }]}>{chapterTitle}</Text>
          <Text style={[styles.heroSubtitle, { color: accent.subtitle }]}>Choose a scenario to explore how decisions unfold in real-world situations.</Text>
          
          <View style={styles.progressRow}>{renderProgressDots()}</View>
        </View>
      </View>

      {/* Scenarios List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Scenarios</Text>
          <View style={[styles.countBadge, { backgroundColor: `${accent.accent}12` }]}>
            <Text style={[styles.countText, { color: accent.accent }]}>{scenarios.length} available</Text>
          </View>
        </View>

        {scenarios.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No scenarios are available for this chapter yet.</Text>
          </View>
        ) : (
          scenarios.map((scenario: any, index: number) => (
            <TouchableOpacity
              key={`${scenario.id ?? index}`}
              style={styles.card}
              onPress={() => navigation.navigate('DecisionOptions', { scenario, chapterId, chapterTitle })}
              activeOpacity={0.85}
            >
              <View style={[styles.accentBar, { backgroundColor: accent.accent }]} />
              
              <View style={styles.cardHeader}>
                <View style={[styles.tagPill, { backgroundColor: accent.pillBg }]}>
                  <Text style={[styles.tagText, { color: accent.pillText }]}>Scenario {index + 1}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </View>
              
              <Text style={styles.cardTitle}>{scenario.title}</Text>
            </TouchableOpacity>
          ))
        )}
        
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
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
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  decorCircleTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  decorCircleBottom: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  heroContent: { position: 'relative', zIndex: 1 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  stepBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 8, lineHeight: 32 },
  heroSubtitle: { fontSize: 14, color: '#64748B', lineHeight: 22 },
  progressRow: { flexDirection: 'row', gap: 5, marginTop: 20 },
  progressDot: { height: 6, borderRadius: 3 },
  progressDotActive: { width: 24 },
  progressDotInactive: { width: 6 },

  // Scroll Content
  scrollContent: { paddingHorizontal: 20 },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  countBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 12, fontWeight: '700' },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 12,
  },
  tagPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, fontWeight: '800' },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
    paddingLeft: 12,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginTop: 6,
    paddingLeft: 12,
  },

  // Empty State
  emptyCard: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});

export default ScenarioChapterScreen;