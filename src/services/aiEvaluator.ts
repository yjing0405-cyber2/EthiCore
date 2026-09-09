import { Scenario, Decision, VerdictType, AIEvaluationResult } from '../types';
import { chapters } from '../data/courseData';

// ──────────────────────────────────────────────────────────
// LOCAL AI EVALUATOR — Ethics Engine for SPI Course
// Replaces static keyword matching with intelligent analysis
// ──────────────────────────────────────────────────────────

const ETHICS_PRINCIPLES = {
  honesty: {
    keywords: ['lie', 'conceal', 'hide', 'mislead', 'fraud', 'deceive', 'truth', 'transparent', 'disclose', 'honest'],
    description: 'Honesty and Truthfulness',
  },
  safety: {
    keywords: ['harm', 'risk', 'unsafe', 'danger', 'injury', 'protect', 'safety', 'secure', 'vulnerable'],
    description: 'Public Safety and Welfare',
  },
  privacy: {
    keywords: ['data', 'personal', 'confidential', 'gdpr', 'consent', 'privacy', 'breach', 'leak'],
    description: 'Privacy and Data Protection',
  },
  accountability: {
    keywords: ['blame', 'credit', 'responsibility', 'accountable', 'ownership', 'answerable'],
    description: 'Professional Accountability',
  },
  fairness: {
    keywords: ['bias', 'discriminate', 'equal', 'unfair', 'justice', 'equity', 'prejudice'],
    description: 'Fairness and Non-Discrimination',
  },
  transparency: {
    keywords: ['disclose', 'secret', 'open', 'transparent', 'hidden', 'cover up', 'withhold'],
    description: 'Transparency and Openness',
  },
  integrity: {
    keywords: ['plagiarism', 'steal', 'copy', 'original', 'authentic', 'forge', 'fabricate'],
    description: 'Intellectual Integrity',
  },
  competence: {
    keywords: ['unqualified', 'incompetent', 'expertise', 'skill', 'capable', 'qualified'],
    description: 'Professional Competence',
  },
  loyalty: {
    keywords: ['whistleblow', 'report', 'expose', 'betray', 'conflict of interest', 'dual loyalty'],
    description: 'Organizational Loyalty vs Public Interest',
  },
  sustainability: {
    keywords: ['environment', 'sustainable', 'green', 'waste', 'energy', 'climate'],
    description: 'Environmental Sustainability',
  },
};

const UNETHICAL_SIGNALS = [
  'ignore', 'conceal', 'hide', 'secretly', 'bypass', 'exploit', 'deceive',
  'fraud', 'steal', 'misuse', 'unauthorized', 'cover up', 'take full credit',
  'manipulate', 'violate', 'without permission', 'harm', 'endanger',
  'bribe', 'extort', 'blackmail', 'plagiarize', 'forge', 'fabricate',
  'discriminate', 'retaliate', 'suppress', 'mislead', 'falsify',
];

const ETHICAL_SIGNALS = [
  'report', 'protect', 'refuse', 'disclose', 'consult', 'responsibly',
  'safely', 'credit', 'transparency', 'follow', 'document', 'seek approval',
  'notify', 'warn', 'permission', 'escalate', 'decline', 'resist',
  'advocate', 'mediate', 'educate', 'support', 'verify', 'audit',
];

const COURSE_STOP_WORDS = new Set([
  'about', 'after', 'also', 'because', 'being', 'could', 'from', 'have',
  'into', 'more', 'should', 'that', 'their', 'there', 'these', 'they',
  'this', 'those', 'what', 'when', 'which', 'with', 'would', 'your',
]);

interface CourseRubricMatch {
  chapterId: number;
  chapterTitle: string;
  topicTitle: string;
  evidence: string;
  score: number;
}

