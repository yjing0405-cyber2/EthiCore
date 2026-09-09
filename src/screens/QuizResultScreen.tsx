import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '../components/Ionicons';
import { useProgress } from '../context/ProgressContext';
import type { QuizStackParamList } from '../modules/quiz/types';

type QuizResultScreenProps = {
  navigation: StackNavigationProp<QuizStackParamList, 'QuizResult'>;
  route: RouteProp<QuizStackParamList, 'QuizResult'>;
};

const QuizResultScreen: React.FC<QuizResultScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { chapterId, score: rawScore, total: rawTotal, userAnswers, questions } = route.params;
  const { chapters } = useProgress();
  
  const chapter = chapters.find(c => c.id === chapterId);

  // ── DEFENSIVE SCORE CALCULATION ──
  // Recalculate from userAnswers + questions to ignore any upstream double-counting bugs.
  // Falls back to passed score if arrays are missing.
  const calculatedScore = React.useMemo(() => {
    if (questions && userAnswers && questions.length > 0) {
      return questions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
    }
    return rawScore || 0;
  }, [questions, userAnswers, rawScore]);

  const total = Math.max(rawTotal || 0, questions?.length || 0);
  const score = Math.min(calculatedScore, total); // Never exceed total
  const percentage = total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0;
  const passed = percentage >= 75;

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Text>Chapter not found</Text>
      </View>
    );
  }

  const handleContinue = () => {
    const rootNav = navigation as any;
    rootNav.navigate('MainTabs', { screen: 'Home' });
  };

  const handleRetake = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'MainTabs' },
          {
            name: 'QuizQuestion',
            params: { chapterId },
          },
        ],
      })
    );
  };

  const handleReview = () => {
    const rootNav = navigation as any;
    rootNav.navigate('MainTabs', {
      screen: 'Learn',
      params: {
        screen: 'ChapterDetail',
        params: { chapterId },
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.resultHeader,
          passed ? styles.resultHeaderPassed : styles.resultHeaderFailed,
          { paddingTop: insets.top + 24 }
        ]}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={passed ? "trophy" : "refresh-circle"} 
              size={70} 
              color="#fff" 
            />
          </View>
          
          <Text style={styles.resultTitle}>
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </Text>
          
          <Text style={styles.resultMessage}>
            {passed 
              ? 'You passed the quiz!' 
              : 'You need 75% to pass. Try again!'}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{percentage}%</Text>
            <Text style={styles.scoreDetail}>
              {score} out of {total} correct
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{total}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{score}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{total - score}</Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>
            </View>

            <View style={styles.passingInfo}>
              <Ionicons name="information-circle" size={20} color="#64748B" />
              <Text style={styles.passingText}>
                Passing score: 75%
              </Text>
            </View>
          </View>

          {/* Chapter Info */}
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterLabel}>Chapter {chapter.id}</Text>
            <Text style={styles.chapterTitle} numberOfLines={1}>
              {chapter.title}
            </Text>
          </View>

          {/* Detailed Answers - show correct answers and explanations */}
          {questions && userAnswers && (
            <View style={{ marginTop: 12 }}>
              {questions.map((q: any, idx: number) => {
                const userAns = userAnswers[idx];
                const correctIdx = q.correctAnswer;
                const correctText = q.options[correctIdx];
                const userText = typeof userAns === 'number' ? q.options[userAns] : 'No answer';
                const correct = userAns === correctIdx;

                return (
                  <View key={idx} style={styles.answerCard}>
                    <Text style={styles.questionText}>{idx + 1}. {q.question}</Text>
                    <Text style={styles.answerLabel}>Your answer: <Text style={correct ? styles.correctText : styles.incorrectText}>{userText}</Text></Text>
                    <Text style={styles.answerLabel}>Correct answer: <Text style={styles.correctText}>{correctText}</Text></Text>
                    <Text style={styles.explanationText}>{q.explanation}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!passed && (
          <TouchableOpacity 
            style={[styles.button, styles.retakeButton]}
            onPress={handleRetake}
          >
            <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
            <Text style={styles.retakeButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.reviewButton]}
          onPress={handleReview}
        >
          <Ionicons name="book" size={20} color="#64748B" />
          <Text style={styles.reviewButtonText}>Review Chapter</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.continueButton]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue Learning</Text>
          <Ionicons name="arrow-forward-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  resultHeader: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  resultHeaderPassed: {
    backgroundColor: '#10B981',
  },
  resultHeaderFailed: {
    backgroundColor: '#EF4444',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    minWidth: 160,
  },
  scoreLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreDetail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  passingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  passingText: {
    fontSize: 13,
    color: '#64748B',
  },
  answerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  questionText: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  answerLabel: {
    color: '#475569',
    marginBottom: 4,
  },
  correctText: {
    color: '#10B981',
    fontWeight: '700',
  },
  incorrectText: {
    color: '#EF4444',
    fontWeight: '700',
  },
  chapterInfo: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
  },
  chapterLabel: {
    fontSize: 12,
    color: '#3B82F6',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    // use margins on children instead of gap
  },
  retakeButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  reviewButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  explanationText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginTop: 8,
  },
});

export default QuizResultScreen;