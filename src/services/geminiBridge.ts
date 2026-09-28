import Constants from 'expo-constants';

const EXTRA = Constants.expoConfig?.extra || {};

export interface EvaluationResult {
  verdict: 'ethical' | 'unethical';
  reasoning: string;
  confidence: number;
  recommendations: string[];
  alignmentWithLearningMaterial: string;
  possibleConsequences: string[];
  possibleBenefits: string[];
  principles: string[];
}

function cleanText(value: unknown): string {
  return String(value ?? '')
    .replace(/\bundefined\b/gi, '')
    .replace(/\bnull\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeArray(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(item => cleanText(item))
    .filter(Boolean)
    .slice(0, 5);
}

function safeVerdict(value: unknown): EvaluationResult['verdict'] {
  if (value === 'ethical' || value === 'unethical') {
    return value;
  }
  throw new Error('The AI returned an invalid verdict; expected ethical or unethical.');
}

function cleanEvaluationText(value: unknown): string {
  const text = cleanText(value);
  return text
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bai\b/g, 'AI')
    .replace(/\bteh\b/gi, 'the')
    .replace(/\breccomend\b/gi, 'recommend')
    .replace(/\bseperate\b/gi, 'separate')
    .replace(/\bmroe\b/gi, 'more')
    .replace(/\bwether\b/gi, 'whether')
    .replace(/\bdefinately\b/gi, 'definitely')
    .replace(/\boccured\b/gi, 'occurred')
    .replace(/\bpersoanl\b/gi, 'personal')
    .replace(/\bsafegaurd\b/gi, 'safeguard')
    .replace(/\bstrenghten\b/gi, 'strengthen')
    .replace(/\brecommed\b/gi, 'recommend')
    .replace(/\baligment\b/gi, 'alignment')
    .replace(/\bethcial\b/gi, 'ethical')
    .replace(/\bevalaution\b/gi, 'evaluation')
    .replace(/\bgnerating\b/gi, 'generating')
    .replace(/\bcuriculum\b/gi, 'curriculum')
    .replace(/\bthier\b/gi, 'their')
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bsucces\b/gi, 'success')
    .replace(/\bimmediatly\b/gi, 'immediately')
    .replace(/\bresponsiblity\b/gi, 'responsibility')
    .replace(/\bcommited\b/gi, 'committed')
    .replace(/\benviroment\b/gi, 'environment')
    .trim();
}

function cleanEvaluationArray(items: unknown): string[] {
  return normalizeArray(items)
    .map(value => cleanEvaluationText(value))
    .filter(Boolean)
    .filter(value => !/^(undefined|null)$/i.test(value))
    .slice(0, 5);
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 2,
  baseDelay: number = 800,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url, options);

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

export async function evaluateWithGemini(
  decision: any,
  scenario: any,
  courseContext: string,
): Promise<EvaluationResult> {
  const evaluationUrl = (EXTRA.aiEvaluationUrl ?? EXTRA.AI_EVALUATION_URL)?.trim();

  if (!evaluationUrl) throw new Error('Evaluation service is not configured.');

  const response = await fetchWithRetry(evaluationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, scenario, courseContext }),
  }, 2, 800);

  if (!response.ok) throw new Error(`Evaluation service returned ${response.status}.`);

  const result = await response.json() as Partial<EvaluationResult>;
  if (!result.verdict || !result.reasoning) throw new Error('The evaluation service returned an incomplete result.');

  return {
    verdict: safeVerdict(result.verdict),
    reasoning: cleanEvaluationText(result.reasoning),
    confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.75,
    recommendations: cleanEvaluationArray(result.recommendations),
    alignmentWithLearningMaterial: cleanEvaluationText(result.alignmentWithLearningMaterial || ''),
    possibleConsequences: cleanEvaluationArray(result.possibleConsequences),
    possibleBenefits: cleanEvaluationArray(result.possibleBenefits),
    principles: cleanEvaluationArray(result.principles),
  };
}
