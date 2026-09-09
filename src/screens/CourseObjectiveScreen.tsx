import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { courseObjectives } from '../data/courseData';
import { Ionicons } from '../components/Ionicons';

const { width } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<any>;
};

const CourseObjectiveScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Fixed Header with Gradient */}
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonBg}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <Text style={styles.headerLabel}>Course Overview</Text>
          <Text style={styles.headerTitle}>Course Objectives</Text>
          <Text style={styles.headerSubtitle}>
            These goals guide your learning journey and shape the activities across the app.
          </Text>
        </View>

        {/* Decorative bottom curve */}

      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Objectives Card */}
        <View style={styles.objectivesCard}>
          {courseObjectives.map((objective, index) => (
            <View
              key={`${objective}-${index}`}
              style={[
                styles.objectiveRow,
                index === courseObjectives.length - 1 && styles.objectiveRowLast,
              ]}
            >
              {/* Number Badge */}
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>

              {/* Content */}
              <View style={styles.objectiveContent}>
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>

              {/* Check indicator */}
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={22} color="#C7D2FE" />
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    position: 'relative',
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButtonBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    paddingBottom: 32,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: width - 80,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  objectivesCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOpacity: 0.08,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 0,
      },
    }),
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  objectiveRowLast: {
    borderBottomWidth: 0,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  numberText: {
    color: '#4F46E5',
    fontWeight: '800',
    fontSize: 14,
  },
  objectiveContent: {
    flex: 1,
    paddingRight: 8,
  },
  objectiveText: {
    color: '#1E293B',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  checkIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CourseObjectiveScreen;