import Constants from 'expo-constants';
import { evaluateDecision } from './aiEvaluator';

const EXTRA = Constants.expoConfig?.extra || {};

// ── Configuration ─────────────────────────────────────────────────
// API keys should be set via environment variables only.
// NEVER hardcode API keys in production code.

function isValidGroqApiKey(key: string): boolean {
  return /^gsk_[A-Za-z0-9_-]{40,}$/.test(key);
}

function getGroqApiKeys(): string[] {
  // Collect env vars named EXPO_PUBLIC_GROQ_API_KEY, EXPO_PUBLIC_GROQ_API_KEY_2, ... dynamically
  const env = process.env || {};
  const envKeyNames = Object.keys(env).filter(k => /^EXPO_PUBLIC_GROQ_API_KEY(_\d+)?$/i.test(k));

  // Sort so numbered keys come after the base key and in numeric order
  envKeyNames.sort((a, b) => {
    const na = a.match(/_(\d+)$/)?.[1];
    const nb = b.match(/_(\d+)$/)?.[1];
    if (na && nb) return Number(na) - Number(nb);
    if (na) return 1;
    if (nb) return -1;
    return 0;
  });

  const envValues = envKeyNames.map(k => env[k]).filter((v): v is string => Boolean(v && v.trim()));

  // Also support EXTRA config keys (expo constants) named groqApiKey, groqApiKey2, groqApiKey3, ...
  const extraKeyNames = Object.keys(EXTRA || {}).filter(k => /^groqApiKey(_\d+)?$/i.test(k));
  extraKeyNames.sort();
  const extraValues = extraKeyNames.map(k => EXTRA[k]).filter((v): v is string => Boolean(v && String(v).trim()));

  const combined = [...envValues, ...extraValues];

  const rawKeys = combined
    .flatMap(value => String(value).split(',').map(item => item.trim()).filter(Boolean));

  const validKeys = rawKeys.filter(isValidGroqApiKey);
  const invalidKeys = rawKeys.filter(key => !isValidGroqApiKey(key));

  if (invalidKeys.length > 0) {
    console.warn('[GroqBridge] Ignoring invalid Groq API key entries:', invalidKeys);
  }

  if (validKeys.length === 0) {
    console.warn('[GroqBridge] No valid Groq API keys configured via environment variables. Evaluations will fall back to local analysis.');
    return [];
  }

  return Array.from(new Set(validKeys));
}

// Provider credentials belong only on the serverless proxy, never in the mobile app.
const GROQ_API_KEYS: string[] = [];
const GROQ_MAX_TOKENS = 900;
const RATE_LIMIT_COOLDOWN_MS = 15000;

// Serialize all requests for a given Groq key so concurrent evaluations do not race
// and reuse the same key at the same time.
const keyRequestQueue = new Map<number, Promise<void>>();
const inFlightEvaluations = new Map<string, Promise<EvaluationResult & { tokenUsage?: TokenUsage; keyUsed?: number }>>();
let lastRateLimitAt = 0;

async function enqueueKeyRequest<T>(keyIndex: number, request: () => Promise<T>): Promise<T> {
  const previous = keyRequestQueue.get(keyIndex) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>(resolve => {
    release = resolve;
  });

  keyRequestQueue.set(keyIndex, previous.then(() => current));

  await previous;

  try {
    return await request();
  } finally {
    keyRequestQueue.delete(keyIndex);
    release();
  }
}

function makeEvaluationFingerprint(decision: any, scenario: any, courseContext: string): string {
  const decisionTitle = decision?.title || 'untitled';
  const scenarioTitle = scenario?.title || 'untitled';
  const outcomeSummary = [decisionTitle, scenarioTitle, courseContext].join('|');
  return `${outcomeSummary}`;
}

function compressCourseContext(courseContext: string): string {
  const compact = String(courseContext || '')
    .replace(/\s+/g, ' ')
    .trim();

  return compact.length > 1800 ? compact.slice(0, 1800) : compact;
}

function shouldUseLocalRateLimitFallback(): boolean {
  return Date.now() < lastRateLimitAt + RATE_LIMIT_COOLDOWN_MS;
}

// ── Per-Key Token Tracking ────────────────────────────────────────
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: string;
  model: string;
  apiKeyIndex: number;
}

// Separate history per key
const usageByKey: Map<number, TokenUsage[]> = new Map();
const MAX_HISTORY_PER_KEY = 100;

// Free tier limits PER KEY
const FREE_TIER_PER_KEY = {
  requestsPerMinute: 20,
  tokensPerMinute: 25000,
  tokensPerDay: 500000,
};

