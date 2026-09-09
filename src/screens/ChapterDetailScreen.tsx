import React, { useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';

// ─── Topic Item Component ─────────────────────────────────────────────────────

const TopicItem: React.FC<{
  topic: any;
  index: number;
  total: number;
  isLocked: boolean;
  onPress: () => void;
}> = ({ topic, index, total, isLocked, onPress }) => {
  const isCompleted = topic.completed;
  const isLast = index === total - 1;
  const dotOffset = React.useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(dotOffset, {
      toValue: isCompleted ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [dotOffset, isCompleted]);

  const dotTranslateY = dotOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [-7, 7],
  });

  const lineFillScaleY = dotOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.topicItem,
        isLast && styles.topicItemLast,
        isLocked && styles.topicItemLocked,
        pressed && !isLocked && styles.topicItemPressed,
      ]}
      onPress={onPress}
      disabled={isLocked}
      android_ripple={{ color: 'rgba(79,70,229,0.08)', borderless: false }}
    >
      {/* Left connector line */}
      <View style={styles.connectorWrap}>
        <View
          style={[
            styles.connectorLine,
            index === 0 && styles.connectorLineFirst,
            isCompleted && styles.connectorLineCompleted,
            isLocked && styles.connectorLineLocked,
          ]}
        />
        {!isLocked && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.connectorProgressFill,
              {
                transform: [{ scaleY: lineFillScaleY }],
                opacity: isCompleted ? 1 : 0.9,
              },
            ]}
          />
        )}
        <Animated.View
          style={[
            styles.connectorDot,
            isCompleted && styles.connectorDotCompleted,
            isLocked && styles.connectorDotLocked,
            !isCompleted && !isLocked && styles.connectorDotCurrent,
            {
              transform: [{ translateY: dotTranslateY }],
            },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.topicContent}>
        <View style={styles.topicTopRow}>
          <Text
            style={[
              styles.topicTitle,
              isCompleted && styles.topicTitleCompleted,
              isLocked && styles.topicTitleLocked,
            ]}
            numberOfLines={2}
          >
            {topic.title}
          </Text>

          {/* Status icon */}
          <View style={styles.topicStatusIcon}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
            ) : isLocked ? (
              <Ionicons name="lock-closed" size={18} color="#CBD5E1" />
            ) : null}
          </View>
        </View>

        <Text
          style={[
            styles.topicMeta,
            isCompleted && styles.topicMetaCompleted,
            isLocked && styles.topicMetaLocked,
          ]}
        >
          {isCompleted
            ? 'Completed'
            : isLocked
            ? 'Complete the previous topic first'
            : 'Tap to start reading'}
        </Text>
      </View>

      {/* Arrow for unlocked */}
      {!isLocked && !isCompleted && (
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" style={{ marginLeft: 4 }} />
      )}
    </Pressable>
  );
};

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function ChapterDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { chapters } = useProgress();
  const chapterId = route.params?.chapterId ?? chapters[0]?.id;
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];

  const previousChapter = chapters.find((prev) => prev.id === chapter.id - 1);
  const previousChapterCompleted = chapter.id === 1 || (previousChapter && previousChapter.topics.every(topic => topic.completed));

  const completedTopics = chapter.topics.filter((t) => t.completed).length;
  const totalTopics = chapter.topics.length;
  const chapterProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const previousChapterPassed = chapter.id === 1 || (previousChapter?.quizCompleted && (previousChapter.highestQuizScore ?? 0) >= 75);
  const isQuizUnlocked = completedTopics === totalTopics && previousChapterPassed;
  const chapterAccentColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
  const chapterAccentColor = chapterAccentColors[(chapter.id - 1) % chapterAccentColors.length];
  const heroCardStyle = {
    backgroundColor: chapterAccentColor,
  };

  const handleBack = () => {
    const state = navigation.getState?.();
    const hasInternalHistory = Array.isArray(state?.routes) && state.routes.length > 1;

    if (hasInternalHistory) {
      navigation.goBack();
      return;
    }

    navigation.navigate('MainTabs', {
      screen: 'Learn',
      params: {
        screen: 'Chapters',
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <View style={[styles.heroCard, heroCardStyle]}>
        {/* Decorative circles */}
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />

        <View style={styles.heroContent}>
          <View style={styles.heroHeaderRow}>
            {/* Back button */}
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={12}
            >
              <Ionicons name="arrow-back" size={20} color="rgb(255, 255, 255)" />
            </Pressable>

            <Text style={styles.heroLabel}>CHAPTER {chapter.id}</Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {chapter.title}
            </Text>
          </View>
          <Text style={styles.heroSubtitle}>
            {completedTopics} of {totalTopics} topics completed
          </Text>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${chapterProgress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{chapterProgress}% complete</Text>
              <Text style={styles.progressText}>
                {completedTopics}/{totalTopics} done
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Section Header ───────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Topics</Text>
        <Text style={styles.sectionCount}>{totalTopics} total</Text>
      </View>

      {/* ─── Topics List ──────────────────────────────────────────────── */}
      <View style={styles.card}>
        {chapter.topics.map((topic, index) => {
          const isLocked =
            !previousChapterCompleted ||
            (index > 0 && !chapter.topics[index - 1]?.completed);

          return (
            <TopicItem
              key={topic.id}
              topic={topic}
              index={index}
              total={chapter.topics.length}
              isLocked={isLocked}
              onPress={() => {
                if (isLocked) {
                  const requirementText = chapter.id === 1
                    ? 'Complete the previous topic first.'
                    : `Complete Chapter ${chapter.id - 1} before opening this topic.`;

                  Alert.alert('Topic locked', requirementText, [{ text: 'OK' }]);
                  return;
                }
                navigation.navigate('Topic', {
                  chapterId: chapter.id,
                  topicId: topic.id,
                });
              }}
            />
          );
        })}
      </View>

      {/* ─── Quiz Button ──────────────────────────────────────────────── */}
      <Pressable
        style={({ pressed }) => [
          styles.quizButton,
          !isQuizUnlocked && styles.quizButtonLocked,
          pressed && isQuizUnlocked && styles.quizButtonPressed,
        ]}
        onPress={() => {
          if (!isQuizUnlocked) return;
          navigation.navigate('QuizQuestion', { chapterId: chapter.id });
        }}
        disabled={!isQuizUnlocked}
      >
        <View
          style={[
            styles.quizButtonGradient,
            { backgroundColor: isQuizUnlocked ? '#4F46E5' : '#E2E8F0' },
          ]}
        >
          <Ionicons
            name={isQuizUnlocked ? 'trophy-outline' : 'lock-closed-outline'}
            size={20}
            color={isQuizUnlocked ? '#FFFFFF' : '#94A3B8'}
          />
          <Text
            style={[
              styles.quizButtonText,
              !isQuizUnlocked && styles.quizButtonTextLocked,
            ]}
          >
            {isQuizUnlocked
              ? 'Take Chapter Quiz'
              : !previousChapterPassed
                ? 'Pass previous chapter quiz to unlock'
                : `Complete all ${totalTopics} topics to unlock`}
          </Text>
          {isQuizUnlocked && (
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          )}
        </View>
      </Pressable>

      {/* Bottom spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 88,
  },

  // ─── Hero ─────────────────────────────────────────────────────────
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroDecor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 2,
    position: 'relative',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 25,
    flex: 1,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 16,
  },
  progressSection: {
    gap: 12,
    marginTop: 4,
  },
  progressBarTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.24)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#eaeaea',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },

  // ─── Section Header ────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // ─── Card Container ────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 0,
      },
    }),
  },

  // ─── Topic Items ──────────────────────────────────────────────────
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicItemLast: {
    borderBottomWidth: 0,
  },
  topicItemLocked: {
    opacity: 0.55,
  },
  topicItemPressed: {
    backgroundColor: '#F8FAFC',
  },

  // Connector timeline
  connectorWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    top: -14,
    width: 2,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  connectorProgressFill: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: '#10B981',
    borderRadius: 999,
  },
  connectorLineFirst: {
    height: 14,
    top: 0,
  },
  connectorLineCompleted: {
    backgroundColor: '#10B981',
  },
  connectorLineLocked: {
    backgroundColor: '#E2E8F0',
  },
  connectorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },
  connectorDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#D1FAE5',
  },
  connectorDotCurrent: {
    backgroundColor: '#4F46E5',
    borderColor: '#EEF2FF',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  connectorDotLocked: {
    backgroundColor: '#CBD5E1',
    borderColor: '#F1F5F9',
  },

  // Topic content
  topicContent: {
    flex: 1,
  },
  topicTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  topicTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 21,
    marginRight: 8,
  },
  topicTitleCompleted: {
    color: '#059669',
  },
  topicTitleLocked: {
    color: '#94A3B8',
  },
  topicStatusIcon: {
    marginTop: 2,
  },
  completedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  topicMetaCompleted: {
    color: '#10B981',
  },
  topicMetaLocked: {
    color: '#CBD5E1',
  },
  miniProgressTrack: {
    marginTop: 8,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4F46E5',
  },

  // ─── Quiz Button ──────────────────────────────────────────────────
  quizButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quizButtonLocked: {
    shadowOpacity: 0,
    elevation: 0,
  },
  quizButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  quizButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quizButtonTextLocked: {
    color: '#94A3B8',
    fontWeight: '700',
  },
});