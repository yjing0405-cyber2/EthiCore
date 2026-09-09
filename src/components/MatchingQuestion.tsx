import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MatchingPairData {
  left: string;
  options: string[];
  correctAnswer: number;
}

interface MatchingQuestionData {
  id: number;
  type: string;
  question: string;
  pairs: MatchingPairData[];
}

interface MatchingPair {
  id: string;
  left: string;
  right: string;
  originalOptionIndex: number;
}

interface MatchingQuestionProps {
  question: MatchingQuestionData;
  onAnswerSelect: (answers: number[]) => void;
  onDragChange?: (isDragging: boolean) => void;
}

const MATCHING_ROW_HEIGHT = 60;

const shuffleArray = <T,>(items: T[]) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ question, onAnswerSelect, onDragChange }) => {
  const [pairs, setPairs] = useState<MatchingPair[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragY = React.useRef(new Animated.Value(0)).current;
  const dragStartIndex = React.useRef<number | null>(null);

  // Important: do NOT call `onAnswerSelect` in a way that creates a render loop.
  // `question` is an object prop and its reference may change each render.
  // We only want to (re)initialize when the actual `pairs` content changes.
  useEffect(() => {
    if (!question.pairs) {
      setPairs([]);
      return;
    }

    const leftItems = question.pairs.map((pair: MatchingPairData) => pair.left);
    const rightOptions = question.pairs.map((pair: MatchingPairData) => ({
      text: pair.options[pair.correctAnswer],
      correctAnswer: pair.correctAnswer,
    }));

    const shuffledOptions = shuffleArray(rightOptions);

    const newPairs = leftItems.map((left: string, idx: number) => ({
      id: `pair-${idx}`,
      left,
      right: shuffledOptions[idx].text,
      originalOptionIndex: shuffledOptions[idx].correctAnswer,
    }));

    setPairs(newPairs);
    onAnswerSelect(newPairs.map(pair => pair.originalOptionIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, question.pairs?.length]);


  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 4,
      onPanResponderGrant: () => {
        dragStartIndex.current = index;
        setDraggingIndex(index);
        onDragChange?.(true);
        dragY.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dy: dragY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        const startIndex = dragStartIndex.current ?? index;
        const indexOffset = Math.round(gestureState.dy / MATCHING_ROW_HEIGHT);
        const targetIndex = Math.max(0, Math.min(pairs.length - 1, startIndex + indexOffset));

        if (startIndex !== targetIndex) {
          const newPairs = [...pairs];
          const [movedPair] = newPairs.splice(startIndex, 1);
          newPairs.splice(targetIndex, 0, movedPair);
          setPairs(newPairs);

          // Update answers based on new order
          const newAnswers = newPairs.map(pair => pair.originalOptionIndex);
          onAnswerSelect(newAnswers);
        }

        dragStartIndex.current = null;
        setDraggingIndex(null);
        onDragChange?.(false);
        dragY.setValue(0);
      },
      onPanResponderTerminate: () => {
        dragStartIndex.current = null;
        setDraggingIndex(null);
        onDragChange?.(false);
        dragY.setValue(0);
      },
      onShouldBlockNativeResponder: () => true,
    });

  return (
    <View style={styles.container}>
      <View style={styles.pairsContainer}>
        {pairs.map((pair, index) => {
          const isDragging = draggingIndex === index;
          const panResponder = createPanResponder(index);

          return (
            <View key={pair.id} style={styles.pairRow}>
              {/* Left side - Fixed item */}
              <View style={styles.leftContainer}>
                <Text style={styles.leftText}>{pair.left}</Text>
              </View>

              {/* Right side - Draggable answer */}
              <Animated.View
                style={[
                  styles.rightAnswerContainer,
                  isDragging && {
                    transform: [{ translateY: dragY }],
                    opacity: 0.8,
                    zIndex: 1000,
                  },
                  !isDragging && { zIndex: 0 },
                ]}
                {...panResponder.panHandlers}
              >
                <Text style={styles.rightText}>{pair.right}</Text>
                <View style={styles.dragHandle}>
                  <MaterialIcons name="drag-handle" size={20} color="#94A3B8" />
                </View>
              </Animated.View>
            </View>
          );
        })}
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          {pairs.length === 0 ? 'No pairs to match' : '↕ Drag answers to reorder'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pairsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    minHeight: 48,
  },
  leftContainer: {
    flex: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  rightAnswerContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#CBD5E1',
    gap: 6,
    zIndex: 0,
  },
  leftText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#1E293B',
  },
  rightText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
  },
  dragHandle: {
    padding: 2,
    alignSelf: 'center',
  },
  instructionContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  instructionText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
});

export default MatchingQuestion;
