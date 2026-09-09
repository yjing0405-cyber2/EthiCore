import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import CourseObjectivesScreen from '../screens/CourseObjectivesScreen';
import ChapterListScreen from '../screens/ChapterListScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';
import TopicScreen from '../screens/TopicScreen';
import ActivityScreen from '../screens/ActivityScreen';
import QuizHubScreen from '../screens/QuizHubScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import ScenarioGeneratorScreen from '../screens/ScenarioGeneratorScreen';
import ScenarioEvaluationScreen from '../screens/ScenarioEvaluationScreen';
import ConsequenceTimelineScreen from '../screens/ConsequenceTimelineScreen';
import DecisionOptionsScreen from '../screens/DecisionOptionsScreen';
import ScenarioChapterScreen from '../screens/ScenarioChapterScreen';
import ObjectivesNavigator from '../modules/objectives/ObjectivesNavigator';
import { Ionicons } from '../components/Ionicons';
import AnimatedBackground from '../components/AnimatedBackground';
import { APP_COLORS } from '../theme/appTheme';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const LearnStack = createStackNavigator<RootStackParamList>();

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ═══════════════════════════════════════════════
   Floating Glassmorphism Tab Bar — iOS Only
   Plain Material Tab Bar — Android
   ═══════════════════════════════════════════════ */

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 80 : 72;
const FLOATING_MARGIN = Platform.OS === 'ios' ? 20 : 16;
const FLOATING_WIDTH = Platform.OS === 'ios' ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 32;
const BORDER_RADIUS = Platform.OS === 'ios' ? 28 : 24;

