import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import ProgressTracker from '../components/ProgressTracker';

const ProgressScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { progress, chapters, resetProgress } = useProgress();

  const completedTopics = chapters.reduce((acc, ch) => acc + ch.topics.filter(t => t.completed).length, 0);
  const totalTopics = chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
  const passedQuizzes = chapters.filter(ch => ch.quizCompleted && ch.highestQuizScore >= 75).length;
  const clampedChapterScores = chapters.map(ch => Math.min(100, Math.max(0, ch.highestQuizScore ?? 0)));
  const bestScore = clampedChapterScores.length > 0 ? Math.max(...clampedChapterScores) : 0;

  // Use the actual topic completion percentage for the outer learning ring so it
  // stays aligned with the real course progress shown elsewhere.
  const learningPercentage = totalTopics > 0
    ? Math.min(100, Math.max(0, Math.round((completedTopics / totalTopics) * 100)))
    : 0;
  const quizPercentage = progress.quizProgress ?? (chapters.length > 0 ? Math.round((passedQuizzes / chapters.length) * 100) : 0);
  const activitiesPercentage = progress.activityProgress ?? 0;

  const handleReset = () => {
    resetProgress();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
        </View>

        {/* Main Progress Card */}
        <View style={styles.mainProgressCard}>
          <View style={styles.progressCircleContainer}>
            <ProgressTracker
              learningProgress={learningPercentage}
              quizProgress={quizPercentage}
              activitiesProgress={activitiesPercentage}
              overallProgress={progress.overallProgress}
              size={Math.min(260, 180)}
              strokeWidth={14}
              showScore={true}
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>{completedTopics}</Text>
              <Text style={styles.statBoxLabel}>Topics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>{passedQuizzes}</Text>
              <Text style={styles.statBoxLabel}>Quizzes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statBoxValue}>{bestScore > 0 ? `${bestScore}%` : '-'}</Text>
              <Text style={styles.statBoxLabel}>Best Score</Text>
            </View>
          </View>
        </View>

        {/* Chapter Progress */}
        <Text style={styles.sectionTitle}>Chapter Progress</Text>

        {chapters.map((chapter) => {
          const completedTopics = chapter.topics.filter(t => t.completed).length;
          const topicProgress = Math.round((completedTopics / chapter.topics.length) * 100);
          const quizPassed = chapter.quizCompleted && chapter.highestQuizScore >= 75;

          return (
            <View key={`chapter-${chapter.id}`} style={styles.chapterCard}>
              <View style={styles.chapterHeader}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{chapter.id}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle} numberOfLines={1}>
                    {chapter.title}
                  </Text>
                  <Text style={styles.chapterSubtitle}>
                    {completedTopics}/{chapter.topics.length} topics
                  </Text>
                </View>
                {quizPassed && (
                  <View style={styles.passedBadge}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                )}
              </View>

              <View style={styles.chapterProgressRow}>
                <View style={styles.topicProgress}>
                  <View style={styles.miniProgressBar}>
                    <View 
                      style={[
                        styles.miniProgressFill, 
                        { width: `${topicProgress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.topicProgressText}>{topicProgress}% topics</Text>
                </View>

                {chapter.highestQuizScore > 0 ? (
                  <View style={[
                    styles.quizBadge,
                    quizPassed ? styles.quizBadgePassed : styles.quizBadgeFailed
                  ]}>
                    <Text style={[
                      styles.quizBadgeText,
                      quizPassed ? styles.quizBadgeTextPassed : styles.quizBadgeTextFailed
                    ]}>
                      {Math.min(100, Math.max(0, chapter.highestQuizScore))}%
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.quizPending}>Not taken</Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={styles.resetButtonText}>Reset All Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  mainProgressCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  progressCircleContainer: {
    position: 'relative',
    marginBottom: 24,
    width: 140,
    height: 140,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainProgressPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  mainProgressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statBoxLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  passedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicProgress: {
    flex: 1,
    marginRight: 12,
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  topicProgressText: {
    fontSize: 11,
    color: '#64748B',
  },
  quizBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  quizBadgePassed: {
    backgroundColor: '#D1FAE5',
  },
  quizBadgeFailed: {
    backgroundColor: '#FEE2E2',
  },
  quizBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quizBadgeTextPassed: {
    color: '#059669',
  },
  quizBadgeTextFailed: {
    color: '#DC2626',
  },
  quizPending: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 16,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default ProgressScreen;