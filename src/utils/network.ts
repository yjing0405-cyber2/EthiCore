import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    setIsOnline(true);
    setIsLoading(false);
    setIsReconnecting(false);
  }, []);

  return { isOnline, isLoading, isReconnecting };
};
