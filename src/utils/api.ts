export const logEvent = async (_event: { type: string; payload?: Record<string, unknown> }) => {
  return Promise.resolve();
};

export const syncProgress = async (_payload: unknown) => {
  return Promise.resolve();
};
