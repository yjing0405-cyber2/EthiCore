export const scoreWritingResponse = (answer: string, expectedKeywords: string[] = []) => {
  const normalized = answer.toLowerCase();
  const keywordHits = expectedKeywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const keywordScore = expectedKeywords.length > 0 ? Math.min(100, Math.round((keywordHits.length / expectedKeywords.length) * 100)) : 70;
  const lengthScore = normalized.trim().length > 20 ? 20 : Math.min(20, Math.round(normalized.trim().length / 2));
  const score = Math.min(100, keywordScore + lengthScore);

  return {
    score,
    feedback: keywordHits.length > 0
      ? `Your response includes ${keywordHits.length} relevant idea${keywordHits.length === 1 ? '' : 's'}.`
      : 'Add a clearer explanation of the ethical issue and its consequences.',
  };
};
