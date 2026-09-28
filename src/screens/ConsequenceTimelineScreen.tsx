import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '../components/Ionicons';
import { chapters, courseObjectives } from '../data/courseData';
import { evaluateWithGemini } from '../services/geminiBridge';

type DecisionCategory = 'ethical' | 'mixed' | 'unethical';
type ConsequenceStage = 'Immediate' | 'Ripple' | 'Long-Term';

const chapterOneConsequenceImages: Record<number, Record<DecisionCategory, Record<ConsequenceStage, () => ImageSourcePropType>>> = {
  1: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/1/Ethical/i1e.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/1/Ethical/r1e.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/1/Ethical/l1e.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/1/Mixed/i1m.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/1/Mixed/r1m.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/1/Mixed/l1m.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/1/Unethical/i1u.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/1/Unethical/r1u.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/1/Unethical/l1u.webp'),
    },
  },
  2: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/2/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/2/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/2/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/2/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/2/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/2/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/2/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/2/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/2/Unethical/l.webp'),
    },
  },
  3: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/3/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/3/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/3/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/3/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/3/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/3/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/3/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/3/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/3/Unethical/l.webp'),
    },
  },
  4: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/4/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/4/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/4/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/4/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/4/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/4/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/4/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/4/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/4/Unethical/l.webp'),
    },
  },
  5: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/5/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/5/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/5/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/5/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/5/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/5/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_1/5/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_1/5/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_1/5/Unethical/l.webp'),
    },
  },
  6: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/6/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/6/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/6/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/6/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/6/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/6/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/6/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/6/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/6/Unethical/l.webp'),
    },
  },
  7: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/7/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/7/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/7/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/7/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/7/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/7/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/7/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/7/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/7/Unethical/l.webp'),
    },
  },
  8: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/8/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/8/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/8/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/8/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/8/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/8/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/8/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/8/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/8/Unethical/l.webp'),
    },
  },
  9: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/9/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/9/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/9/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/9/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/9/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/9/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/9/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/9/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/9/Unethical/l.webp'),
    },
  },
  10: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/10/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/10/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/10/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/10/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/10/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/10/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/10/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/10/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/10/Unethical/l.webp'),
    },
  },
  11: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/11/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/11/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/11/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/11/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/11/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/11/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/11/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/11/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/11/Unethical/l.webp'),
    },
  },
  12: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/12/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/12/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/12/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/12/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/12/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/12/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/12/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/12/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/12/Unethical/l.webp'),
    },
  },
  13: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/13/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/13/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/13/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/13/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/13/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/13/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/13/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/13/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/13/Unethical/l.webp'),
    },
  },
  14: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/14/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/14/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/14/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/14/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/14/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/14/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/14/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/14/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/14/Unethical/l.webp'),
    },
  },
  15: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/15/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/15/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/15/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/15/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/15/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/15/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_2/15/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_2/15/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_2/15/Unethical/l.webp'),
    },
  },
  16: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/16/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/16/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/16/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/16/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/16/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/16/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/16/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/16/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/16/Unethical/l.webp'),
    },
  },
  17: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/17/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/17/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/17/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/17/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/17/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/17/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/17/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/17/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/17/Unethical/l.webp'),
    },
  },
  18: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/18/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/18/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/18/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/18/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/18/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/18/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/18/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/18/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/18/Unethical/l.webp'),
    },
  },
  19: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/19/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/19/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/19/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/19/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/19/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/19/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/19/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/19/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/19/Unethical/l.webp'),
    },
  },
  20: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/20/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/20/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/20/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/20/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/20/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/20/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/20/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/20/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/20/Unethical/l.webp'),
    },
  },
  21: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/21/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/21/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/21/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/21/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/21/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/21/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/21/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/21/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/21/Unethical/l.webp'),
    },
  },
  22: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/22/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/22/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/22/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/22/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/22/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/22/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/22/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/22/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/22/Unethical/l.webp'),
    },
  },
  23: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/23/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/23/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/23/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/23/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/23/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/23/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/23/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/23/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/23/Unethical/l.webp'),
    },
  },
  24: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/24/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/24/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/24/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/24/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/24/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/24/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/24/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/24/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/24/Unethical/l.webp'),
    },
  },
  25: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/25/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/25/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/25/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/25/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/25/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/25/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_3/25/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_3/25/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_3/25/Unethical/l.webp'),
    },
  },
  26: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/26/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/26/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/26/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/26/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/26/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/26/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/26/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/26/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/26/Unethical/l.webp'),
    },
  },
  27: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/27/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/27/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/27/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/27/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/27/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/27/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/27/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/27/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/27/Unethical/l.webp'),
    },
  },
  28: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/28/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/28/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/28/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/28/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/28/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/28/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/28/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/28/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/28/Unethical/l.webp'),
    },
  },
  29: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/29/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/29/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/29/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/29/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/29/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/29/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/29/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/29/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/29/Unethical/l.webp'),
    },
  },
  30: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/30/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/30/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/30/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/30/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/30/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/30/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/30/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/30/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/30/Unethical/l.webp'),
    },
  },
  31: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/31/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/31/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/31/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/31/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/31/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/31/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/31/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/31/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/31/Unethical/l.webp'),
    },
  },
  32: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/32/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/32/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/32/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/32/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/32/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/32/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/32/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/32/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/32/Unethical/l.webp'),
    },
  },
  33: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/33/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/33/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/33/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/33/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/33/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/33/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/33/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/33/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/33/Unethical/l.webp'),
    },
  },
  34: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/34/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/34/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/34/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/34/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/34/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/34/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/34/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/34/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/34/Unethical/l.webp'),
    },
  },
  35: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/35/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/35/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/35/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/35/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/35/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/35/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_4/35/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_4/35/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_4/35/Unethical/l.webp'),
    },
  },
  36: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/36/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/36/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/36/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/36/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/36/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/36/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/36/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/36/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/36/Unethical/l.webp'),
    },
  },
  37: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/37/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/37/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/37/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/37/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/37/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/37/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/37/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/37/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/37/Unethical/l.webp'),
    },
  },
  38: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/38/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/38/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/38/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/38/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/38/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/38/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/38/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/38/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/38/Unethical/l.webp'),
    },
  },
  39: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/39/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/39/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/39/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/39/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/39/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/39/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/39/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/39/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/39/Unethical/l.webp'),
    },
  },
  40: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/40/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/40/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/40/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/40/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/40/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/40/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_5/40/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_5/40/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_5/40/Unethical/l.webp'),
    },
  },
  41: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/41/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/41/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/41/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/41/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/41/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/41/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/41/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/41/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/41/Unethical/l.webp'),
    },
  },
  42: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/42/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/42/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/42/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/42/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/42/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/42/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/42/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/42/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/42/Unethical/l.webp'),
    },
  },
  43: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/43/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/43/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/43/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/43/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/43/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/43/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/43/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/43/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/43/Unethical/l.webp'),
    },
  },
  44: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/44/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/44/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/44/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/44/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/44/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/44/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/44/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/44/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/44/Unethical/l.webp'),
    },
  },
  45: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/45/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/45/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/45/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/45/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/45/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/45/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_6/45/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_6/45/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_6/45/Unethical/l.webp'),
    },
  },
  46: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/46/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/46/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/46/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/46/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/46/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/46/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/46/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/46/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/46/Unethical/l.webp'),
    },
  },
  47: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/47/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/47/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/47/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/47/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/47/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/47/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/47/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/47/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/47/Unethical/l.webp'),
    },
  },
  48: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/48/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/48/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/48/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/48/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/48/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/48/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/48/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/48/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/48/Unethical/l.webp'),
    },
  },
  49: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/49/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/49/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/49/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/49/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/49/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/49/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/49/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/49/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/49/Unethical/l.webp'),
    },
  },
  50: {
    ethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/50/Ethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/50/Ethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/50/Ethical/l.webp'),
    },
    mixed: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/50/Mixed/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/50/Mixed/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/50/Mixed/l.webp'),
    },
    unethical: {
      Immediate: () => require('../assets/ConsequenceImages/Chapter_7/50/Unethical/i.webp'),
      Ripple: () => require('../assets/ConsequenceImages/Chapter_7/50/Unethical/r.webp'),
      'Long-Term': () => require('../assets/ConsequenceImages/Chapter_7/50/Unethical/l.webp'),
    },
  },
};

