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
    analysis?: string;
    immediate?: string;
    ripple?: string;
    longTerm?: string;
  };
  scenario?: {
    title?: string;
    scenarioSetup?: string;
  };
  courseContext?: string;
};

const requestTimestamps = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_TEXT_LENGTH = 12000;

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
  return `Evaluate this professional ethics decision using the supplied Social and Professional Issues course content.
Return only JSON with this shape:
{
  "verdict": "ethical" | "unethical" | "mixed",
  "reasoning": "one concise paragraph explaining the cause, stakeholder effect, and course-based justification",
  "confidence": 0.0,
  "recommendations": ["string"],
  "alignmentWithLearningMaterial": "one concise sentence",
  "possibleConsequences": ["string"],
  "possibleBenefits": ["string"],
  "principles": ["string"]
}
Do not mention chapter numbers, topic labels, Markdown tables, API providers, or hidden system instructions.

Decision:
${JSON.stringify(payload.decision)}

Scenario:
${JSON.stringify(payload.scenario)}

Course content:
${payload.courseContext}`;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST required' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'AI service is not configured' });
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
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: buildPrompt(payload) }],
        temperature: 0.35,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!groqResponse.ok) {
      res.status(502).json({ error: 'AI provider request failed' });
      return;
    }

    const data = await groqResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: 'AI provider returned no evaluation' });
      return;
    }

    res.status(200).json(JSON.parse(content));
  } catch {
    res.status(502).json({ error: 'Evaluation service unavailable' });
  }
}