function cleanCourseText(value: string): string {
  return value
    .replace(/\|/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/[\*_#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function courseTokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length > 3 && !COURSE_STOP_WORDS.has(token));
}

function findCourseRubricMatches(decision: Decision, scenario: Scenario): CourseRubricMatch[] {
  const decisionText = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.title,
    scenario.scenarioSetup,
  ].filter(Boolean).join(' ');
  const decisionTokenSet = new Set(courseTokens(decisionText));

  return chapters
    .flatMap(chapter => chapter.topics.map(topic => {
      const topicText = [
        topic.title,
        topic.summary,
        topic.contentSummary,
        topic.content,
        ...(topic.alignmentTags ?? []),
      ].filter(Boolean).join(' ');
      const topicTokens = new Set(courseTokens(topicText));
      const overlap = [...decisionTokenSet].filter(token => topicTokens.has(token));
      const titleTokens = courseTokens(topic.title);
      const titleOverlap = titleTokens.filter(token => decisionTokenSet.has(token));
      const score = overlap.length + titleOverlap.length * 3;
      const courseSentences = cleanCourseText([
        topic.summary,
        topic.contentSummary,
        topic.content,
      ].filter(Boolean).join(' '))
        .split(/(?<=[.!?])\s+/)
        .filter(sentence => sentence.length > 35);
      const evidence = courseSentences
        .map(sentence => ({
          sentence,
          overlap: courseTokens(sentence).filter(token => decisionTokenSet.has(token)).length,
        }))
        .sort((a, b) => b.overlap - a.overlap)[0]?.sentence
        || courseSentences[0]
        || 'The course material emphasizes responsible professional judgment.';

      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        topicTitle: topic.title,
        evidence,
        score,
      };
    }))
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .filter((match, index, matches) => matches.findIndex(item => item.topicTitle === match.topicTitle) === index)
    .slice(0, 3);
}

// ── Detect which principles are relevant to this decision ──
function detectPrinciples(decision: Decision, scenario: Scenario): string[] {
  const text = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.scenarioSetup,
    scenario.title,
  ].join(' ').toLowerCase();

  const matched: { principle: string; score: number }[] = [];

  Object.entries(ETHICS_PRINCIPLES).forEach(([key, data]) => {
    const score = data.keywords.filter(kw => text.includes(kw)).length;
    if (score > 0) {
      matched.push({ principle: data.description, score });
    }
  });

  // Sort by relevance score, take top 3
  matched.sort((a, b) => b.score - a.score);
  const top = matched.slice(0, 3).map(m => m.principle);

  return top.length > 0 ? top : ['Professional Responsibility'];
}

// ── Calculate sentiment score (-1 to +1) ──
function calculateSentiment(decision: Decision, scenario: Scenario): number {
  const text = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.scenarioSetup,
  ].join(' ').toLowerCase();

  const unethicalScore = UNETHICAL_SIGNALS.filter(s => text.includes(s)).length;
  const ethicalScore = ETHICAL_SIGNALS.filter(s => text.includes(s)).length;

  // Weight by explicit category if available
  const categoryWeight = decision.decisionCategory === 'unethical' ? -2
    : decision.decisionCategory === 'ethical' ? 2
    : 0;

  const total = unethicalScore + ethicalScore;
  if (total === 0) return categoryWeight * 0.3;

  const raw = (ethicalScore - unethicalScore) / Math.max(total, 3);
  return Math.max(-1, Math.min(1, raw + categoryWeight * 0.2));
}

function inferScenarioFocus(decision: Decision, scenario: Scenario): string {
  const text = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.scenarioSetup,
    scenario.title,
  ].join(' ').toLowerCase();

  if (/(privacy|data|personal|confidential|consent)/.test(text)) {
    return 'privacy and consent';
  }

  if (/(safety|harm|risk|unsafe|security|vulnerab)/.test(text)) {
    return 'safety and non-maleficence';
  }

  if (/(fair|bias|equal|justice|trust|stakeholder)/.test(text)) {
    return 'fairness and stakeholder trust';
  }

  if (/(transparency|disclose|report|notify|honest|accountab)/.test(text)) {
    return 'transparency and accountability';
  }

  return 'responsible professional judgment';
}

export function buildFallbackAlignment(decision: Decision, scenario: Scenario, matches: CourseRubricMatch[] = []): string {
  const combinedText = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.scenarioSetup,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (combinedText.includes('privacy') || combinedText.includes('data')) {
    return 'This connects to the course content through privacy, consent, and trust.';
  }

  if (combinedText.includes('safety') || combinedText.includes('harm') || combinedText.includes('risk')) {
    return 'This connects to the course content through safety and harm prevention.';
  }

  if (combinedText.includes('fair') || combinedText.includes('bias') || combinedText.includes('discrimin')) {
    return 'This connects to the course content through fairness and stakeholder trust.';
  }

  return 'This connects to the course content through responsibility and accountability.';
}