const getConsequenceImageLoader = (
  chapter?: number,
  scenarioNumber?: number,
  category?: DecisionCategory,
  stage?: ConsequenceStage,
): (() => ImageSourcePropType) | null => {
  if (![1, 2, 3, 4, 5, 6, 7].includes(chapter ?? 0) || !scenarioNumber || !category || !stage) return null;
  const chapterImages = chapterOneConsequenceImages[scenarioNumber];
  if (!chapterImages) return null;
  const stageImages = chapterImages[category];
  return stageImages?.[stage] ?? null;
};

const getConsequenceImageSource = (
  chapter?: number,
  scenarioNumber?: number,
  category?: DecisionCategory,
  stage?: ConsequenceStage,
): ImageSourcePropType | null => {
  const loader = getConsequenceImageLoader(chapter, scenarioNumber, category, stage);
  return loader ? loader() : null;
};

const TOTAL_STEPS = 4;
const CURRENT_STEP = 3;

const chapterAccentMap = {
  1: { surface: '#F4F9FF', border: '#0F62FF35', title: '#1D4ED8', subtitle: '#3B82F6', pillBg: '#DBEAFE', accent: '#2563EB' },
  2: { surface: '#FFF7ED', border: '#F59E0B35', title: '#B45309', subtitle: '#D97706', pillBg: '#FDE68A', accent: '#F59E0B' },
  3: { surface: '#F0FDF4', border: '#10B98135', title: '#047857', subtitle: '#059669', pillBg: '#D1FAE5', accent: '#10B981' },
  4: { surface: '#FEF2F2', border: '#EF444435', title: '#B91C1C', subtitle: '#DC2626', pillBg: '#FECACA', accent: '#EF4444' },
  5: { surface: '#F5F3FF', border: '#8B5CF635', title: '#6D28D9', subtitle: '#7C3AED', pillBg: '#EDE9FE', accent: '#8B5CF6' },
  6: { surface: '#ECFEFF', border: '#06B6D435', title: '#0F766E', subtitle: '#0D9488', pillBg: '#A5F3FC', accent: '#06B6D4' },
  7: { surface: '#FFF1F2', border: '#EC489935', title: '#BE185D', subtitle: '#DB2777', pillBg: '#FBCFE8', accent: '#EC4899' },
};

const ConsequenceTimelineScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const insets = useSafeAreaInsets();
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const { decision, scenario, stage = 'Immediate' } = route.params || {};
  const chapterTitle = route.params?.chapterTitle ?? scenario?.chapterTitle ?? `Chapter ${scenario?.chapterId ?? scenario?.chapter ?? 1}`;
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [evaluationDots, setEvaluationDots] = useState('');
  const [isStageImageReady, setIsStageImageReady] = useState(false);
  const evaluationVerdict = decision?.evaluationResult?.verdict;
  const illustrationCategory = decision?.consequenceImageCategory;
  const normalizedDecisionCategory: DecisionCategory | undefined =
    illustrationCategory === 'ethical' || illustrationCategory === 'mixed' || illustrationCategory === 'unethical'
      ? illustrationCategory
      : evaluationVerdict === 'ethical' || evaluationVerdict === 'unethical'
        ? evaluationVerdict
        : undefined;
  const chapterNumber = Number(scenario?.chapter ?? scenario?.chapterId ?? scenario?.additionalNotes?.chapter ?? 0);
  const accent = chapterAccentMap[chapterNumber as keyof typeof chapterAccentMap] ?? chapterAccentMap[1];
  const scenarioNumber = Number(
    scenario?.scenarioNumber ?? scenario?.additionalNotes?.scenarioNumber ?? scenario?.id ?? 0,
  );
  const aiReasoning = decision?.aiReasoning || 'The system reviewed the choice using ethical principles and prepared the consequence timeline.';
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const courseContext = useMemo(() => {
    const curriculumChapters = chapters.filter(chapter => Number(chapter.id) <= 7);

    const topicContent = curriculumChapters.flatMap(chapter =>
      chapter.topics.map(topic => `${topic.title}: ${topic.summary} ${topic.contentSummary || ''}`),
    );

    return [...topicContent, ...courseObjectives].join('\n');
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1.16, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnimation, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnimation]);

  const uncapitalize = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
  const randomChoice = <T,>(items: ReadonlyArray<T>) => items[Math.floor(Math.random() * items.length)];

  const randomizeConsequenceText = (stageKey: ConsequenceStage, baseText: string) => {
    const source = baseText?.trim();
    if (!source) return '';

    const candidates = {
      Immediate: [
        `${source}`,
        `Immediately, ${uncapitalize(source)}`,
        `Right away, ${uncapitalize(source)}`,
        `In the short term, ${uncapitalize(source)}`,
      ],
      Ripple: [
        `${source}`,
        `Soon, ${uncapitalize(source)}`,
        `This choice quickly spreads by ${uncapitalize(source)}`,
        `It also begins to ripple out because ${uncapitalize(source)}`,
      ],
      'Long-Term': [
        `${source}`,
        `Over time, ${uncapitalize(source)}`,
        `In the long term, ${uncapitalize(source)}`,
        `Eventually, ${uncapitalize(source)}`,
      ],
    } as const;

    return randomChoice(candidates[stageKey]);
  };

  const randomizeExplanationText = (stageKey: ConsequenceStage, baseExplanation: string) => {
    const source = baseExplanation?.trim();
    if (!source) return '';

    const candidates = [
      `${source}`,
      `This is because ${uncapitalize(source)}`,
      `That means ${uncapitalize(source)}`,
      `It reflects that ${uncapitalize(source)}`,
    ];

    return randomChoice(candidates);
  };

  type ConsequenceStage = 'Immediate' | 'Ripple' | 'Long-Term';
  const stageOrder: ConsequenceStage[] = ['Immediate', 'Ripple', 'Long-Term'];
  const currentIndex = stageOrder.indexOf(stage as ConsequenceStage);
  const nextStage = stageOrder[currentIndex + 1] as ConsequenceStage | undefined;
  const stageImageLoader = React.useMemo(
    () => getConsequenceImageLoader(
      chapterNumber,
      scenarioNumber,
      normalizedDecisionCategory,
      stage as ConsequenceStage,
    ),
    [chapterNumber, scenarioNumber, normalizedDecisionCategory, stage],
  );
  const stageImageSource = React.useMemo(() => (stageImageLoader ? stageImageLoader() : null), [stageImageLoader]);

  const randomizedStageContent = React.useMemo(() => ({
    Immediate: {
      description: randomizeConsequenceText('Immediate', decision?.immediate || 'The immediate outcome of your decision.'),
      explanation: randomizeExplanationText('Immediate', decision?.immediateExplanation || ''),
    },
    Ripple: {
      description: randomizeConsequenceText('Ripple', decision?.ripple || 'The broader impact on your team and organization.'),
      explanation: randomizeExplanationText('Ripple', decision?.rippleExplanation || ''),
    },
    'Long-Term': {
      description: randomizeConsequenceText('Long-Term', decision?.longTerm || 'The lasting consequences for your career and the organization.'),
      explanation: randomizeExplanationText('Long-Term', decision?.longTermExplanation || ''),
    },
  }), [decision?.id, decision?.immediate, decision?.ripple, decision?.longTerm, decision?.immediateExplanation, decision?.rippleExplanation, decision?.longTermExplanation]);

  type TimelineStage = {
    key: ConsequenceStage;
    label: string;
    icon: string;
    description: string;
    explanation: string;
    color: string;
    borderColor: string;
  };

  const timelineStages: TimelineStage[] = [
    {
      key: 'Immediate',
      label: 'Immediate',
      icon: '⚡',
      description: randomizedStageContent.Immediate.description,
      explanation: randomizedStageContent.Immediate.explanation,
      color: '#E8F1FF',
      borderColor: '#93C5FD',
    },
    {
      key: 'Ripple',
      label: 'Ripple Effect',
      icon: '🌊',
      description: randomizedStageContent.Ripple.description,
      explanation: randomizedStageContent.Ripple.explanation,
      color: '#E8F1FF',
      borderColor: '#93C5FD',
    },
    {
      key: 'Long-Term',
      label: 'Long-Term',
      icon: '🔮',
      description: randomizedStageContent['Long-Term'].description,
      explanation: randomizedStageContent['Long-Term'].explanation,
      color: '#E8F1FF',
      borderColor: '#93C5FD',
    },
  ];

  const currentStage = timelineStages.find((item) => item.key === stage) ?? timelineStages[0];
  const currentStep = stageOrder.indexOf(currentStage.key) + 1;
  const previousStage = currentIndex > 0 ? stageOrder[currentIndex - 1] as ConsequenceStage : undefined;
  const isFinalStage = !nextStage;

  const handleNext = async () => {
    if (!isFinalStage) {
      navigation.navigate('ConsequenceTimeline', {
        decision,
        scenario,
        stage: nextStage,
        chapterTitle,
      });
      return;
    }

    if (decision?.evaluationResult?.verdict === 'ethical' || decision?.evaluationResult?.verdict === 'unethical') {
      navigation.navigate('ScenarioEvaluation', { decision, scenario, chapterTitle });
      return;
    }

    if (isEvaluating) return;

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const result = await evaluateWithGemini(decision, scenario, courseContext);
      setIsEvaluating(false);
      navigation.navigate('ScenarioEvaluation', {
        decision: { ...decision, evaluationResult: result },
        scenario,
        chapterTitle,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setEvaluationError(message || 'The evaluation service is unavailable. Check your connection and retry.');
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    if (!isEvaluating) {
      setEvaluationDots('');
      return;
    }

    const interval = setInterval(() => {
      setEvaluationDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);

    return () => clearInterval(interval);
  }, [isEvaluating]);

  useEffect(() => {
    setIsStageImageReady(false);
  }, [stage, normalizedDecisionCategory, scenarioNumber, chapterNumber]);

  useEffect(() => {
    const animations = [
      Animated.loop(Animated.sequence([
        Animated.timing(circle1Anim, { toValue: 1, duration: 7600, useNativeDriver: true }),
        Animated.timing(circle1Anim, { toValue: 0, duration: 7600, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle2Anim, { toValue: 1, duration: 9600, delay: 1400, useNativeDriver: true }),
        Animated.timing(circle2Anim, { toValue: 0, duration: 9600, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(circle3Anim, { toValue: 1, duration: 11600, delay: 2600, useNativeDriver: true }),
        Animated.timing(circle3Anim, { toValue: 0, duration: 11600, useNativeDriver: true }),
      ])),
    ];

    animations.forEach(animation => animation.start());
    return () => animations.forEach(animation => animation.stop());
  }, [circle1Anim, circle2Anim, circle3Anim]);

  const circle1TranslateY = circle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const circle2TranslateY = circle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const circle3TranslateY = circle3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });


  const handlePrevious = () => {
    if (previousStage) {
      navigation.navigate('ConsequenceTimeline', {
        decision,
        scenario,
        stage: previousStage,
        chapterTitle,
      });
    } else {
      navigation.goBack();
    }
  };

  const renderProgressDots = () => (
    <View style={styles.progressRow}>
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === CURRENT_STEP;
        const isCompleted = stepNum < CURRENT_STEP;
        const dotStyle = isActive
          ? { backgroundColor: accent.accent, width: 24, transform: [{ scale: pulseAnimation }] }
          : isCompleted
            ? { backgroundColor: accent.accent, width: 12 }
            : { backgroundColor: `${accent.accent}40`, width: 6 };

        return <Animated.View key={stepNum} style={[styles.progressDot, dotStyle]} />;
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} pointerEvents="none">
        <Animated.View style={[styles.floatingCircle, styles.circleOne, { transform: [{ translateY: circle1TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleTwo, { transform: [{ translateY: circle2TranslateY }] }]} />
        <Animated.View style={[styles.floatingCircle, styles.circleThree, { transform: [{ translateY: circle3TranslateY }] }]} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: accent.surface, borderColor: accent.border, shadowColor: accent.accent, shadowOpacity: 0.16, shadowRadius: 14, elevation: 4 }]}>
          <View style={[styles.decorCircleTop, { backgroundColor: `${accent.accent}12` }]} />
          <View style={[styles.decorCircleBottom, { backgroundColor: `${accent.accent}0D` }]} />

          <View style={styles.heroContent}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
                <View style={styles.backButtonCircle}>
                  <Ionicons name="chevron-back" size={18} color="#0F172A" />
                </View>
              </TouchableOpacity>

              <View style={[styles.stepBadge, { backgroundColor: accent.pillBg }]}>
                <View style={[styles.stepDot, { backgroundColor: accent.accent }]} />
                <Text style={[styles.stepBadgeText, { color: accent.title }]}>STEP {CURRENT_STEP} OF {TOTAL_STEPS}</Text>
              </View>
            </View>

            <Text style={[styles.heroTitle, { color: accent.title }]}>Explore the consequence path</Text>
            <Text style={[styles.heroSubtitle, { color: accent.subtitle }]}>Review how your decision unfolds before moving to the final evaluation step.</Text>

            {renderProgressDots()}
          </View>
        </View>

        <View
          style={[
            styles.decisionCard,
            {
              borderLeftColor: '#1E3A8A',
            },
          ]}
        >
          <Text style={styles.scenarioLabel}>Scenario</Text>
          <Text style={styles.scenarioSetup}>{scenario?.scenarioSetup}</Text>
        </View>

        <View style={styles.scenarioCard}>
          <Text style={styles.decisionLabel}>Your Decision</Text>
          <Text style={styles.decisionTitle}>{decision?.title}</Text>
        </View>

        <View style={styles.stageCardSingle}>
          <View style={styles.stageHeader}>
            <Text style={styles.stageIcon}>{currentStage.icon}</Text>
            <Text style={styles.stageTitle}>{currentStage.label}</Text>
          </View>
          <View
            style={[
              styles.stageContent,
              {
                backgroundColor: currentStage.color,
                borderColor: currentStage.borderColor,
              },
            ]}
          >
            <View style={styles.stageImagePlaceholder}>
              {stageImageSource ? (
                <>
                  <Image
                    source={stageImageSource}
                    style={[styles.stageImage, { opacity: isStageImageReady ? 1 : 0 }]}
                    resizeMode="cover"
                    onLoadStart={() => setIsStageImageReady(false)}
                    onLoad={() => setIsStageImageReady(true)}
                    fadeDuration={0}
                  />
                  {!isStageImageReady ? (
                    <View pointerEvents="none" style={styles.stageImageLoadingOverlay}>
                      <Text style={styles.stageImageText}>Loading image…</Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.stageImageText}>A verdict-specific illustration appears after AI evaluation.</Text>
              )}
            </View>
            <Text style={styles.stageDescription}>{currentStage.description}</Text>
            {currentStage.explanation ? (
              <Text style={styles.stageExplanation}>{currentStage.explanation}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, styles.previousButton]} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>
              {stage === 'Immediate' ? 'Back' : 'Previous'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.nextButton]} onPress={handleNext} disabled={isEvaluating}>
            <Text style={styles.nextButtonText}>{isEvaluating ? 'Evaluating' : evaluationError ? 'Retry evaluation' : isFinalStage ? 'Evaluate' : 'Next'}</Text>
          </TouchableOpacity>
        </View>

        {evaluationError ? (
          <View style={styles.evaluationError} accessibilityRole="alert">
            <Text style={styles.evaluationErrorText}>{evaluationError}</Text>
            <Text style={styles.evaluationErrorHint}>No evaluation result was generated. Retry when the service is available.</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Scenarios' })}
        >
          <Text style={styles.secondaryButtonText}>Try Another Scenario</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isEvaluating} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}> 
          <View style={styles.evaluatingCard}>
            <Text style={styles.evaluatingTitle}>AI is evaluating your decision{evaluationDots}</Text>
            <Text style={styles.evaluatingSubtitle}>The system is reviewing the consequence path and preparing your evaluation.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E2E8F0' },
  backgroundLayer: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  floatingCircle: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  circleOne: { width: 170, height: 170, top: -24, left: -36, backgroundColor: 'rgba(59, 130, 246, 0.16)' },
  circleTwo: { width: 120, height: 120, top: 220, right: -20, backgroundColor: 'rgba(236, 72, 153, 0.16)' },
  circleThree: { width: 84, height: 84, bottom: 90, left: 44, backgroundColor: 'rgba(16, 185, 129, 0.16)' },
  content: { padding: 16, paddingBottom: 40 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 15, width: '100%', position: 'relative' },
  backButton: { position: 'absolute', left: 0, alignSelf: 'center', zIndex: 1 },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  backText: { marginLeft: 6, color: '#0369A1', fontSize: 14 },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircleTop: {
    position: 'absolute',
    top: -34,
    right: -34,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  decorCircleBottom: {
    position: 'absolute',
    bottom: -28,
    left: -28,
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  heroContent: { position: 'relative', zIndex: 1 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  stepBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, lineHeight: 30 },
  heroSubtitle: { fontSize: 13.5, color: '#64748B', lineHeight: 20, marginBottom: 14 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  progressDot: { height: 6, borderRadius: 3 },
  stepCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stepLabel: { color: '#1D4ED8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  stepText: { color: '#475569', fontSize: 12.5, lineHeight: 18 },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  subtitle: { color: '#64748B', marginBottom: 16, fontSize: 14 },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  decisionCard: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.88)' : '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.95)' : '#E6EEF9',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  decisionLabel: { fontSize: 12, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  decisionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4, textAlign: 'center' },
  decisionDesc: { color: '#475569', fontSize: 14, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  decisionSummary: { color: '#475569', fontSize: 13, lineHeight: 19, marginTop: 8 },
  aiReasoningText: { marginTop: 10, color: '#1D4ED8', fontSize: 12.5, lineHeight: 18, fontStyle: 'italic' },

  scenarioCard: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.88)' : '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.95)' : '#E6EEF9',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  scenarioLabel: { fontSize: 12, color: '#64748B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  scenarioTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  scenarioSetup: { color: '#475569', fontSize: 14 },

  timelineContainer: { marginBottom: 16 },
  timelineItem: { flexDirection: 'row', marginBottom: 16, position: 'relative' },
  connector: {
    position: 'absolute',
    left: 15,
    top: 30,
    width: 2,
    height: '100%',
    backgroundColor: '#CBD5E1',
    zIndex: 0,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  dotText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  stageCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  stageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  stageIcon: { fontSize: 18, marginRight: 6 },
  stageTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  currentDecisionText: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  stageDescription: { color: '#334155', fontSize: 14, lineHeight: 20, marginBottom: 6, textAlign: 'center' },
  stageExplanation: { color: '#475569', fontSize: 13, lineHeight: 18, marginBottom: 10, textAlign: 'center' },
  stageCardSingle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  stageContent: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  stageImagePlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%',
  },
  stageImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stageImageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 250, 252, 0.92)',
    zIndex: 1,
  },
  stageImageText: { color: '#64748B', fontSize: 13 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  nextButton: {
    backgroundColor: '#1D4ED8',
    marginLeft: 8,
  },
  nextButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.2 },
  evaluationError: { marginTop: 0, marginBottom: 16, padding: 14, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  evaluationErrorText: { color: '#991B1B', fontSize: 14, fontWeight: '700' },
  evaluationErrorHint: { color: '#7F1D1D', fontSize: 13, marginTop: 4, lineHeight: 19 },
  previousButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  previousButtonText: { color: '#0F172A', fontWeight: '700', fontSize: 15 },

  analysisCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
  },
  analysisTitle: { fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  analysisText: { color: '#334155', fontSize: 14, lineHeight: 20 },

  actionsCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  actionsTitle: { fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  actionItem: { flexDirection: 'row', marginBottom: 6 },
  actionBullet: { color: '#1D4ED8', marginRight: 8, fontSize: 14 },
  actionText: { color: '#334155', fontSize: 14, flex: 1 },

  principlesCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },
  principlesTitle: { fontWeight: '700', marginBottom: 8, color: '#0F172A' },
  principlesList: { flexDirection: 'row', flexWrap: 'wrap' },
  principlePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  principleText: { fontSize: 12, fontWeight: '600' },

  evaluateButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  evaluateButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF9',
  },
  secondaryButtonText: { color: '#1D4ED8', fontWeight: '700', fontSize: 16 },
  evaluatingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  evaluatingCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  evaluatingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  evaluatingSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  thinkingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  thinkingCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    },
  thinkingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    textAlign: 'center',
  },
  thinkingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ConsequenceTimelineScreen;


