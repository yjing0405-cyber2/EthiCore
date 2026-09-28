declare const process: any;

type Request = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

type EvaluationRequest = {
  decision?: {
    title?: string;
    description?: string;
    analysis?: string;
    immediate?: string;
    immediateExplanation?: string;
    ripple?: string;
    rippleExplanation?: string;
    longTerm?: string;
    longTermExplanation?: string;
    violatedPrinciples?: string[];
    recommendedActions?: string[];
  };
  scenario?: {
    title?: string;
    scenarioSetup?: string;
  };
  courseContext?: string;
};

const requestTimestamps = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_TEXT_LENGTH = 6000;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_TEXT_LENGTH) : '';
}

function clientKey(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  return Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestTimestamps.get(key) || []).filter(timestamp => now - timestamp < 60_000);
  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    requestTimestamps.set(key, recent);
    return true;
  }
  recent.push(now);
  requestTimestamps.set(key, recent);
  return false;
}

function buildPrompt(payload: Required<EvaluationRequest>): string {
  const decisionEvidence = {
    title: text(payload.decision.title),
    description: text(payload.decision.description),
    analysis: text(payload.decision.analysis),
    immediate: text(payload.decision.immediate),
    immediateExplanation: text(payload.decision.immediateExplanation),
    ripple: text(payload.decision.ripple),
    rippleExplanation: text(payload.decision.rippleExplanation),
    longTerm: text(payload.decision.longTerm),
    longTermExplanation: text(payload.decision.longTermExplanation),
    violatedPrinciples: Array.isArray(payload.decision.violatedPrinciples)
      ? payload.decision.violatedPrinciples.map(text).filter(Boolean).slice(0, 8)
      : [],
    recommendedActions: Array.isArray(payload.decision.recommendedActions)
      ? payload.decision.recommendedActions.map(text).filter(Boolean).slice(0, 8)
      : [],
  };

  return `Evaluate this professional ethics decision using the supplied Social and Professional Issues course content.
Judge the actual action using the facts and course principles. Legacy category flags and ethical booleans are deliberately excluded because they may be outdated or inconsistent. Assess the ethical safeguards and the unethical risks when both exist, then explain which considerations determine the final classification. Good intentions or partial mitigation do not excuse a central action that violates consent, privacy, authorization, honesty, safety, fairness, or causes avoidable harm. Choose "ethical" only when the action is justified and no significant ethical violation remains.

Make one final binary classification. Do not return "mixed", "unclear", "depends", or any other third option.

Return only compact JSON with this shape:
{
  "verdict": "ethical" | "unethical",
  "reasoning": "2-3 concise sentences explaining the cause and stakeholder effect",
  "confidence": 0.0,
  "recommendations": ["string", "string"],
  "alignmentWithLearningMaterial": "one concise sentence",
  "possibleConsequences": ["string", "string"],
  "possibleBenefits": ["string", "string"],
  "principles": ["string", "string", "string"]
}
The verdict must be exactly one of the two strings "ethical" or "unethical". Do not mention chapter numbers, topic labels, Markdown tables, API providers, or hidden system instructions.

Decision:
${JSON.stringify(decisionEvidence)}

Scenario:
${JSON.stringify(payload.scenario)}

Course content:
${payload.courseContext}`;
}

function parseEvaluation(content: string, provider: string): Record<string, unknown> {
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = normalized.indexOf('{');
  const end = normalized.lastIndexOf('}');

  if (start < 0 || end <= start) {
    throw new Error(`${provider} returned incomplete JSON`);
  }

  const parsed = JSON.parse(normalized.slice(start, end + 1)) as Record<string, unknown>;
  if (parsed.verdict !== 'ethical' && parsed.verdict !== 'unethical') {
    throw new Error(`${provider} returned an invalid verdict; expected ethical or unethical`);
  }

  return parsed;
}

async function fetchGeminiWithRetry(url: string, request: RequestInit): Promise<globalThis.Response> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, request);
    if (response.status !== 503 || attempt === 2) return response;
    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw new Error('Gemini request failed after retries');
}