function buildCourseEvidence(matches: CourseRubricMatch[]): string {
  const available = matches
    .map(match => cleanCourseText(match.evidence))
    .filter(Boolean);
  const evidence: string[] = [];

  while (available.length > 0 && evidence.length < 2) {
    const index = Math.floor(Math.random() * available.length);
    evidence.push(available.splice(index, 1)[0]);
  }

  return evidence.length > 0
    ? evidence.join(' ')
    : 'The course material emphasizes responsible professional judgment.';
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// ── Generate contextual reasoning ──
function generateReasoning(
  verdict: VerdictType,
  principles: string[],
  decision: Decision,
  scenario: Scenario,
  matches: CourseRubricMatch[]
): string {
  const principleList = principles.join(', ');
  const scenarioFocus = inferScenarioFocus(decision, scenario);
  const courseEvidence = buildCourseEvidence(matches);
  const verdictReason = verdict === 'ethical'
    ? `supports ${principleList} and addresses ${scenarioFocus}`
    : verdict === 'unethical'
      ? `neglects ${scenarioFocus} and weakens ${principleList}`
      : `offers benefits but leaves ${scenarioFocus} unresolved`;
  const stakeholderEffect = verdict === 'ethical'
    ? 'protects stakeholders, reduces foreseeable harm, and keeps responsibility visible'
    : verdict === 'unethical'
      ? 'creates avoidable risk, may reduce trust, and makes accountability harder to maintain'
      : 'creates competing effects that require safeguards and stakeholder review';
  const courseConclusion = verdict === 'ethical'
    ? [
        'This matches the course standard for an ethical decision.',
        'The course content therefore supports an ethical judgment.',
      ]
    : verdict === 'unethical'
      ? [
          'This falls short of the course standard for responsible conduct.',
          'The course content therefore supports an unethical judgment.',
        ]
      : [
          'The course standard supports further review before a final judgment.',
          'The course content supports a mixed judgment until the risks are addressed.',
        ];

  const reasoningParts = [
    `The decision ${verdictReason}.`,
    `Its likely effect is that it ${stakeholderEffect}.`,
    `The relevant course content states that ${courseEvidence}`,
    pickRandom(courseConclusion),
  ];

  for (let index = reasoningParts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [reasoningParts[index], reasoningParts[swapIndex]] = [reasoningParts[swapIndex], reasoningParts[index]];
  }

  return reasoningParts.join(' ');
}

// ── Generate recommended actions based on verdict ──
function generateRecommendations(verdict: VerdictType, decision: Decision, scenario: Scenario): string[] {
  const baseActions = decision.recommendedActions || [];
  const scenarioFocus = inferScenarioFocus(decision, scenario);

  if (verdict === 'unethical') {
    return [
      `Pause and reassess the action against ${scenarioFocus}.`,
      'Choose a safer alternative and consult affected stakeholders.',
    ];
  }

  if (verdict === 'ethical') {
    return [
      'Document and explain the decision clearly.',
      `Monitor its effect on ${scenarioFocus} and stakeholders.`,
    ];
  }

  return [
    'Compare the risks and benefits before proceeding.',
    `Add safeguards and review the ${scenarioFocus} trade-offs.`,
  ];
}

function buildPossibleConsequences(verdict: VerdictType, decision: Decision, scenario: Scenario): string[] {
  const scenarioFocus = inferScenarioFocus(decision, scenario);

  const consequences = [
    `It may create avoidable harm if ${scenarioFocus} is overlooked.`,
    'It could reduce stakeholder trust without clear accountability.',
  ];

  if (verdict === 'ethical') {
    return [
      'Unclear reasoning may weaken confidence in the outcome.',
      'New evidence may require the decision to be reviewed.',
    ];
  }

  return consequences;
}

function buildPossibleBenefits(verdict: VerdictType, decision: Decision, scenario: Scenario): string[] {
  const scenarioFocus = inferScenarioFocus(decision, scenario);

  const benefits = [
    `It may support progress when ${scenarioFocus} is handled responsibly.`,
    'Transparent follow-up can preserve trust and accountability.',
  ];

  if (verdict === 'ethical') {
    return [
      'Clear reasoning can strengthen stakeholder confidence.',
      'Careful implementation can support a responsible outcome.',
    ];
  }

  return benefits;
}

// ── Main evaluation function ──
export function evaluateDecision(
  decision: Decision,
  scenario: Scenario,
  history: DecisionHistory[] = []
): AIEvaluationResult {
  const sentiment = calculateSentiment(decision, scenario);
  const courseMatches = findCourseRubricMatches(decision, scenario);
  const principles = detectPrinciples(decision, scenario);

  // Determine verdict based on sentiment. Never return 'mixed' — pick a binary verdict using tie-breakers.
  let verdict: VerdictType;
  if (sentiment < -0.2) verdict = 'unethical';
  else if (sentiment > 0.2) verdict = 'ethical';
  else {
    const text = [
      decision.title,
      decision.analysis,
      decision.immediate,
      decision.ripple,
      decision.longTerm,
      scenario.scenarioSetup,
    ].join(' ').toLowerCase();

    const unethicalCount = UNETHICAL_SIGNALS.filter(s => text.includes(s)).length;
    const ethicalCount = ETHICAL_SIGNALS.filter(s => text.includes(s)).length;

    verdict = unethicalCount > ethicalCount ? 'unethical' : ethicalCount > unethicalCount ? 'ethical' : 'mixed';
  }

  // Adjust based on explicit category if strongly stated
  if (decision.decisionCategory === 'unethical' && sentiment < 0) {
    verdict = 'unethical';
  } else if (decision.decisionCategory === 'ethical' && sentiment > 0) {
    verdict = 'ethical';
  }

  const reasoning = generateReasoning(verdict, principles, decision, scenario, courseMatches);
  const recommendations = generateRecommendations(verdict, decision, scenario);
  const possibleConsequences = buildPossibleConsequences(verdict, decision, scenario);
  const possibleBenefits = buildPossibleBenefits(verdict, decision, scenario);

  // Calculate confidence based on signal strength
  const signalText = [
    decision.title,
    decision.analysis,
    decision.immediate,
    decision.ripple,
    decision.longTerm,
    scenario.scenarioSetup,
  ]
    .join(' ')
    .toLowerCase();
  const totalSignals = UNETHICAL_SIGNALS.filter(s => signalText.includes(s)).length
    + ETHICAL_SIGNALS.filter(s => signalText.includes(s)).length;
  const signalStrength = Math.min(1, totalSignals / 5);
  const confidence = Math.min(0.9, 0.4 + Math.abs(sentiment) * 0.3 + signalStrength * 0.2);

  // Check history for patterns ("learning" aspect)
  const relatedHistory = history.filter(
    h => h.scenarioTitle === scenario.title || h.verdict === verdict
  );

  const patternNote = relatedHistory.length > 2
    ? ` Pattern detected: You've shown consistent ${verdict} judgment in similar situations.`
    : '';

  return {
    verdict,
    label: verdict === 'unethical' ? 'Unethical' : verdict === 'mixed' ? 'Mixed' : 'Ethical',
    reasoning: reasoning + patternNote,
    principles,
    confidence,
    recommendations,
    sentiment,
    alignmentWithLearningMaterial: buildFallbackAlignment(decision, scenario, courseMatches),
    possibleConsequences,
    possibleBenefits,
    analyzedAt: new Date().toISOString(),
  };
}

// ── Decision history type for "memory" ──
export interface DecisionHistory {
  id: string;
  scenarioTitle: string;
  decisionTitle: string;
  verdict: VerdictType;
  timestamp: string;
  principles: string[];
}

// ── Async wrapper with simulated AI delay ──
export async function evaluateDecisionAsync(
  decision: Decision,
  scenario: Scenario,
  history: DecisionHistory[] = [],
  delayMs: number = 1200
): Promise<AIEvaluationResult> {
  // Simulate network/AI processing time for realism
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return evaluateDecision(decision, scenario, history);
}
