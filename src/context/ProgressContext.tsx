import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Chapter, Progress, ActivityAttempt, Topic } from '../types';
import { chapters as initialChapters } from '../data/courseData';
import { buildQuizzes } from '../data/quizQuestions';
import { clearActivityAttempts, saveChapters, saveProgress, loadAllActivityAttempts, saveActivityAttempt, loadChapters, loadProgress, saveLastVisitedTopic, loadLastVisitedTopic, type LastVisitedTopic } from '../utils/storage';
import { syncProgress } from '../utils/api';
import { enqueue, startQueueProcessor } from '../utils/syncQueue';

// Increment this when course data structure changes (e.g., questions added/removed)
const CHAPTERS_DATA_VERSION = 6;

interface ProgressContextType {
  chapters: Chapter[];
  progress: Progress;
  lastVisitedTopic: LastVisitedTopic | null;
  previousVisitedTopic: LastVisitedTopic | null;
  setLastVisitedTopic: (topic: LastVisitedTopic | null) => void;
  markTopicComplete: (chapterId: number, topicId: string, completed: boolean, source?: 'learning' | 'activity' | 'quiz', unlockNext?: boolean) => void;
  markTopicsWithoutActivitiesThrough: (chapterId: number, topicId: string) => void;
  markQuizComplete: (chapterId: number, score: number) => void;
  recordActivityTaken: (attempt: ActivityAttempt, markComplete?: boolean) => void;
  recordQuizTaken: (chapterId: number, score: number) => void;
  resetProgress: () => void;
  getActivityAttemptsCount: (chapterId: number) => number;
}

const defaultProgress: Progress = {
  totalTopics: 0,
  completedTopics: 0,
  totalChapters: initialChapters.length,
  completedChapters: 0,
  learningProgress: 0,
  quizProgress: 0,
  activityProgress: 0,
  overallProgress: 0,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const initializeTopicLocking = (chapter: Chapter) => {
  let topics = chapter.topics.map((topic, index) => ({
    ...topic,
    locked: index > 0,
  }));

  // Unlock topics that have no activity and are after completed topics
  for (let i = 0; i < topics.length - 1; i++) {
    if (!topics[i].activity && !topics[i].locked && topics[i + 1]?.locked) {
      topics[i + 1] = { ...topics[i + 1], locked: false };
    }
  }

  return { ...chapter, topics };
};

const restoreTopicLocking = (chapter: Chapter) => {
  const topics = chapter.topics.map((topic, index) => ({
    ...topic,
    locked: topic.completed ? false : (topic.locked ?? index > 0),
  }));

  // Rebuild the unlock chain from saved completion state so that
  // after a reload, every topic that should be reachable remains unlocked.
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < topics.length - 1; i++) {
      if (topics[i].completed && topics[i + 1]?.locked) {
        topics[i + 1] = { ...topics[i + 1], locked: false };
        changed = true;
      }
    }
  }

  return { ...chapter, topics };
};

const seedQuizSnapshots = (chapters: Chapter[]): Chapter[] => {
  const quizBank = buildQuizzes(chapters);
  return chapters.map(chapter => {
    const snapshot = quizBank.find(quiz => quiz.chapterId === chapter.id);
    return snapshot ? { ...chapter, quizSnapshot: snapshot } : chapter;
  });
};

const mergeTopic = (canonical: Topic, stored?: Topic): Topic => ({
  ...canonical,
  completed: stored?.completed ?? canonical.completed,
  completedBy: stored?.completedBy ?? canonical.completedBy,
  locked: stored?.locked ?? canonical.locked,
  activity: canonical.activity ?? stored?.activity,
});

const mergeChapterData = (canonical: Chapter, stored?: Chapter): Chapter => {
  const storedTopics = new Map<string, Topic>();
  stored?.topics?.forEach(topic => storedTopics.set(topic.id, topic));

  const topics = canonical.topics.map(topic => mergeTopic(topic, storedTopics.get(topic.id)));

  return {
    ...canonical,
    topics,
    quizCompleted: stored?.quizCompleted ?? canonical.quizCompleted,
    highestQuizScore: stored?.highestQuizScore ?? canonical.highestQuizScore,
    quizSnapshot: stored?.quizSnapshot ?? canonical.quizSnapshot,
    quizAttempts: stored?.quizAttempts ?? canonical.quizAttempts,
    lastQuizAttemptAt: stored?.lastQuizAttemptAt ?? canonical.lastQuizAttemptAt,
  };
};

const unlockNextTopic = (chapter: Chapter & { topics: any[] }) => {
  const topics = [...chapter.topics];
  for (let i = 0; i < topics.length - 1; i++) {
    if (!topics[i].completed && topics[i + 1]?.locked) {
      break;
    }
    // Unlock next topic if current is completed
    if (topics[i].completed && topics[i + 1]?.locked) {
      topics[i + 1] = { ...topics[i + 1], locked: false };
      // If unlocked topic has no activity, recursively unlock the next one
      if (!topics[i + 1].activity && topics[i + 2]?.locked) {
        // Recursively process remaining topics
        for (let j = i + 1; j < topics.length - 1; j++) {
          if (!topics[j].activity && topics[j + 1]?.locked) {
            topics[j + 1] = { ...topics[j + 1], locked: false };
          } else {
            break; // Stop if we hit a topic with activity
          }
        }
      }
    }
  }
  return { ...chapter, topics };
};

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>(
    initialChapters.map(ch => initializeTopicLocking(ch))
  );
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [initialized, setInitialized] = useState(false);
  const [activityAttempts, setActivityAttempts] = useState<ActivityAttempt[]>([]);
  const [lastVisitedTopic, setLastVisitedTopicState] = useState<LastVisitedTopic | null>(null);
  const [previousVisitedTopic, setPreviousVisitedTopicState] = useState<LastVisitedTopic | null>(null);
  const chaptersRef = useRef(chapters);
  const activityAttemptsRef = useRef<ActivityAttempt[]>(activityAttempts);

  useEffect(() => {
    chaptersRef.current = chapters;
    activityAttemptsRef.current = activityAttempts;
  }, [chapters, activityAttempts]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedChapters = await loadChapters();
        const storedProgress = await loadProgress();

        if (storedChapters && storedChapters.length > 0) {
          const restoredChapters = initialChapters.map(canonicalChapter => {
            const storedChapter = storedChapters.find(saved => saved.id === canonicalChapter.id);
            return mergeChapterData(canonicalChapter, storedChapter);
          }).map(ch => restoreTopicLocking(ch));

          setChapters(restoredChapters);
          await saveChapters(restoredChapters);

          if (storedProgress) {
            setProgress(storedProgress);
          }

          await calculateProgress(restoredChapters);
        } else {
          const starterChapters = seedQuizSnapshots(initialChapters.map(ch => {
            const reset = {
              ...ch,
              topics: ch.topics.map((t: Topic) => ({ ...t, completed: false })),
              quizCompleted: false,
              highestQuizScore: 0,
            };
            return initializeTopicLocking(reset);
          }));

          setChapters(starterChapters);
          setProgress(defaultProgress);
          await saveChapters(starterChapters);
          await saveProgress(defaultProgress);
          await calculateProgress(starterChapters);
        }

        const storedLastTopic = await loadLastVisitedTopic();
        if (storedLastTopic) {
          setLastVisitedTopicState(storedLastTopic);
        }
      } catch (error) {
        console.error('Error initializing progress data:', error);
      } finally {
        setInitialized(true);
      }
    };

    initializeData();
    // start background queue processing for offline retry
    startQueueProcessor();
  }, []);

  const calculateProgress = async (currentChapters: Chapter[]) => {
    let totalTopics = 0;
    let completedTopics = 0; // total completed regardless of source (for informational use)
    let completedChapters = 0;
    let quizCompletedCount = 0;

    // counts for learning progress
    let learningTotalTopics = 0;
    let learningCompletedTopics = 0;

    // counts for activity progress
    let activityTopicsTotal = 0;

    const attempts = await loadAllActivityAttempts(); // returns ActivityAttempt[]
    // store attempts list so UI can query per-chapter attempted topics
    setActivityAttempts(attempts);
    const attemptedTopicKeys = new Set<string>(attempts.map(a => `${a.chapterId}:${a.topicId}`));

    currentChapters.forEach(chapter => {
      totalTopics += chapter.topics.length;

      // Learning totals: all topics count as learning materials
      learningTotalTopics += chapter.topics.length;

      // Activity topics total: only topics that have an activity defined
      activityTopicsTotal += chapter.topics.filter(t => !!t.activity).length;

      const chapterCompleted = chapter.topics.filter(t => t.completed).length;
      completedTopics += chapterCompleted;

      if (chapterCompleted === chapter.topics.length) {
        completedChapters++;
      }

      if (chapter.quizCompleted || (chapter.quizAttempts ?? 0) > 0) {
        quizCompletedCount++;
      }

      // learningCompleted: count all completed topics regardless of how they were finished
      chapter.topics.forEach(t => {
        if (t.completed) {
          learningCompletedTopics++;
        }
      });
    });

    // Quiz progress is percent of chapters with a quiz attempt or pass recorded
    const quizProgress = currentChapters.length > 0 ? Math.round((quizCompletedCount / currentChapters.length) * 100) : 0;

    // Learning progress: percent of topics completed by learning
    const learningProgress = learningTotalTopics > 0 ? Math.round((learningCompletedTopics / learningTotalTopics) * 100) : 0;

    // Activity progress: percent of activity topics that have at least one attempt, regardless of score.
    const attemptedActivitySet = new Set<string>();
    attempts.forEach(a => {
      attemptedActivitySet.add(`${a.chapterId}:${a.topicId}`);
    });
    const activityCompletedCount = attemptedActivitySet.size;
    const activityProgress = activityTopicsTotal > 0 ? Math.round((activityCompletedCount / activityTopicsTotal) * 100) : 0;

    const availableProgressComponents = [learningTotalTopics > 0, currentChapters.length > 0, activityTopicsTotal > 0].filter(Boolean).length;
    const overallSum = learningProgress + quizProgress + activityProgress;
    const overallProgress = availableProgressComponents > 0
      ? Math.round(overallSum / availableProgressComponents)
      : 0;

    // Compute additional multi-metric analytics
    const now = Date.now();

    // Consistency: % of days with activity in last 28 days
    const DAYS_WINDOW = 28;
    const daySet = new Set<string>();
    attempts.forEach(a => {
      if (!a || !a.attemptedAt) return;
      const d = new Date(a.attemptedAt);
      const dayKey = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      // Only count days within window
      if ((now - d.getTime()) <= DAYS_WINDOW * 24 * 60 * 60 * 1000) {
        daySet.add(dayKey);
      }
    });
    const daysWithActivity = daySet.size;
    const consistency = Math.min(100, Math.round((daysWithActivity / DAYS_WINDOW) * 100));

    // Interruptions: count gaps > 7 days between unique activity days (within full history)
    const uniqueDays = Array.from(new Set(attempts.map(a => {
      const d = new Date(a.attemptedAt);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }))).map(s => {
      const parts = s.split('-').map(Number);
      return new Date(parts[0], parts[1]-1, parts[2]).getTime();
    }).sort((a,b)=>a-b);

    let gaps = 0;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diffDays = Math.round((uniqueDays[i] - uniqueDays[i-1]) / (24*60*60*1000));
      if (diffDays > 7) gaps++;
    }
    const interruptions = Math.max(0, 100 - gaps * 20); // each large gap reduces score by 20

    // Duration proxy: engagement = attempted topics / total topics
    const duration = totalTopics > 0 ? Math.min(100, Math.round((attempts.length / totalTopics) * 100)) : 0;

    const newProgress: Progress = {
      totalTopics,
      completedTopics,
      totalChapters: currentChapters.length,
      completedChapters,
      learningProgress,
      quizProgress,
      activityProgress,
      overallProgress,
      duration,
      consistency,
      interruptions,
    };

    setProgress(newProgress);
    await saveProgress(newProgress);
    // try immediate sync; on failure enqueue for retry (offline support)
    (async () => {
      try {
        await syncProgress(newProgress);
      } catch (err) {
        await enqueue({ type: 'progress', payload: newProgress });
      }
    })();
  };

  const getActivityAttemptsCount = (chapterId: number) => {
    const attempts = activityAttemptsRef.current ?? activityAttempts;
    const topicSet = new Set(attempts.filter(a => a.chapterId === chapterId).map(a => a.topicId));
    return topicSet.size;
  };

  const recordActivityTaken = async (attempt: ActivityAttempt, markComplete: boolean = false) => {
    try {
      setActivityAttempts(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          (a) => a.chapterId === attempt.chapterId && a.topicId === attempt.topicId
        );

        if (existingIndex >= 0) {
          updated[existingIndex] = attempt;
        } else {
          updated.push(attempt);
        }

        activityAttemptsRef.current = updated;
        return updated;
      });

      await saveActivityAttempt(attempt);
      if (markComplete) {
        await markTopicComplete(attempt.chapterId, attempt.topicId, true, 'activity', false);
      }
      await calculateProgress(chaptersRef.current);
    } catch (err) {
      console.error('Error recording activity attempt:', err);
    }
  };

  const recordQuizTaken = async (chapterId: number, score: number) => {
    try {
      await markQuizComplete(chapterId, score);
    } catch (err) {
      console.error('Error recording quiz result:', err);
    }
  };

  const markTopicComplete = async (chapterId: number, topicId: string, completed: boolean, source: 'learning' | 'activity' | 'quiz' = 'learning', unlockNext: boolean = true) => {
    const updatedChapters = chaptersRef.current.map(chapter => {
      if (chapter.id === chapterId) {
        let updatedChapter = {
          ...chapter,
          topics: chapter.topics.map(topic =>
            topic.id === topicId ? { ...topic, completed, completedBy: completed ? source : undefined } : topic
          ),
        };

        if (completed && unlockNext) {
          updatedChapter = unlockNextTopic(updatedChapter);
        }

        return updatedChapter;
      }
      return chapter;
    });

    setChapters(updatedChapters);
    chaptersRef.current = updatedChapters;
    await saveChapters(updatedChapters);
    await calculateProgress(updatedChapters);
  };

  const markTopicsWithoutActivitiesThrough = async (chapterId: number, topicId: string) => {
    const updatedChapters = chaptersRef.current.map(chapter => {
      if (chapter.id !== chapterId) {
        return chapter;
      }

      const reachedTopicIndex = chapter.topics.findIndex(topic => topic.id === topicId);
      if (reachedTopicIndex === -1) {
        return chapter;
      }

      const updatedChapter = {
        ...chapter,
        topics: chapter.topics.map((topic, index) => {
          if (index <= reachedTopicIndex && !topic.activity && !topic.completed) {
            return { ...topic, completed: true, completedBy: 'learning' };
          }

          return topic;
        }),
      };

      return unlockNextTopic(updatedChapter as any);
    });

    setChapters(updatedChapters);
    chaptersRef.current = updatedChapters;
    await saveChapters(updatedChapters);
    await calculateProgress(updatedChapters);
  };

  const markQuizComplete = async (chapterId: number, score: number) => {
    const sanitizedScore = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));
    const updatedChapters = chaptersRef.current.map(chapter => {
      if (chapter.id === chapterId) {
        const previousBest = Math.max(0, Math.min(100, Number.isFinite(chapter.highestQuizScore ?? 0) ? (chapter.highestQuizScore ?? 0) : 0));
        const highestScore = Math.min(100, Math.max(previousBest, sanitizedScore));
        const attempts = (chapter as any).quizAttempts ?? 0;
        const newAttempts = attempts + 1;
        return {
          ...chapter,
          quizCompleted: highestScore >= 75,
          highestQuizScore: highestScore,
          quizAttempts: newAttempts,
          lastQuizAttemptAt: Date.now(),
        } as any;
      }
      return chapter;
    });

    setChapters(updatedChapters);
    chaptersRef.current = updatedChapters;
    await saveChapters(updatedChapters);
    await calculateProgress(updatedChapters);
  };

  const setLastVisitedTopic = useCallback(async (topic: LastVisitedTopic | null) => {
    setPreviousVisitedTopicState(lastVisitedTopic);
    setLastVisitedTopicState(topic);
    await saveLastVisitedTopic(topic);
  }, [lastVisitedTopic]);

  const resetProgress = async () => {
    const resetChapters = seedQuizSnapshots(initialChapters.map(ch => {
      const reset = {
        ...ch,
        topics: ch.topics.map(t => ({ ...t, completed: false })),
        quizCompleted: false,
        highestQuizScore: 0,
      };
      return initializeTopicLocking(reset);
    }));
    
    setChapters(resetChapters);
    chaptersRef.current = resetChapters;
    setProgress(defaultProgress);
    await saveProgress(defaultProgress);
    await calculateProgress(resetChapters);
    await saveLastVisitedTopic(null);
    await clearActivityAttempts();
    await saveChapters(resetChapters);
  };

  if (!initialized) {
    return null;
  }

  return (
    <ProgressContext.Provider
      value={{
        chapters,
        progress,
        lastVisitedTopic,
        previousVisitedTopic,
        setLastVisitedTopic,
        markTopicComplete,
        markTopicsWithoutActivitiesThrough,
        markQuizComplete,
        recordActivityTaken,
        recordQuizTaken,
        resetProgress,
        getActivityAttemptsCount,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