function getKeyUsageStats(keyIndex: number) {
  const history = usageByKey.get(keyIndex) || [];
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  const oneDayAgo = now - 86400000;

  const recent = history.filter(u => new Date(u.timestamp).getTime() > oneMinuteAgo);
  const today = history.filter(u => new Date(u.timestamp).getTime() > oneDayAgo);

  return {
    requestsLastMinute: recent.length,
    tokensLastMinute: recent.reduce((sum, u) => sum + u.totalTokens, 0),
    requestsToday: today.length,
    tokensToday: today.reduce((sum, u) => sum + u.totalTokens, 0),
    isNearLimit: {
      rpm: recent.length >= FREE_TIER_PER_KEY.requestsPerMinute * 0.85,
      tpm: recent.reduce((sum, u) => sum + u.totalTokens, 0) >= FREE_TIER_PER_KEY.tokensPerMinute * 0.85,
      tpd: today.reduce((sum, u) => sum + u.totalTokens, 0) >= FREE_TIER_PER_KEY.tokensPerDay * 0.85,
      hardRpm: recent.length >= FREE_TIER_PER_KEY.requestsPerMinute,
      hardTpm: recent.reduce((sum, u) => sum + u.totalTokens, 0) >= FREE_TIER_PER_KEY.tokensPerMinute,
      hardTpd: today.reduce((sum, u) => sum + u.totalTokens, 0) >= FREE_TIER_PER_KEY.tokensPerDay,
    },
  };
}

function logTokenUsage(usage: TokenUsage) {
  const history = usageByKey.get(usage.apiKeyIndex) || [];
  history.push(usage);
  if (history.length > MAX_HISTORY_PER_KEY) {
    history.shift();
  }
  usageByKey.set(usage.apiKeyIndex, history);

  const stats = getKeyUsageStats(usage.apiKeyIndex);
  console.log(`\uD83E\uDD16 Groq Key #${usage.apiKeyIndex + 1} Token Usage:`, {
    thisRequest: `${usage.promptTokens} \u2192 ${usage.completionTokens} = ${usage.totalTokens}`,
    today: `${stats.tokensToday} / ${FREE_TIER_PER_KEY.tokensPerDay}`,
    perMinute: `${stats.tokensLastMinute} / ${FREE_TIER_PER_KEY.tokensPerMinute}`,
    requests: `${stats.requestsLastMinute} / ${FREE_TIER_PER_KEY.requestsPerMinute}/min`,
    nearLimit: stats.isNearLimit,
  });

  if (stats.isNearLimit.tpm) console.warn(`\u26A0\uFE0F Key #${usage.apiKeyIndex + 1}: Approaching TPM limit!`);
  if (stats.isNearLimit.tpd) console.warn(`\u26A0\uFE0F Key #${usage.apiKeyIndex + 1}: Approaching daily limit!`);
  if (stats.isNearLimit.rpm) console.warn(`\u26A0\uFE0F Key #${usage.apiKeyIndex + 1}: Approaching RPM limit!`);
}

// ── Smart Key Selector ────────────────────────────────────────────
function selectBestKey(excludedKeys: Set<number> = new Set()): { key: string; index: number; reason: string } | null {
  const apiKeys = GROQ_API_KEYS.filter(Boolean);

  if (apiKeys.length === 0) {
    return null;
  }

  const availableKeys = apiKeys
    .map((key, index) => ({ key, index }))
    .filter(item => !excludedKeys.has(item.index));

  if (availableKeys.length === 0) {
    return null;
  }

  if (availableKeys.length === 1) {
    return { key: availableKeys[0].key, index: availableKeys[0].index, reason: 'Only available key' };
  }

  let bestKeyIndex = -1;
  let bestHeadroom = -Infinity;

  for (const { index } of availableKeys) {
    const stats = getKeyUsageStats(index);

    if (stats.isNearLimit.hardRpm || stats.isNearLimit.hardTpm || stats.isNearLimit.hardTpd) {
      console.log(`\u26D4 Key #${index + 1} skipped: Hard limit reached`);
      continue;
    }

    const rpmHeadroom = FREE_TIER_PER_KEY.requestsPerMinute - stats.requestsLastMinute;
    const tpmHeadroom = FREE_TIER_PER_KEY.tokensPerMinute - stats.tokensLastMinute;
    const tpdHeadroom = FREE_TIER_PER_KEY.tokensPerDay - stats.tokensToday;
    const headroom = (tpmHeadroom * 2) + rpmHeadroom + (tpdHeadroom / 1000);

    if (headroom > bestHeadroom) {
      bestHeadroom = headroom;
      bestKeyIndex = index;
    }
  }

  if (bestKeyIndex >= 0) {
    const isFallback = bestKeyIndex > 0;
    return {
      key: apiKeys[bestKeyIndex],
      index: bestKeyIndex,
      reason: isFallback ? `Key #${bestKeyIndex + 1} has most headroom` : 'Primary key has headroom',
    };
  }

  let oldestKeyIndex = availableKeys[0].index;
  let oldestTime = Date.now();
  let found = false;

  for (const { index } of availableKeys) {
    const history = usageByKey.get(index) || [];
    const lastUsage = history[history.length - 1];
    if (lastUsage) {
      const lastTime = new Date(lastUsage.timestamp).getTime();
      if (lastTime < oldestTime) {
        oldestTime = lastTime;
        oldestKeyIndex = index;
        found = true;
      }
    }
  }

  return {
    key: apiKeys[oldestKeyIndex],
    index: oldestKeyIndex,
    reason: found ? 'All available keys near limit; using oldest untried key' : 'All available keys have limits; using first available',
  };
}

