import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

export interface ProgressTrackerProps {
  learningProgress: number;
  quizProgress: number;
  activitiesProgress: number;
  overallProgress?: number;
  size?: number;
  strokeWidth?: number;
  showScore?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  learningProgress,
  quizProgress,
  activitiesProgress,
  overallProgress,
  size = 160,
  strokeWidth = 14,
  showScore = true,
}) => {
  const move = Math.min(Math.max(learningProgress, 0), 100);
  const exercise = Math.min(Math.max(quizProgress, 0), 100);
  const stand = Math.min(Math.max(activitiesProgress, 0), 100);
  const displayScore = overallProgress ?? Math.round((move + exercise + stand) / 3);

  const w = size;
  const stroke = strokeWidth;
  const cx = w / 2;
  const cy = w / 2;
  const outerRadius = Math.max((w / 2) - stroke / 2, 0);
  const middleRadius = Math.max(outerRadius - stroke, 4);
  const innerRadius = Math.max(middleRadius - stroke, 4);
  const holeRadius = Math.max(innerRadius - stroke * 0.8, 6);
  const fontSize = Math.max(16, Math.min(32, w * 0.22));

  const MOVE_COLORS = ['#FF6B6B', '#FF8A5B'];
  const EXERCISE_COLORS = ['#34C759', '#22C55E'];
  const STAND_COLORS = ['#0F62FF', '#3B82F6'];
  const TRACK_COLORS = {
    move: 'rgba(255, 107, 107, 0.16)',
    exercise: 'rgba(52, 199, 89, 0.16)',
    stand: 'rgba(15, 98, 255, 0.16)',
  };

  const getRingProps = (radius: number, percent: number) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);
    return { circumference, offset };
  };

  const outer = getRingProps(outerRadius, move);
  const middle = getRingProps(middleRadius, exercise);
  const inner = getRingProps(innerRadius, stand);

  return (
    <View style={[styles.container, { width: w, height: w }]}>
      <Svg width={w} height={w} viewBox={`0 0 ${w} ${w}`}>
        <Defs>
          <LinearGradient id="moveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={MOVE_COLORS[0]} />
            <Stop offset="100%" stopColor={MOVE_COLORS[1]} />
          </LinearGradient>
          <LinearGradient id="exerciseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={EXERCISE_COLORS[0]} />
            <Stop offset="100%" stopColor={EXERCISE_COLORS[1]} />
          </LinearGradient>
          <LinearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={STAND_COLORS[0]} />
            <Stop offset="100%" stopColor={STAND_COLORS[1]} />
          </LinearGradient>
        </Defs>

        <Circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke={TRACK_COLORS.move} strokeWidth={stroke} />
        <Circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="url(#moveGradient)"
          strokeWidth={stroke}
          strokeDasharray={outer.circumference}
          strokeDashoffset={outer.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        <Circle cx={cx} cy={cy} r={middleRadius} fill="none" stroke={TRACK_COLORS.exercise} strokeWidth={stroke} />
        <Circle
          cx={cx}
          cy={cy}
          r={middleRadius}
          fill="none"
          stroke="url(#exerciseGradient)"
          strokeWidth={stroke}
          strokeDasharray={middle.circumference}
          strokeDashoffset={middle.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        <Circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke={TRACK_COLORS.stand} strokeWidth={stroke} />
        <Circle
          cx={cx}
          cy={cy}
          r={innerRadius}
          fill="none"
          stroke="url(#standGradient)"
          strokeWidth={stroke}
          strokeDasharray={inner.circumference}
          strokeDashoffset={inner.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        <Circle cx={cx} cy={cy} r={holeRadius} fill="#FFFFFF" />
      </Svg>

      {showScore && (
        <View pointerEvents="none" style={styles.scoreOverlay}>
          <Text style={[styles.scoreText, { fontSize }]}>{displayScore}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: '#1F2937',
    fontWeight: '800',
    includeFontPadding: false,
  },
});

export default ProgressTracker;