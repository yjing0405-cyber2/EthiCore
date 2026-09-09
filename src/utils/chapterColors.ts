export const getChapterAccent = (chapterId: number) => {
  const palette = [
    ['#2563EB', '#DBEAFE'],
    ['#7C3AED', '#EDE9FE'],
    ['#0F766E', '#CCFBF1'],
    ['#DC2626', '#FEE2E2'],
    ['#D97706', '#FEF3C7'],
    ['#059669', '#D1FAE5'],
    ['#4F46E5', '#E0E7FF'],
  ];

  const [main, soft] = palette[(chapterId - 1) % palette.length] ?? palette[0];
  return [main, soft] as const;
};