// ── Evaluation Types ──────────────────────────────────────────────
export interface EvaluationResult {
  verdict: 'ethical' | 'unethical' | 'mixed';
  reasoning: string;
  confidence: number;
  recommendations: string[];
  alignmentWithLearningMaterial: string;
  possibleConsequences: string[];
  possibleBenefits: string[];
  principles: string[];
}

// ── Text Cleaning ─────────────────────────────────────────────────
function cleanEvaluationText(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
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
    .replace(/\bundefined\b/gi, '')
    .replace(/\bnull\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanEvaluationArray(items: unknown[]): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(item => cleanEvaluationText(item as string | null | undefined))
    .filter(Boolean)
    .filter(item => !/^(undefined|null)$/i.test(item));
}

function isGroqRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /rate limit|429|tokens per minute|tpm|too many requests/i.test(message);
}

function buildLocalFallbackEvaluation(decision: any, scenario: any): EvaluationResult {
  const fallback = evaluateDecision(decision, scenario, []);

  return {
    verdict: fallback.verdict,
    reasoning: cleanEvaluationText(fallback.reasoning) || 'The local ethics evaluator could not produce a detailed reasoning, but the decision was assessed using the course rubric.',
    confidence: typeof fallback.confidence === 'number' ? Math.max(0, Math.min(1, fallback.confidence)) : 0.75,
    recommendations: Array.isArray(fallback.recommendations) ? cleanEvaluationArray(fallback.recommendations) : [],
    alignmentWithLearningMaterial: cleanEvaluationText(fallback.alignmentWithLearningMaterial) || 'The decision was evaluated using the learning material and ethical principles taught in the course.',
    possibleConsequences: Array.isArray(fallback.possibleConsequences) ? cleanEvaluationArray(fallback.possibleConsequences) : [],
    possibleBenefits: Array.isArray(fallback.possibleBenefits) ? cleanEvaluationArray(fallback.possibleBenefits) : [],
    principles: Array.isArray(fallback.principles) ? cleanEvaluationArray(fallback.principles) : [],
  };
}

// ── Retry Logic ───────────────────────────────────────────────────
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If we get a 429, wait and retry with exponential backoff
      if (response.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`\uD83D\uDD04 Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`\uD83D\uDD04 Network error. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

// ── Main Evaluation Function ────────────────────────────────────────
// APPLE APP STORE COMPLIANCE: Using local-only evaluation to avoid hidden external API calls
export async function evaluateWithGroq(
  decision: any,
  scenario: any,
  courseContext: string,
): Promise<EvaluationResult & { tokenUsage?: TokenUsage; keyUsed?: number }> {
  const evaluationUrl = process.env.EXPO_PUBLIC_AI_EVALUATION_URL?.trim();

  if (!evaluationUrl) {
    console.log('[EthiCoreApp] Using local ethics evaluation engine');
    return buildLocalFallbackEvaluation(decision, scenario) as EvaluationResult & { tokenUsage?: TokenUsage; keyUsed?: number };
  }

  try {
    const response = await fetch(evaluationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, scenario, courseContext }),
    });

    if (!response.ok) {
      throw new Error(`Evaluation service returned ${response.status}`);
    }

    const result = await response.json() as Partial<EvaluationResult>;
    if (!result.verdict || !result.reasoning) {
      throw new Error('Evaluation service returned an invalid result');
    }

    return {
      verdict: result.verdict,
      reasoning: String(result.reasoning),
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.75,
      recommendations: Array.isArray(result.recommendations) ? result.recommendations.map(String).slice(0, 2) : [],
      alignmentWithLearningMaterial: String(result.alignmentWithLearningMaterial || ''),
      possibleConsequences: Array.isArray(result.possibleConsequences) ? result.possibleConsequences.map(String).slice(0, 2) : [],
      possibleBenefits: Array.isArray(result.possibleBenefits) ? result.possibleBenefits.map(String).slice(0, 2) : [],
      principles: Array.isArray(result.principles) ? result.principles.map(String).slice(0, 3) : [],
    };
  } catch (error) {
    console.warn('[EthiCoreApp] Evaluation service unavailable; using local evaluator.', error);
    return buildLocalFallbackEvaluation(decision, scenario) as EvaluationResult & { tokenUsage?: TokenUsage; keyUsed?: number };
  }
}

