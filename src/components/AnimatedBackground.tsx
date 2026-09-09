import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

const AnimatedBackground: React.FC = () => {
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const circle4Anim = useRef(new Animated.Value(0)).current;
  const circle5Anim = useRef(new Animated.Value(0)).current;
  const circle6Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle1Anim, { toValue: 1, duration: 7800, useNativeDriver: true }),
          Animated.timing(circle1Anim, { toValue: 0, duration: 7800, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle2Anim, { toValue: 1, duration: 9600, delay: 1400, useNativeDriver: true }),
          Animated.timing(circle2Anim, { toValue: 0, duration: 9600, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle3Anim, { toValue: 1, duration: 11200, delay: 2600, useNativeDriver: true }),
          Animated.timing(circle3Anim, { toValue: 0, duration: 11200, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle4Anim, { toValue: 1, duration: 10400, delay: 800, useNativeDriver: true }),
          Animated.timing(circle4Anim, { toValue: 0, duration: 10400, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle5Anim, { toValue: 1, duration: 11800, delay: 2200, useNativeDriver: true }),
          Animated.timing(circle5Anim, { toValue: 0, duration: 11800, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(circle6Anim, { toValue: 1, duration: 13600, delay: 3200, useNativeDriver: true }),
          Animated.timing(circle6Anim, { toValue: 0, duration: 13600, useNativeDriver: true }),
        ]),
      ),
    ];

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [circle1Anim, circle2Anim, circle3Anim, circle4Anim, circle5Anim, circle6Anim]);

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const circle4TranslateY = circle4Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const circle5TranslateY = circle5Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] });
  const circle6TranslateY = circle6Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <View style={styles.container} pointerEvents="none">
      <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.floatingCircle, styles.circleOne, { transform: [{ translateY: circle1TranslateY }] }]} />
      <Animated.View style={[styles.floatingCircle, styles.circleTwo, { transform: [{ translateY: circle2TranslateY }] }]} />
      <Animated.View style={[styles.floatingCircle, styles.circleThree, { transform: [{ translateY: circle3TranslateY }] }]} />
      <Animated.View style={[styles.floatingCircle, styles.circleFour, { transform: [{ translateY: circle4TranslateY }] }]} />
      <Animated.View style={[styles.floatingCircle, styles.circleFive, { transform: [{ translateY: circle5TranslateY }] }]} />
      <Animated.View style={[styles.floatingCircle, styles.circleSix, { transform: [{ translateY: circle6TranslateY }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 1,
  },
  circleOne: {
    width: 320,
    height: 320,
    top: -80,
    left: -90,
    backgroundColor: 'rgba(59, 131, 246, 0.69)',
  },
  circleTwo: {
    width: 240,
    height: 240,
    top: 220,
    right: -70,
    backgroundColor: 'rgba(236, 72, 153, 0.30)',
  },
  circleThree: {
    width: 180,
    height: 180,
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.34)',
  },
  circleFour: {
    width: 140,
    height: 140,
    top: 520,
    right: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.24)',
  },
  circleFive: {
    width: 110,
    height: 110,
    top: 680,
    left: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.24)',
  },
  circleSix: {
    width: 150,
    height: 150,
    top: 860,
    right: 150,
    backgroundColor: 'rgba(14, 165, 233, 0.22)',
  },
});

export default AnimatedBackground;
