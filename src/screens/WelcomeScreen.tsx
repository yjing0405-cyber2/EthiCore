import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

const { width, height } = Dimensions.get('window');

/* ═══════════════════════════════════════════════
   COLOR PALETTE — Deep Ocean Cinematic
   ═══════════════════════════════════════════════ */
const COLORS = {
  gradient: {
    start: '#0F1B2E',
    mid1: '#1E3A5F',
    mid2: '#2D5A9E',
    end: '#4A7FC1',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.90)',
    tertiary: 'rgba(255,255,255,0.55)',
    muted: 'rgba(255,255,255,0.40)',
  },
  accent: {
    blue: '#60A5FA',
    indigo: '#4F46E5',
    purple: '#A78BFA',
    cyan: '#06B6D4',
  },
  orb: {
    blue: 'rgba(59,130,246,0.25)',
    cyan: 'rgba(6,182,212,0.20)',
    purple: 'rgba(99,102,241,0.18)',
  },
  glow: {
    blue: 'rgba(59,130,246,0.30)',
    purple: 'rgba(167,139,250,0.20)',
  },
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  // Core animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoGlowOpacity = useRef(new Animated.Value(0.4)).current;

  // Orbs
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;
  const orb3Y = useRef(new Animated.Value(0)).current;

  // Text reveals
  const titleReveal = useRef(new Animated.Value(0)).current;
  const subtitleReveal = useRef(new Animated.Value(0)).current;
  const institutionReveal = useRef(new Animated.Value(0)).current;
  const loaderReveal = useRef(new Animated.Value(0)).current;
  const progressReveal = useRef(new Animated.Value(0)).current;

  // Progress and exit
  const progressRotate = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  // Particles
  const particles = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.1),
      scale: new Animated.Value(Math.random() * 2 + 0.5),
      duration: Math.random() * 8000 + 4000,
      delay: Math.random() * 2000,
    }))
  ).current;

  // Create floating orb animation
  const createFloatAnimation = useCallback((
    anim: Animated.Value,
    range: number,
    duration: number,
    delay: number = 0
  ) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: -range,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(anim, {
          toValue: range,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
  }, []);

  // Create particle animation
  const createParticleAnimation = useCallback((particle: typeof particles[0]) => {
    const moveX = Animated.loop(
      Animated.sequence([
        Animated.timing(particle.x, {
          toValue: Math.random() * width,
          duration: particle.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    const moveY = Animated.loop(
      Animated.sequence([
        Animated.timing(particle.y, {
          toValue: Math.random() * height,
          duration: particle.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    const fade = Animated.loop(
      Animated.sequence([
        Animated.timing(particle.opacity, {
          toValue: 0.6,
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0.1,
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    return { moveX, moveY, fade };
  }, [width, height]);

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');
    StatusBar.setBarStyle('light-content');

    // Staggered entrance animation with custom cubic-bezier feel
    const entranceSequence = Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(titleReveal, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(subtitleReveal, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(institutionReveal, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(loaderReveal, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressReveal, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    // Logo gentle pulse with glow
    const logoPulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Logo glow opacity pulse
    const logoGlowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowOpacity, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoGlowOpacity, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Orb animations
    const orb1Anim = createFloatAnimation(orb1Y, 18, 5000, 0);
    const orb2Anim = createFloatAnimation(orb2Y, 22, 7000, 1000);
    const orb3Anim = createFloatAnimation(orb3Y, 14, 6000, 500);

    // Spinner rotation
    const spinnerAnim = Animated.loop(
      Animated.timing(progressRotate, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Progress bar fill
    const progressBarAnim = Animated.timing(progressBarWidth, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      delay: 1600,
    });

    // Start all animations
    entranceSequence.start();
    logoPulseAnim.start();
    logoGlowAnim.start();
    orb1Anim.start();
    orb2Anim.start();
    orb3Anim.start();
    spinnerAnim.start();
    progressBarAnim.start();

    // Particle animations
    const particleAnims = particles.map(p => {
      const anims = createParticleAnimation(p);
      anims.moveX.start();
      anims.moveY.start();
      anims.fade.start();
      return anims;
    });

    // Exit animation
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenFade, {
          toValue: 0,
          duration: 600,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: -20,
          duration: 600,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        StatusBar.setHidden(false, 'fade');
        navigation.replace('Home');
      });
    }, 4500);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false, 'fade');
      // Stop all animations
      entranceSequence.stop();
      logoPulseAnim.stop();
      logoGlowAnim.stop();
      orb1Anim.stop();
      orb2Anim.stop();
      orb3Anim.stop();
      spinnerAnim.stop();
      progressBarAnim.stop();
      particleAnims.forEach(a => {
        a.moveX.stop();
        a.moveY.stop();
        a.fade.stop();
      });
    };
  }, [navigation, createFloatAnimation, createParticleAnimation, particles, progressBarWidth]);

  const spin = progressRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressBarScale = progressBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      {/* Deep blue ocean gradient — 4-stop cinematic depth */}
      <LinearGradient
        colors={[
          COLORS.gradient.start,
          COLORS.gradient.mid1,
          COLORS.gradient.mid2,
          COLORS.gradient.end,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Subtle ambient orbs for depth with blur */}
      <Animated.View
        style={[
          styles.orb,
          {
            width: 320,
            height: 320,
            top: '5%',
            right: '-15%',
            backgroundColor: COLORS.orb.blue,
            transform: [{ translateY: orb1Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            width: 260,
            height: 260,
            bottom: '15%',
            left: '-12%',
            backgroundColor: COLORS.orb.cyan,
            transform: [{ translateY: orb2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            width: 200,
            height: 200,
            top: '45%',
            left: '55%',
            backgroundColor: COLORS.orb.purple,
            transform: [{ translateY: orb3Y }],
          },
        ]}
      />

      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideUp },
              { translateY: contentSlide },
            ],
          },
        ]}
      >
        {/* Logo Container with glow ring and glassmorphism */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Outer Glow */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                transform: [{ scale: logoPulse }],
                opacity: logoGlowOpacity,
              },
            ]}
          />
          {/* Glassmorphism Ring */}
          <BlurView intensity={15} style={styles.logoRing} tint="light">
            <View style={styles.logoInnerRing} />
          </BlurView>
          {/* Logo Wrapper */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/brain-logo.webp')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleReveal,
              transform: [
                {
                  translateY: titleReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Ethicore
        </Animated.Text>

        {/* Accent line — gradient animated */}
        <Animated.View
          style={[
            styles.accentLine,
            {
              opacity: subtitleReveal,
              transform: [
                {
                  scaleX: subtitleReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleReveal,
              transform: [
                {
                  translateY: subtitleReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Social and Professional Issues
        </Animated.Text>

        {/* Institution */}
        <Animated.Text
          style={[
            styles.institution,
            {
              opacity: institutionReveal,
              transform: [
                {
                  translateY: institutionReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          DOMINICAN COLLEGE OF TARLAC, INC.
          College of Computer Studies
        </Animated.Text>

                          <Animated.View
          style={[
            styles.sealsRow,
            {
              opacity: institutionReveal,
              transform: [
                {
                  translateY: institutionReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={require('../assets/dct-seal.webp')} style={[styles.sealImage, styles.dctSealImage]} resizeMode="contain" />
          <Image source={require('../assets/ccs-seal.webp')} style={styles.sealImage} resizeMode="contain" />
        </Animated.View>

        {/* Loading Section */}
        <Animated.View
          style={[
            styles.loaderSection,
            { opacity: loaderReveal },
          ]}
        >
          {/* Modern SVG Spinner */}
          <View style={styles.spinnerContainer}>
            <Animated.View
              style={[
                styles.spinner,
                { transform: [{ rotate: spin }] },
              ]}
            >
              <View style={styles.spinnerTrack} />
              <View style={styles.spinnerHead} />
            </Animated.View>
          </View>
          <Text style={styles.loaderText}>PREPARING YOUR EXPERIENCE</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom Progress Bar */}
      <Animated.View
        style={[
          styles.progressContainer,
          { opacity: progressReveal },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              transform: [{ scaleX: progressBarScale }],
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Orb styles — large blurred ambient lights
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
    filter: Platform.OS === 'web' ? 'blur(40px)' : undefined,
  },

  // Floating particles
  particle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  // Content container
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },

  // Logo
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: COLORS.glow.blue,
    filter: Platform.OS === 'web' ? 'blur(15px)' : undefined,
  },
  logoRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  logoInnerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },

  // Title
  title: {
    color: COLORS.text.primary,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },

  // Accent line — gradient
  accentLine: {
    width: 60,
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.accent.blue,
    marginVertical: 16,
    shadowColor: COLORS.accent.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  // Subtitle
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // Institution
  institution: {
    color: COLORS.text.tertiary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 2.5,
    marginBottom: 24,
  },

  // Loader section
  loaderSection: {
    alignItems: 'center',
    gap: 14,
  },
  spinnerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerTrack: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  spinnerHead: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: COLORS.accent.blue,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    shadowColor: COLORS.accent.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  loaderText: {
    color: COLORS.text.tertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  sealsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 12,
  },
  sealImage: {
    width: 80,
    height: 74,
    opacity: 0.95,
  },
  dctSealImage: {
    transform: [{ scale: 1.04 }],
  },

  // Progress bar
  progressContainer: {
    position: 'absolute',
    bottom: 60,
    left: '50%',
    marginLeft: -70,
    width: 140,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.accent.blue,
    borderRadius: 2,
    shadowColor: COLORS.accent.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});

export default WelcomeScreen;