// ── Single Key Attempt ────────────────────────────────────────────
async function tryKey(
  key: string,
  index: number,
  decision: any,
  scenario: any,
  courseContext: string
): Promise<EvaluationResult & { tokenUsage: TokenUsage; keyUsed: number }> {
  const response = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: `Return ONLY valid JSON in this exact shape:
{
  "verdict": "ethical" | "unethical" | "mixed",
  "reasoning": "string",
  "confidence": 0.0-1.0,
  "recommendations": ["string", "string", "string", "string", "string"],
  "alignmentWithLearningMaterial": "string",
  "possibleConsequences": ["string", "string", "string", "string", "string"],
  "possibleBenefits": ["string", "string", "string", "string", "string"],
  "principles": ["string", "string", "string", "string", "string"]
}
Keep the output short but thoughtful. Explain ethics in context, mention harms/benefits, accountability, fairness, and stakeholder impact. Use clear English and 3-5 items per array.`,
        },
        {
          role: 'user',
          content: buildPrompt(decision, scenario, courseContext),
        },
      ],
      temperature: 0.35,
      max_tokens: GROQ_MAX_TOKENS,
      response_format: { type: 'json_object' },
    }),
  }, 2, 1500); // 2 retries, 1.5s base delay

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  if (!data.usage || !data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from Groq API');
  }

  const usage: TokenUsage = {
    promptTokens: data.usage.prompt_tokens || 0,
    completionTokens: data.usage.completion_tokens || 0,
    totalTokens: data.usage.total_tokens || 0,
    timestamp: new Date().toISOString(),
    model: 'openai/gpt-oss-20b',
    apiKeyIndex: index,
  };
  logTokenUsage(usage);

  let content: any;
  try {
    content = JSON.parse(data.choices[0].message.content);
  } catch (parseError) {
    console.error('Failed to parse Groq response:', data.choices[0].message.content);
    throw new Error('Invalid JSON in Groq response');
  }

  // Validate required fields
  if (!content.verdict || !['ethical', 'unethical', 'mixed'].includes(content.verdict)) {
    console.warn('Invalid or missing verdict, defaulting to mixed');
    content.verdict = 'mixed';
  }

  return {
    verdict: content.verdict,
    reasoning: cleanEvaluationText(content.reasoning) || 'No reasoning provided.',
    confidence: typeof content.confidence === 'number' ? Math.max(0, Math.min(1, content.confidence)) : 0.7,
    recommendations: cleanEvaluationArray(content.recommendations),
    alignmentWithLearningMaterial: cleanEvaluationText(content.alignmentWithLearningMaterial),
    possibleConsequences: cleanEvaluationArray(content.possibleConsequences),
    possibleBenefits: cleanEvaluationArray(content.possibleBenefits),
    principles: cleanEvaluationArray(content.principles),
    tokenUsage: usage,
    keyUsed: index + 1,
  };
}

// ── Stats Export for UI ───────────────────────────────────────────
export function getAllKeysStats() {
  return GROQ_API_KEYS.map((_, index) => ({
    keyNumber: index + 1,
    ...getKeyUsageStats(index),
  }));
}

function buildPrompt(decision: any, scenario: any, courseContext: string): string {
  const compactContext = compressCourseContext(courseContext);

  return `## SCENARIO
Title: ${scenario?.title || 'N/A'}
Setup: ${scenario?.scenarioSetup || 'N/A'}

## DECISION
Title: ${decision?.title || 'N/A'}
Analysis: ${decision?.analysis || 'N/A'}
Immediate: ${decision?.immediate || 'N/A'}
Ripple: ${decision?.ripple || 'N/A'}
Long-term: ${decision?.longTerm || 'N/A'}

## COURSE CONTEXT
${compactContext || 'General ethics and professional responsibility principles.'}`;
}
