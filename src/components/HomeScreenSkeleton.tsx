import React from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { APP_COLORS } from '../theme/appTheme';

const SkeletonPulse: React.FC<{ delay?: number; style?: any }> = ({ delay = 0, style }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, delay, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim, delay]);

  return (
    <Animated.View style={[styles.skeletonBase, style, { opacity: pulseAnim }]} />
  );
};

const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.heroCardSkeleton}>
        <SkeletonPulse style={styles.heroTitleSkeleton} />
        <SkeletonPulse style={styles.heroSubtitleSkeleton} delay={100} />
        <View style={styles.heroBodyRow}>
          <View style={styles.heroTextColumn}>
            <SkeletonPulse style={styles.heroLabelSkeleton} delay={150} />
            <SkeletonPulse style={styles.heroPercentSkeleton} delay={200} />
          </View>
          <SkeletonPulse style={styles.ringSkeleton} delay={250} />
        </View>
        <View style={styles.heroStatsRowSkeleton}>
          <SkeletonPulse style={styles.heroStatSkeleton} delay={300} />
          <SkeletonPulse style={styles.heroStatSkeleton} delay={330} />
          <SkeletonPulse style={styles.heroStatSkeleton} delay={360} />
        </View>
      </View>

      <View style={styles.resumeCardSkeleton}>
        <SkeletonPulse style={styles.resumeIconSkeleton} />
        <View style={styles.resumeContentSkeleton}>
          <SkeletonPulse style={styles.resumePillSkeleton} delay={100} />
          <SkeletonPulse style={styles.resumeTitleSkeleton} delay={130} />
          <SkeletonPulse style={styles.resumeSubtitleSkeleton} delay={160} />
          <SkeletonPulse style={styles.resumeBarSkeleton} delay={190} />
        </View>
        <SkeletonPulse style={styles.resumeCtaSkeleton} delay={220} />
      </View>

      <SkeletonPulse style={styles.sectionTitleSkeleton} delay={240} />

      <View style={styles.moduleGrid}>
        <SkeletonPulse style={styles.moduleCardSkeleton} delay={260} />
        <SkeletonPulse style={styles.moduleCardSkeleton} delay={290} />
        <SkeletonPulse style={styles.moduleCardSkeleton} delay={320} />
        <SkeletonPulse style={styles.moduleCardSkeleton} delay={350} />
      </View>

      <View style={styles.quoteCardSkeleton}>
        <SkeletonPulse style={styles.quoteIconSkeleton} delay={380} />
        <SkeletonPulse style={styles.quoteLineSkeleton} delay={400} />
        <SkeletonPulse style={styles.quoteLineShortSkeleton} delay={430} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
  },
  skeletonBase: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
  heroCardSkeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },
  heroTitleSkeleton: {
    width: 140,
    height: 30,
    borderRadius: 8,
    marginBottom: 8,
  },
  heroSubtitleSkeleton: {
    width: 240,
    height: 16,
    borderRadius: 6,
    marginBottom: 20,
  },
  heroBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroTextColumn: {
    flex: 1,
    marginRight: 12,
  },
  heroLabelSkeleton: {
    width: 120,
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  heroPercentSkeleton: {
    width: 96,
    height: 34,
    borderRadius: 10,
  },
  ringSkeleton: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  heroStatsRowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroStatSkeleton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
  },
  resumeCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  resumeIconSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 12,
  },
  resumeContentSkeleton: {
    flex: 1,
  },
  resumePillSkeleton: {
    width: 82,
    height: 18,
    borderRadius: 8,
    marginBottom: 8,
  },
  resumeTitleSkeleton: {
    width: '70%',
    height: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  resumeSubtitleSkeleton: {
    width: '55%',
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  resumeBarSkeleton: {
    width: '90%',
    height: 8,
    borderRadius: 4,
  },
  resumeCtaSkeleton: {
    width: 84,
    height: 40,
    borderRadius: 14,
    marginLeft: 12,
  },
  sectionTitleSkeleton: {
    width: 140,
    height: 20,
    borderRadius: 6,
    marginBottom: 14,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moduleCardSkeleton: {
    width: '48%',
    height: 160,
    borderRadius: 22,
    marginBottom: 14,
  },
  quoteCardSkeleton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  quoteIconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  quoteLineSkeleton: {
    width: '90%',
    height: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  quoteLineShortSkeleton: {
    width: '60%',
    height: 14,
    borderRadius: 6,
  },
});

export default HomeScreenSkeleton;