import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '../components/Ionicons';
import { useProgress } from '../context/ProgressContext';
import { buildQuizzes } from '../data/quizQuestions';
import type { QuizStackParamList } from '../modules/quiz/types';

type Props = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizHub'>;
};

const chapterCardAccentColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

const QuizHubScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { chapters } = useProgress();

  // compute summary stats
  const totalChapters = chapters.length;
  const passedChapters = chapters.filter(c => c.quizCompleted && (c.highestQuizScore ?? 0) >= 75).length;

  const bottomPadding = Platform.OS === 'ios' ? 96 : 72;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: bottomPadding }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quiz Module</Text>
        <Text style={styles.subtitle}>Assess your knowledge — pass a chapter with 75% or more</Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy-outline" size={20} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.summaryTitle}>Overall Quiz Progress</Text>
              <Text style={styles.summarySubtitle}>{passedChapters} of {totalChapters} chapters passed</Text>
            </View>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryPercent}>{Math.round((passedChapters/Math.max(1,totalChapters))*100)}%</Text>
          </View>
        </View>

        {/* Chapter list */}
        {chapters.map((ch: { id: number; quizCompleted: boolean; highestQuizScore?: number; quizAttempts?: number; topics?: Array<{ completed: boolean }>; title: string }, index: number) => {
          const quiz = buildQuizzes(chapters).find((q: { chapterId: number }) => q.chapterId === ch.id);
          const totalQuestions = quiz ? quiz.questions.length : 0;
          const attempts = (ch as any).quizAttempts ?? 0;
          const passed = ch.quizCompleted && (ch.highestQuizScore ?? 0) >= 75;
          const allTopicsComplete = ch.topics?.every(t => t.completed) ?? false;
          const previousChapter = chapters.find(prev => prev.id === ch.id - 1);
          const previousChapterPassed = ch.id === 1 || (previousChapter?.quizCompleted && (previousChapter.highestQuizScore ?? 0) >= 75);
          const canStartQuiz = allTopicsComplete && previousChapterPassed;
          const cardAccentColor = chapterCardAccentColors[index % chapterCardAccentColors.length];

          return (
            <View
              key={`chapter-${ch.id}`}
              style={[
                styles.chapterCardNew,
                { backgroundColor: cardAccentColor + '12', borderColor: cardAccentColor + '35' },
              ]}
            >
              <View style={styles.chapterMain}>
                <View style={styles.chapterTextWrap}>
                  <View style={styles.titleRow}>
                    <Text style={styles.chapterTitleNew}>{ch.title}</Text>
                    <View style={styles.statusBadge}>
                      {passed ? (
                        <View style={styles.passedCircle}><Ionicons name="checkmark" size={10} color="#fff" /></View>
                      ) : attempts > 0 ? (
                        <View style={styles.failedCircle}><Ionicons name="close" size={10} color="#fff" /></View>
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.chapterMeta}>{totalQuestions} Questions • {attempts} Attempt{attempts !== 1 ? 's' : ''}</Text>

                  <View style={styles.scoreRow}>
                    <View style={[styles.scorePill, { backgroundColor: cardAccentColor + '15' }]}> 
                      <Text style={[styles.scorePillText, { color: cardAccentColor }]}>{attempts > 0 ? `${Math.min(100, Math.max(0, ch.highestQuizScore ?? 0))}%` : '—'}</Text>
                    </View>
                    <View style={styles.scoreBarBg}>
                      <View style={[styles.scoreBarFill, { width: `${Math.max(0, Math.min(100, attempts > 0 ? Math.min(100, Math.max(0, ch.highestQuizScore ?? 0)) : 0))}%` as any, backgroundColor: cardAccentColor }]} />
                    </View>
                  </View>
                </View>

                <View style={styles.actionWrap}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      passed ? styles.actionButtonOutline : styles.actionButtonFilled,
                      !canStartQuiz && styles.actionButtonLocked
                    ]}
                    onPress={() => {
                      if (!allTopicsComplete) {
                        Alert.alert('Quiz locked', 'Complete all topics in this chapter to unlock the quiz.');
                        return;
                      }
                      if (!previousChapterPassed) {
                        Alert.alert('Quiz locked', 'Pass the previous chapter quiz to unlock this quiz.');
                        return;
                      }
                      navigation.navigate('QuizQuestion', { chapterId: ch.id });
                    }}
                    disabled={!canStartQuiz}
                  >
                    <Ionicons name={!canStartQuiz ? 'lock-closed-outline' : (ch.quizCompleted || attempts > 0 ? 'refresh-outline' : 'play-outline')} size={16} color={!canStartQuiz ? '#fff' : (passed ? '#3B82F6' : '#fff')} />
                    <Text style={!canStartQuiz ? styles.actionButtonTextLocked : (passed ? styles.actionButtonTextOutline : styles.actionButtonTextFilled)}>
                      {ch.quizCompleted || attempts > 0 ? 'Retake Quiz' : 'Take Quiz'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FBFF' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  subtitle: { color: '#64748B', marginBottom: 16 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E6EEF9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center' },
  trophyCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  summarySubtitle: { color: '#64748B', marginTop: 2 },
  summaryRight: { alignItems: 'flex-end' },
  summaryPercent: { fontSize: 20, fontWeight: '700', color: '#0F172A' },

  chapterCardNew: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    position: 'relative',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  chapterMain: { flexDirection: 'row', alignItems: 'center' },
  chapterTextWrap: { flex: 1, marginRight: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  chapterTitleNew: { fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 8 },
  chapterMeta: { color: '#64748B', fontSize: 12, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  scorePill: { backgroundColor: '#F1F9FF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, marginRight: 8 },
  scorePillText: { color: '#0F172A', fontWeight: '700' },
  scoreBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 8, overflow: 'hidden' },
  scoreBarFill: { height: '100%', backgroundColor: '#0F62FF' },

  actionWrap: { justifyContent: 'center' },
  actionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  actionButtonFilled: { backgroundColor: '#3B82F6' },
  actionButtonOutline: { borderWidth: 1, borderColor: '#3B82F6', backgroundColor: '#fff' },
  actionButtonTextFilled: { color: '#fff', fontWeight: '700' },
  actionButtonTextOutline: { color: '#3B82F6', fontWeight: '700' },
  actionButtonLocked: { opacity: 0.7 },
  actionButtonTextLocked: { color: '#94A3B8', fontWeight: '700' },

  statusBadge: { alignSelf: 'center' },
  passedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  failedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  // legacy styles kept
  chapterCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E6E9EE' },
  chapterInfo: { flex: 1, marginRight: 12 },
  chapterTitle: { fontWeight: '700', color: '#0F172A' },
  chapterDesc: { color: '#64748B', fontSize: 12 },
  startButton: { backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  startText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
});

export default QuizHubScreen;
