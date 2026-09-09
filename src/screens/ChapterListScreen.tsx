import React from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chapters as sourceData } from '../data/courseData';
import { useProgress } from '../context/ProgressContext';

const { width } = Dimensions.get('window');

// ─── Status Badge Component ─────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    Completed: { bg: '#D1FAE5', text: '#065F46', icon: 'checkmark-circle' as const },
    'In progress': { bg: '#FEF3C7', text: '#92400E', icon: 'time' as const },
    Ready: { bg: '#EEF2FF', text: '#4338CA', icon: 'play-circle' as const },
  };
  const c = config[status as keyof typeof config] || config.Ready;

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon} size={12} color={c.text} style={{ marginRight: 4 }} />
      <Text style={[styles.badgeText, { color: c.text }]}>{status}</Text>
    </View>
  );
};

// ─── Progress Ring Component ────────────────────────────────────────────────

const ProgressRing: React.FC<{ percent: number; size?: number }> = ({
  percent,
  size = 56,
}) => {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <View style={[styles.ringBg, { width: size, height: size, borderRadius: size / 2 }]} />
      <Animated.View
        style={[
          styles.ringFill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: '#FBBF24',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ rotate: `${-90 + (percent / 100) * 360}deg` }],
          },
        ]}
      />
      <Text style={styles.ringText}>{percent}%</Text>
    </View>
  );
};

// ─── Chapter Card Component ───────────────────────────────────────────────────

const ChapterCard: React.FC<{
  chapter: (typeof sourceData)[0];
  index: number;
  onPress: () => void;
}> = ({ chapter, index, onPress }) => {
  const { getActivityAttemptsCount } = useProgress();
  const status = chapter.quizCompleted
    ? 'Completed'
    : chapter.highestQuizScore && chapter.highestQuizScore > 0
    ? 'In progress'
    : 'Ready';

  const isCompleted = status === 'Completed';
  const topicCount = chapter.topics.length;
  const completedCount = chapter.topics.filter((t) => t.completed).length;
  const chapterProgress = topicCount > 0 ? Math.round((completedCount / topicCount) * 100) : 0;
  const activityTopics = chapter.topics.filter((t) => !!t.activity);
  const activityTaken = getActivityAttemptsCount(chapter.id);
  const hasActivities = activityTopics.length > 0;
  const allActivitiesCompleted = hasActivities && activityTaken >= activityTopics.length;
  const activityIndicator = hasActivities
    ? allActivitiesCompleted
      ? 'All activity topics completed'
      : `${activityTaken} of ${activityTopics.length} activity topics taken`
    : 'No activity topics yet';
  const activityIndicatorIcon = allActivitiesCompleted ? 'checkmark-circle' : hasActivities ? 'flash' : 'alert-circle';

  const showCoverImage = index >= 0;
  const chapterCoverImages = [
    require('../assets/IllustrationCoverImg/Chap1.jpg'),
    require('../assets/IllustrationCoverImg/Chap2.jpg'),
    require('../assets/IllustrationCoverImg/Chap3.jpg'),
    require('../assets/IllustrationCoverImg/Chap4.jpg'),
    require('../assets/IllustrationCoverImg/Chap5.jpg'),
    require('../assets/IllustrationCoverImg/Chap6.jpg'),
    require('../assets/IllustrationCoverImg/Chap7.jpg'),
  ];
  const cardAccentColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
  const cardAccentColor = cardAccentColors[index % cardAccentColors.length];
  const chapterCoverImage = chapterCoverImages[index] ?? chapterCoverImages[0];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardAccentColor + '12',
          borderWidth: 1.2,
          borderColor: cardAccentColor + '35',
        },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(79,70,229,0.08)', borderless: false }}
    >
      {showCoverImage ? (
        <View style={styles.cardImageFrame}>
          <Image
            source={chapterCoverImage}
            style={styles.cardCoverImage}
          />
        </View>
      ) : (
        <View
          style={[
            styles.cardAccent,
            { backgroundColor: cardAccentColor },
          ]}
        />
      )}

      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {chapter.title}
          </Text>
        </View>

        {/* Bottom row: progress + meta */}
        <View style={styles.cardBottomRow}>
          <View style={styles.cardMetaRow}>
            <Ionicons name="layers-outline" size={14} color="#94A3B8" />
            <Text style={styles.cardMeta}>{topicCount} topics</Text>
          </View>
        </View>

        <View style={styles.activityIndicatorRow}>
          <View
            style={[
              styles.activityIndicatorPill,
              allActivitiesCompleted && styles.activityIndicatorPillComplete,
              !hasActivities && styles.activityIndicatorPillEmpty,
            ]}
          >
            <Ionicons
              name={activityIndicatorIcon}
              size={12}
              color={allActivitiesCompleted ? '#065F46' : hasActivities ? '#4338CA' : '#64748B'}
            />
            <Text
              style={[
                styles.activityIndicatorText,
                allActivitiesCompleted && styles.activityIndicatorTextComplete,
                !hasActivities && styles.activityIndicatorTextEmpty,
              ]}
            >
              {activityIndicator}
            </Text>
          </View>
        </View>

        <View style={styles.cardProgressSection}>
          <View style={styles.cardProgressTrack}>
            <View
              style={[
                styles.cardProgressFill,
                { width: `${chapterProgress}%`, backgroundColor: cardAccentColor },
              ]}
            />
          </View>
          <Text style={styles.cardProgressText}>{chapterProgress}%</Text>
        </View>
      </View>

      {/* Arrow */}
      <View style={styles.cardArrow}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isCompleted ? '#10B981' : '#CBD5E1'}
        />
      </View>
    </Pressable>
  );
};

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function ChaptersScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { chapters, progress } = useProgress();
  const completedTopics = progress.completedTopics;
  const totalTopics = chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
  const progressPercent =
    totalTopics > 0 ? Math.min(100, Math.round((completedTopics / totalTopics) * 100)) : 0;

  const completedChapters = progress.completedChapters;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <View style={[styles.heroCard, styles.heroGradient]}>
        {/* Decorative circles */}
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />

        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>LEARNING MODULE</Text>
              <Text style={styles.heroTitle}>Your Journey</Text>
              <Text style={styles.heroSubtitle}>
                {completedChapters} of {chapters.length} chapters completed
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{progressPercent}% complete</Text>
              <Text style={styles.progressText}>
                {completedTopics}/{totalTopics} topics done
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Section Header ───────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chapters</Text>
        <Text style={styles.sectionCount}>{chapters.length} total</Text>
      </View>

      {/* ─── Chapter Cards ────────────────────────────────────────────── */}
      <View style={styles.list}>
        {chapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            onPress={() => navigation.navigate('ChapterDetail', { chapterId: chapter.id })}
          />
        ))}
      </View>

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
  heroGradient: {
    backgroundColor: '#4F46E5',
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
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  progressSection: {
    gap: 10,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FBBF24',
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

  // ─── Progress Ring ────────────────────────────────────────────────
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ringBg: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  ringFill: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
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

  // ─── Chapter Cards ───────────────────────────────────────────────
  list: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    overflow: 'hidden',
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
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.03,
  },
  cardAccent: {
    width: 5,
  },
  cardImageFrame: {
    width: 100,
    height: 100,
    marginLeft: 10,
    marginRight: -5,
    padding: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  cardBody: {
    flex: 1,
    padding: 18,
    paddingRight: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chapterNumberBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chapterNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activityIndicatorRow: {
    marginTop: 4,
    marginBottom: 2,
  },
  activityIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  activityIndicatorPillComplete: {
    backgroundColor: '#DCFCE7',
    borderColor: '#A7F3D0',
  },
  activityIndicatorPillEmpty: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  activityIndicatorText: {
    color: '#4338CA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  activityIndicatorTextComplete: {
    color: '#065F46',
  },
  activityIndicatorTextEmpty: {
    color: '#64748B',
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cardProgressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  cardProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    overflow: 'hidden',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  cardProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  cardArrow: {
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 4,
  },
});