const GlassmorphismTabBar = ({ state, descriptors, navigation }: any) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const activeRouteName = state.routes[state.index]?.name;
  const insets = useSafeAreaInsets();

  const isTopicScreen = state.routes.some((route: any) => route.name === 'Learn' && route.state?.routes?.some((child: any) => child.name === 'Topic'));
  const shouldHideTabBar = focusedOptions.tabBarVisible === false || activeRouteName === 'Home' || isTopicScreen;

  if (shouldHideTabBar) return null;

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          bottom: Platform.OS === 'android' ? insets.bottom : 0,
          height: Platform.OS === 'ios' ? TAB_BAR_HEIGHT + 20 : TAB_BAR_HEIGHT + 12,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
        },
      ]}
    >
      <View style={styles.tabBarWrapper}>
        {Platform.OS === 'ios' ? (
          /* iOS: Floating glassmorphism tab bar */
          <BlurView intensity={70} tint="light" style={styles.glassTabBar}>
            <View style={styles.glassInnerBorder} />
            <View style={styles.tabItemsRow}>
              {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                // Icon mapping
                let iconName = 'home-outline';
                if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                else if (route.name === 'Learn') iconName = isFocused ? 'book' : 'book-outline';
                else if (route.name === 'Objectives') iconName = isFocused ? 'flag' : 'flag-outline';
                else if (route.name === 'Quiz') iconName = isFocused ? 'book-pen' : 'book-pen-outline';
                else if (route.name === 'Scenarios') iconName = isFocused ? 'lightbulb' : 'lightbulb-outline';
                else if (route.name === 'Progress') iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';

                return (
                  <View key={route.key} style={styles.tabItem}>
                    <View 
                      style={[
                        styles.iconContainer,
                        isFocused && styles.iconContainerActive
                      ]}
                    >
                      <Ionicons 
                        name={iconName as any} 
                        size={22} 
                        color={isFocused ? APP_COLORS.primary : '#94A3B8'} 
                      />
                    </View>
                    <View style={styles.labelContainer}>
                      <View 
                        style={[
                          styles.activeIndicator,
                          isFocused && styles.activeIndicatorVisible
                        ]} 
                      />
                      <TouchableOpacity
                        style={styles.labelTouchable}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        activeOpacity={0.8}
                      >
                        <View style={styles.labelSpacer} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </BlurView>
        ) : (
          /* Android: Plain floating tab bar */
          <View style={styles.plainTabBar}>
            <View style={styles.tabItemsRow}>
              {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                let iconName = 'home-outline';
                if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                else if (route.name === 'Learn') iconName = isFocused ? 'book' : 'book-outline';
                else if (route.name === 'Objectives') iconName = isFocused ? 'flag' : 'flag-outline';
                else if (route.name === 'Quiz') iconName = isFocused ? 'book-pen' : 'book-pen-outline';
                else if (route.name === 'Scenarios') iconName = isFocused ? 'lightbulb' : 'lightbulb-outline';
                else if (route.name === 'Progress') iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';

                return (
                  <View key={route.key} style={styles.tabItem}>
                    <TouchableOpacity
                      style={styles.androidTabButton}
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      onPress={onPress}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.androidIconContainer, isFocused && styles.androidIconContainerActive]}>
                        <Ionicons 
                          name={iconName as any} 
                          size={22} 
                          color={isFocused ? APP_COLORS.primary : '#94A3B8'} 
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const FloatingBackgroundLayer = () => {
  return <AnimatedBackground />;
};

const LearnStackNavigator = () => {
  return (
    <LearnStack.Navigator initialRouteName="Chapters" screenOptions={{ headerShown: false }}>
      <LearnStack.Screen name="Chapters" component={ChapterListScreen} />
      <LearnStack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
      <LearnStack.Screen name="Topic" component={TopicScreen} />
      <LearnStack.Screen name="Activity" component={ActivityScreen} />
    </LearnStack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <GlassmorphismTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Objectives" component={ObjectivesNavigator} />
      <Tab.Screen name="Learn" component={LearnStackNavigator} />
      <Tab.Screen name="Quiz" component={QuizHubScreen} />
      <Tab.Screen name="Scenarios" component={ScenarioGeneratorScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <View style={styles.appShell}>
      <FloatingBackgroundLayer />
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CourseObjectives" component={CourseObjectivesScreen} />
      <Stack.Screen name="QuizHub" component={QuizHubScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizQuestion" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
      <Stack.Screen name="ScenarioGenerator" component={ScenarioGeneratorScreen} />
      <Stack.Screen name="ScenarioGeneratorHome" component={ScenarioGeneratorScreen} />
      <Stack.Screen name="ScenarioChapter" component={ScenarioChapterScreen} />
      <Stack.Screen name="ScenarioEvaluation" component={ScenarioEvaluationScreen} />
      <Stack.Screen name="ConsequenceTimeline" component={ConsequenceTimelineScreen} />
      <Stack.Screen name="DecisionOptions" component={DecisionOptionsScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appBackgroundLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7,
  },
  circleOne: {
    width: 190,
    height: 190,
    top: -24,
    left: -36,
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
  },
  circleTwo: {
    width: 140,
    height: 140,
    top: 220,
    right: -20,
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
  },
  circleThree: {
    width: 96,
    height: 96,
    bottom: 90,
    left: 44,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },

  /* ── Tab Bar Container ── */
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? 20 : 16),
    paddingHorizontal: FLOATING_MARGIN,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'box-none',
    zIndex: 100,
  },
  tabBarWrapper: {
    width: FLOATING_WIDTH,
    height: TAB_BAR_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },

  /* ── iOS Glassmorphism Tab Bar ── */
  glassTabBar: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.72)' : 'transparent',
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  glassInnerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  /* ── Android Plain Tab Bar ── */
  plainTabBar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },

  /* ── Tab Items ── */
  tabItemsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  androidTabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  androidIconContainerActive: {
    backgroundColor: 'rgba(99,102,241,0.10)',
  },

  /* ── iOS Icon & Label ── */
  iconContainer: {
    width: 44,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  labelContainer: {
    alignItems: 'center',
    height: 4,
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: APP_COLORS.primary,
    opacity: 0,
    marginBottom: 2,
  },
  activeIndicatorVisible: {
    opacity: 1,
  },

  /* ── Touchable Area ── */
  labelTouchable: {
    position: 'absolute',
    top: -50,
    left: -20,
    right: -20,
    bottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelSpacer: {
    width: 60,
    height: 60,
  },
});

export type { RootStackParamList } from './types';

export default RootNavigator;