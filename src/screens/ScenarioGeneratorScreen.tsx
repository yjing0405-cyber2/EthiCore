import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomNavigationHeight } from '../hooks';
import { chapters as courseChapters } from '../data/courseData';
import { defaultScenarioCatalog } from '@/data/scenarioDatabase';
import { Ionicons } from '../components/Ionicons';

const chapterAccentMap = {
  1: { background: '#F4F9FF', border: '#0F62FF35', numberBg: '#DBEAFE', numberText: '#1D4ED8', statBg: '#EFF6FF', statText: '#1D4ED8' },
  2: { background: '#FFF7ED', border: '#F59E0B35', numberBg: '#FDE68A', numberText: '#B45309', statBg: '#FFFBEB', statText: '#B45309' },
  3: { background: '#F0FDF4', border: '#10B98135', numberBg: '#D1FAE5', numberText: '#047857', statBg: '#ECFDF5', statText: '#047857' },
  4: { background: '#FEF2F2', border: '#EF444435', numberBg: '#FECACA', numberText: '#B91C1C', statBg: '#FEF2F2', statText: '#B91C1C' },
  5: { background: '#F5F3FF', border: '#8B5CF635', numberBg: '#EDE9FE', numberText: '#6D28D9', statBg: '#F5F3FF', statText: '#6D28D9' },
  6: { background: '#ECFEFF', border: '#06B6D435', numberBg: '#A5F3FC', numberText: '#0F766E', statBg: '#ECFEFF', statText: '#0F766E' },
  7: { background: '#FFF1F2', border: '#EC489935', numberBg: '#FBCFE8', numberText: '#BE185D', statBg: '#FFF1F2', statText: '#BE185D' },
};

const formatChapterDescription = (description?: string) => {
  if (!description) return '';
  return description
    .replace(/As you read this chapter, consider the following questions:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const ScenarioGeneratorScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const insets = useSafeAreaInsets();
  const navBarHeight = useBottomNavigationHeight();
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;

  const chapterList = courseChapters.map(chapter => ({
    ...chapter,
    scenarioCount: defaultScenarioCatalog.filter((scenario: { chapter?: number }) => scenario.chapter === chapter.id).length,
  }));

  useEffect(() => {
    const animations = [
      Animated.loop(Animated.sequence([
        Animated.timing(circle1Anim, { toValue: 1, duration: 7800, useNativeDriver: true }),
        Animated.timing(circle1Anim, { toValue: 0, duration: 7800, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle2Anim, { toValue: 1, duration: 9800, delay: 1400, useNativeDriver: true }),
        Animated.timing(circle2Anim, { toValue: 0, duration: 9800, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle3Anim, { toValue: 1, duration: 11600, delay: 2600, useNativeDriver: true }),
        Animated.timing(circle3Anim, { toValue: 0, duration: 11600, useNativeDriver: true }),
      ])),
    ];

    animations.forEach(animation => animation.start());
    return () => animations.forEach(animation => animation.stop());
  }, [circle1Anim, circle2Anim, circle3Anim]);

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Animated.View style={[styles.floatingCircle, styles.circleOne, { transform: [{ translateY: circle1TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleTwo, { transform: [{ translateY: circle2TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleThree, { transform: [{ translateY: circle3TranslateY }] }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: navBarHeight + 16 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Scenario Library</Text>
          <Text style={styles.headerSubtitle}>Browse scenarios by chapter, then choose a scenario to make a decision and see its outcome.</Text>
        </View>

        {chapterList.map(chapter => {
          const accent = chapterAccentMap[chapter.id as keyof typeof chapterAccentMap] ?? chapterAccentMap[1];
          return (
            <TouchableOpacity
              key={`chapter-${chapter.id}`}
              style={[styles.chapterCard, { backgroundColor: accent.background, borderColor: accent.border }]}
              onPress={() => navigation.navigate('ScenarioChapter', { chapterId: chapter.id, chapterTitle: chapter.title })}
              activeOpacity={0.85}
            >
              <View style={styles.chapterHeader}>
                <View style={[styles.chapterNumber, { backgroundColor: accent.numberBg }]}> 
                  <Text style={[styles.chapterNumberText, { color: accent.numberText }]}>{chapter.id}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle} numberOfLines={2}>{chapter.title}</Text>
                </View>
              </View>
              <View style={styles.chapterStats}>
                <View style={[styles.statCard, { backgroundColor: accent.statBg }]}> 
                  <Text style={[styles.statValue, { color: accent.statText }]}>{chapter.scenarioCount}</Text>
                  <Text style={styles.statLabel}>Scenarios</Text>
                </View>
                <View style={[styles.statCard, styles.statCardLast, { backgroundColor: accent.statBg }]}> 
                  <Text style={[styles.statValue, { color: accent.statText }]}>{chapter.topics.length}</Text>
                  <Text style={styles.statLabel}>Topics</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f096' },
  backgroundLayer: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  floatingCircle: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  circleOne: { width: 170, height: 170, top: -28, left: -40, backgroundColor: 'rgba(99, 102, 241, 0.16)' },
  circleTwo: { width: 120, height: 120, top: 220, right: -20, backgroundColor: 'rgba(236, 72, 153, 0.16)' },
  circleThree: { width: 90, height: 90, bottom: 100, left: 50, backgroundColor: 'rgba(34, 211, 238, 0.16)' },
  content: { padding: 16, paddingBottom: 32 },
  headerCard: {
    backgroundColor: '#F4F9FF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: '#0F62FF35',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1D4ED8', marginBottom: 8 },
  headerSubtitle: { fontSize: 15, color: '#1D4ED8', lineHeight: 22, opacity: 0.9 },
  chapterCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  chapterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  chapterNumber: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  chapterNumberText: { color: '#1D4ED8', fontSize: 18, fontWeight: 'bold' },
  chapterInfo: { flex: 1, justifyContent: 'center' },
  chapterTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  chapterDesc: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  chapterStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { alignItems: 'center', padding: 10, backgroundColor: '#EFF6FF', borderRadius: 16, flex: 1, marginRight: 8 },
  statCardLast: { marginRight: 0 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1D4ED8' },
  statLabel: { fontSize: 12, color: '#475569', marginTop: 2 },
});

export default ScenarioGeneratorScreen;
