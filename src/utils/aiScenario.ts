import { buildScenarioDecisions, scenarioDetails, scenarioTitles } from '@/data/scenarioDatabase';

interface ScenarioDetailLike {
  title: string;
  description: string;
}

export interface ComicPanel {
  panelNumber: number;
  setting: string;
  visualDescription: string;
  characters: string[];
  dialogue: string[];
  topic: string;
}

export interface ConsequenceFields {
  immediate: string;
  immediateExplanation?: string;
  ripple: string;
  rippleExplanation?: string;
  longTerm: string;
  longTermExplanation?: string;
}

export interface ComicDecision extends ConsequenceFields {
  id: string;
  title: string;
  description: string;
  ethical: boolean;
  decisionCategory?: 'ethical' | 'unethical' | 'mixed';
  analysis: string;
  violatedPrinciples: string[];
  recommendedActions: string[];
}

export interface ComicScenario {
  title: string;
  description?: string;
  topics: string[];
  panelCount: number;
  panels: ComicPanel[];
  moral: string;
  scenarioSetup: string;
  decisions: ComicDecision[];
  chapter?: number;
  chapterId?: number;
  chapterTitle?: string;
  scenarioNumber?: number;
  visualDescription?: string;
  additionalNotes?: {
    source?: string;
    category?: string;
    scenarioNumber?: number;
  };
}

export interface GenerateOptions {
  topics?: string[];
  panelCount?: number;
  seedPrompt?: string;
}

export default async function generateComicScenario(
  options: GenerateOptions = {}
): Promise<ComicScenario> {
  const { seedPrompt = '', topics = [], panelCount = 6 } = options;
  return createGenericScenario(seedPrompt, topics, panelCount);
}

function findScenarioMatch(prompt: string) {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) return null;

  const exactMatchIndex = scenarioTitles.findIndex((title: string) => {
    const loweredTitle = title.toLowerCase();
    return loweredTitle === normalized || loweredTitle.includes(normalized) || normalized.includes(loweredTitle);
  });

  if (exactMatchIndex >= 0) {
    return { title: scenarioTitles[exactMatchIndex], index: exactMatchIndex + 1 };
  }

  const keywordTokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  const keywordMatch = Object.entries(scenarioDetails as Record<string, ScenarioDetailLike>).find(([, detail]) => {
    const haystack = `${detail.title} ${detail.description}`.toLowerCase();
    return keywordTokens.some((token) => token.length > 3 && haystack.includes(token));
  });

  if (!keywordMatch) return null;

  return { title: keywordMatch[1].title, index: Number(keywordMatch[0]) };
}

function createGenericScenario(
  prompt: string,
  topics: string[],
  panelCount: number
): ComicScenario {
  const topic = topics[0] || 'Ethical Dilemma';
  const matchedScenario = findScenarioMatch(prompt);
  const detail = matchedScenario ? scenarioDetails[matchedScenario.index] : undefined;
  const decisions = matchedScenario
    ? buildScenarioDecisions(matchedScenario.title, matchedScenario.index, prompt)
    : [
        {
          id: 'ethical-response',
          title: 'Take the Ethical Path',
          description: 'Choose the option that upholds professional standards and integrity.',
          ethical: true,
          decisionCategory: 'ethical',
          analysis: 'This decision aligns with core ethical principles and protects all stakeholders.',
          immediate: 'The situation is handled with transparency and care.',
          ripple: 'Trust is maintained and standards are upheld.',
          longTerm: 'Professional reputation and organizational integrity are preserved.',
          violatedPrinciples: [],
          recommendedActions: ['Document the decision', 'Communicate clearly', 'Follow up'],
        },
        {
          id: 'unethical-response',
          title: 'Take the Unethical Path',
          description: 'Choose the option that prioritizes convenience over ethics.',
          ethical: false,
          decisionCategory: 'unethical',
          analysis: 'This decision violates professional standards and may cause harm.',
          immediate: 'The immediate problem is avoided but at a cost.',
          ripple: 'Trust is eroded and standards are compromised.',
          longTerm: 'Reputational damage and potential legal consequences may follow.',
          violatedPrinciples: ['Professional Responsibility', 'Integrity'],
          recommendedActions: ['Reconsider the decision', 'Consult ethics guidelines', 'Report if necessary'],
        },
      ];

  return {
    title: prompt || detail?.title || 'Ethical Scenario',
    topics: topics.length > 0 ? topics : ['Professional Responsibility'],
    panelCount,
    panels: Array.from({ length: Math.min(panelCount, 3) }, (_, i) => ({
      panelNumber: i + 1,
      setting: i === 0 ? 'Office' : i === 1 ? 'Meeting Room' : 'Break Area',
      visualDescription: `Scene ${i + 1} of the ethical dilemma.`,
      characters: ['You', 'Colleague', 'Manager'],
      dialogue: [
        'This situation requires careful thought.',
        'What is the right thing to do here?',
      ],
      topic,
    })),
    moral: detail
      ? `Ethical Principle: ${detail.title}. Always prioritize integrity, legal compliance, and professional responsibility.`
      : 'Always consider the ethical implications of your actions.',
    scenarioSetup: prompt || detail?.description || 'An ethical dilemma has arisen in the workplace.',
    decisions: decisions as ComicDecision[],
    additionalNotes: {
      source: detail ? 'scenario-database' : 'generated',
      category: detail ? 'ethics' : 'general',
      scenarioNumber: matchedScenario?.index,
    },
  };
}
