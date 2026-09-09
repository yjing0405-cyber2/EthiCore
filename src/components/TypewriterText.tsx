import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: any;
  pauseTyping?: boolean;
  resumeFrom?: number;
  showCursor?: boolean;
  cursorStyle?: any;
  cursorBlinkSpeed?: number;
  fadeIn?: boolean;
  fadeDuration?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onCharacterTyped?: (char: string, index: number) => void;
  // legacy name used by some screens
  onProgress?: (index: number) => void;
}

const sanitizeTypewriterText = (value?: string): string => {
  if (!value) return '';
  return String(value)
    .replace(/\bundefined\b/gi, '')
    .replace(/\bnull\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  style,
  pauseTyping = false,
  resumeFrom,
  showCursor = true,
  cursorStyle,
  cursorBlinkSpeed = 530,
  fadeIn = true,
  fadeDuration = 200,
  onStart,
  onComplete,
  onCharacterTyped,
  onProgress,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const indexRef = useRef(0);
  const charsRef = useRef<string[]>([]);
  const tokenEndIndexesRef = useRef<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(pauseTyping);
  const isRunningRef = useRef(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  const onCharacterTypedRef = useRef(onCharacterTyped);
  const onProgressRef = useRef(((_: number) => {}) as (index: number) => void);
  const resumeFromRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    isPausedRef.current = pauseTyping;
  }, [pauseTyping]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onCharacterTypedRef.current = onCharacterTyped;
  }, [onCharacterTyped]);

  useEffect(() => {
    onProgressRef.current = onProgress ?? ((_: number) => {});
  }, [onProgress]);

  useEffect(() => {
    resumeFromRef.current = resumeFrom;
  }, [resumeFrom]);

  // Cursor blink animation
  useEffect(() => {
    if (!showCursor) return;
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: cursorBlinkSpeed, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: cursorBlinkSpeed, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [showCursor, cursorBlinkSpeed, cursorOpacity]);

  // Fade-in animation
  useEffect(() => {
    if (fadeIn) {
      Animated.timing(fadeAnim, { toValue: 1, duration: fadeDuration, useNativeDriver: true }).start();
    }
  }, [fadeIn, fadeDuration, fadeAnim]);

  const typeNextChar = useCallback(() => {
    if (isPausedRef.current) {
      timeoutRef.current = setTimeout(typeNextChar, 100);
      return;
    }

    const chars = charsRef.current;
    const idx = indexRef.current;

    if (idx >= chars.length) {
      setIsComplete(true);
      isRunningRef.current = false;
      onCompleteRef.current?.();
      return;
    }

    const tokenBoundaries = tokenEndIndexesRef.current;
    const nextIndex = tokenBoundaries.find(boundary => boundary > idx) ?? chars.length;
    const word = chars.slice(idx, nextIndex).join('');
    const newText = chars.slice(0, nextIndex).join('');

    setDisplayedText(newText);
    indexRef.current = nextIndex;
    onCharacterTypedRef.current?.(word, idx);
    onProgressRef.current?.(nextIndex);

    const hasTrailingPunctuation = /[.!?,:;]\s*$/.test(word);
    const delay = speed * Math.max(1, nextIndex - idx) + (hasTrailingPunctuation ? speed * 2 : 0);
    timeoutRef.current = setTimeout(typeNextChar, delay);
  }, [speed, onComplete, onCharacterTyped]);

  // Main effect to start/restart typing when text changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const cleanedText = sanitizeTypewriterText(text);

    if (!cleanedText) {
      setDisplayedText('');
      setIsComplete(false);
      indexRef.current = 0;
      charsRef.current = [];
      tokenEndIndexesRef.current = [];
      isRunningRef.current = false;
      return;
    }

    // Reset according to resumeFrom if provided
    const initialIndex = Math.max(0, Math.min(cleanedText.length, resumeFromRef.current ?? 0));
    charsRef.current = Array.from(cleanedText);
    tokenEndIndexesRef.current = [];
    let charCount = 0;
    // Split into word tokens (word + following whitespace). We'll group two words per typing step.
    const tokens = cleanedText.match(/(\S+\s*)/g) ?? [];
    for (let i = 0; i < tokens.length; i++) {
      charCount += tokens[i].length;
      // Push a boundary after every two tokens, or at the end if odd number of tokens
      if (i % 2 === 1 || i === tokens.length - 1) {
        tokenEndIndexesRef.current.push(charCount);
      }
    }

    indexRef.current = initialIndex;
    setDisplayedText(cleanedText.slice(0, initialIndex));
    setIsComplete(initialIndex >= charsRef.current.length);
    isRunningRef.current = initialIndex < charsRef.current.length;
    if (initialIndex === 0) onStartRef.current?.();

    if (initialIndex < charsRef.current.length) typeNextChar();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, typeNextChar, onStart]);

  const cursorColor = cursorStyle?.color || (style?.color || '#0F172A');

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={style}>
        {displayedText}
        {showCursor && !isComplete && (
          <Animated.Text
            style={[
              styles.cursor,
              { color: cursorColor, opacity: cursorOpacity },
              cursorStyle,
            ]}
          >
            |
          </Animated.Text>
        )}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    fontWeight: '300',
    fontSize: 16,
    includeFontPadding: false,
  },
});

export default TypewriterText;