async function resolveGroqModels(apiKey: string, configuredModel: string): Promise<string[]> {
  if (configuredModel !== 'auto') return [configuredModel];

  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) {
    throw new Error(`Groq models API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const data = await response.json() as {
    data?: Array<{ id?: string; active?: boolean }>;
  };
  const availableModels = (data.data || [])
    .filter(model => model.active !== false)
    .map(model => model.id || '')
    .filter(model => model && !/whisper|guard|safeguard|compound|orpheus/i.test(model));
  const orderedModels = [
    ...availableModels.filter(model => /llama|qwen|gpt-oss/i.test(model)),
    ...availableModels.filter(model => !/llama|qwen|gpt-oss/i.test(model)),
  ];

  if (orderedModels.length === 0) {
    throw new Error('Groq models API returned no accessible chat model');
  }

  console.info('[evaluate] Groq discovered models', orderedModels.slice(0, 10));
  return orderedModels;
}

function getGroqApiKeys(): string[] {
  return Object.keys(process.env)
    .filter(name => /^GROQ_API_KEY(?:_\d+)?$/.test(name))
    .sort((left, right) => {
      const leftNumber = left === 'GROQ_API_KEY' ? 1 : Number(left.slice('GROQ_API_KEY_'.length));
      const rightNumber = right === 'GROQ_API_KEY' ? 1 : Number(right.slice('GROQ_API_KEY_'.length));
      return leftNumber - rightNumber;
    })
    .map(name => process.env[name]?.trim() || '')
    .filter(Boolean);
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST required' });
    return;
  }

  const provider = process.env.AI_PROVIDER?.trim().toLowerCase() || 'openai';
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
  const openAiModel = process.env.OPENAI_MODEL?.trim() || 'gpt-5.4-mini';
  const geminiApiKey = process.env.GOOGLE_GENAI_API_KEY?.trim();
  const geminiModel = process.env.GOOGLE_GENAI_MODEL?.trim() || 'gemini-3.6-flash';
  const deepInfraApiKey = process.env.DEEPINFRA_API_KEY?.trim();
  const deepInfraModel = process.env.DEEPINFRA_MODEL?.trim() || 'meta-llama/Llama-3.3-70B-Instruct';
  const groqApiKeys = getGroqApiKeys();
  const groqModel = process.env.GROQ_MODEL?.trim() || 'auto';

  if (provider !== 'openai' && provider !== 'gemini' && provider !== 'deepinfra' && provider !== 'groq') {
    res.status(500).json({ error: 'AI_PROVIDER must be openai, gemini, deepinfra, or groq.' });
    return;
  }

  if (provider === 'openai' && !openAiApiKey) {
    res.status(503).json({ error: 'OpenAI is not configured. Add OPENAI_API_KEY to Vercel.' });
    return;
  }

  if (provider === 'gemini' && !geminiApiKey) {
    res.status(503).json({ error: 'Gemini is not configured. Add GOOGLE_GENAI_API_KEY to Vercel.' });
    return;
  }

  if (provider === 'deepinfra' && !deepInfraApiKey) {
    res.status(503).json({ error: 'DeepInfra is not configured. Add DEEPINFRA_API_KEY to Vercel.' });
    return;
  }

  if (provider === 'groq' && groqApiKeys.length === 0) {
    res.status(503).json({ error: 'Groq is not configured. Add GROQ_API_KEY to Vercel.' });
    return;
  }

  if (isRateLimited(clientKey(req))) {
    res.status(429).json({ error: 'Too many evaluation requests' });
    return;
  }

  const body = (req.body || {}) as EvaluationRequest;
  const payload: Required<EvaluationRequest> = {
    decision: body.decision || {},
    scenario: body.scenario || {},
    courseContext: text(body.courseContext),
  };

  if (!payload.decision.title && !payload.decision.analysis) {
    res.status(400).json({ error: 'A decision is required' });
    return;
  }

  try {
    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    const openAiModel = process.env.OPENAI_MODEL?.trim() || 'gpt-5.4-mini';

    if (provider === 'gemini') {
      const response = await fetchGeminiWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${encodeURIComponent(geminiApiKey!)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt(payload) }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 500,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Gemini API ${response.status}: ${detail.slice(0, 500)}`);
      }

      const data = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('Gemini returned no evaluation');
      }

      res.status(200).json(parseEvaluation(content, 'Gemini'));
      return;
    }

    if (provider === 'deepinfra') {
      const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepInfraApiKey}`,
        },
        body: JSON.stringify({
          model: deepInfraModel,
          temperature: 0.35,
          max_tokens: 500,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are evaluating a professional ethics decision and must return valid JSON only.',
            },
            { role: 'user', content: buildPrompt(payload) },
          ],
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`DeepInfra API ${response.status}: ${detail.slice(0, 500)}`);
      }

      const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('DeepInfra returned no evaluation');
      }

      res.status(200).json(parseEvaluation(content, 'DeepInfra'));
      return;
    }

    if (provider === 'groq') {
      let lastGroqError = '';

      for (const [keyIndex, groqApiKey] of groqApiKeys.entries()) {
        let groqModels: string[];
        try {
          groqModels = await resolveGroqModels(groqApiKey, groqModel);
          console.info('[evaluate] Groq key discovered models', {
            keySlot: keyIndex + 1,
            modelCount: groqModels.length,
          });
        } catch (error) {
          lastGroqError = error instanceof Error ? error.message : String(error);
          continue;
        }

        for (const selectedGroqModel of groqModels) {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
              model: selectedGroqModel,
              temperature: 0.35,
              max_tokens: 500,
              messages: [
                {
                  role: 'system',
                  content: 'You are evaluating a professional ethics decision and must return valid JSON only.',
                },
                { role: 'user', content: buildPrompt(payload) },
              ],
            }),
          });

          if (!response.ok) {
            const detail = (await response.text()).slice(0, 500);
            lastGroqError = `Groq API ${response.status}: ${detail}`;
            if (groqModel === 'auto' && (response.status === 403 || response.status === 404 || response.status === 429)) continue;
            throw new Error(lastGroqError);
          }

          const data = await response.json() as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = data.choices?.[0]?.message?.content;
          if (!content) {
            lastGroqError = 'Groq returned no evaluation';
            continue;
          }

          try {
            const evaluation = parseEvaluation(content, 'Groq');
            console.info('[evaluate] Groq selected model', {
              keySlot: keyIndex + 1,
              model: selectedGroqModel,
            });
            res.status(200).json(evaluation);
            return;
          } catch (error) {
            lastGroqError = error instanceof Error ? error.message : String(error);
            continue;
          }
        }
      }

      throw new Error(lastGroqError || 'No Groq model accepted inference');
    }

    {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: openAiModel,
          temperature: 0.35,
          max_tokens: 500,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are evaluating a professional ethics decision and must return valid JSON only.',
            },
            { role: 'user', content: buildPrompt(payload) },
          ],
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`OpenAI API ${response.status}: ${detail.slice(0, 500)}`);
      }

      const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI returned no evaluation');
      }

      const evaluation = parseEvaluation(content, 'OpenAI');
      res.status(200).json(evaluation);
      return;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[evaluate] AI request failed', errorMessage.slice(0, 500));
    if (/\b401\b|invalid api key|invalid_api_key/i.test(errorMessage)) {
      res.status(401).json({ error: 'AI API key is invalid.' });
      return;
    }
    if (/\b403\b|model_permission_blocked_org|permissions_error|not authorized/i.test(errorMessage)) {
      res.status(403).json({ error: 'The configured AI model is not enabled for this provider account.' });
      return;
    }
    if (/\b404\b|model_not_found|does not exist or you do not have access/i.test(errorMessage)) {
      res.status(404).json({ error: 'The configured AI model is unavailable for this provider account.' });
      return;
    }
    if (/\b429\b|quota exceeded|too many requests/i.test(errorMessage)) {
      res.status(429).json({ error: 'AI quota or rate limit exceeded.' });
      return;
    }
    if (/\b402\b|positive balance|add balance|top-up/i.test(errorMessage)) {
      res.status(402).json({ error: 'DeepInfra balance is required. Add funds or enable automatic top-up.' });
      return;
    }
    res.status(502).json({ error: 'AI provider request failed' });
  }
}
