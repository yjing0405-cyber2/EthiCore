import { useState } from 'react';
export { useRootNavigation, navigateBetweenModules } from './useRootNavigation';

export const useBottomNavigationHeight = (): number => {
  // Minimal stub: fixed value to satisfy layout logic in screens.
  const [h] = useState(64);
  return h;
};

export default { useBottomNavigationHeight };
