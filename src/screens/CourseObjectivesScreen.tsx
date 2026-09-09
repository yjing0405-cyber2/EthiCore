import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chapters, courseObjectives } from '../data/courseData';
import { buildQuizzes } from '../data/quizQuestions';

const CourseObjectivesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const totalChapters = chapters.length;
  const totalQuestions = buildQuizzes(chapters).reduce(
    (sum: number, quiz: { questions: unknown[] }) => sum + quiz.questions.length,
    0,
  );

  // total activities across all chapters (one activity per topic)
  const totalActivities = chapters.reduce((sum, ch) => sum + ch.topics.filter((t: any) => !!t.activity).length, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="flag" size={32} color="#3B82F6" />
          </View>
          <Text style={styles.headerTitle}>Course Objectives</Text>
          <Text style={styles.headerSubtitle}>
            IT 65 - Social and Professional Issues
          </Text>
        </View>

        {/* Objectives Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Learning Goals</Text>
          <Text style={styles.cardSubtitle}>
            By the end of this course, students will be able to:
          </Text>

          {courseObjectives.map((objective: string, index: number) => (
            <View key={index} style={styles.objectiveItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, { width: '100%' }]}> 
            <View style={[styles.infoIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="school" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.infoValue}>IT 65</Text>
            <Text style={styles.infoLabel}>Course Code</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="book" size={24} color="#10B981" />
            </View>
            <Text style={styles.infoValue}>{totalChapters}</Text>
            <Text style={styles.infoLabel}>Chapters</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: '#c3efec' }]}>
               <Ionicons name="sparkles" size={24} color="#0F766E" />
            </View>
            <Text style={styles.infoValue}>{totalActivities}</Text>
            <Text style={styles.infoLabel}>Activities</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="help-circle" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.infoValue}>{totalQuestions}</Text>
            <Text style={styles.infoLabel}>Questions/Quiz</Text>
          </View>

          <View style={[styles.infoCard]}>
            <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#EF4444" />
            </View>
            <Text style={styles.infoValue}>75%</Text>
            <Text style={styles.infoLabel}>Passing Score</Text>
          </View>
        </View>

        {/* Note Card */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={styles.noteText}>
            This course covers essential topics for future IT professionals including 
            ethics, laws, privacy, intellectual property, and cybercrime regulations 
            in the Philippines.
          </Text>
        </View>

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
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  objectiveItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
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
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  noteCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#3B82F6',
    marginLeft: 12,
    lineHeight: 20,
  },

  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  tableSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  tableCellHeader: {
    fontWeight: '700',
    color: '#0F172A',
  },

  activityBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#10B981',
    marginRight: 6,
  },
});

export default CourseObjectivesScreen;
