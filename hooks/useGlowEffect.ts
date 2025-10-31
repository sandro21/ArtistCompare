import { useState, useEffect } from 'react';

export const useGlowEffect = (hasPair: boolean, hasUrlParams: boolean) => {
  const [hasSeenGlow, setHasSeenGlow] = useState(false);

  // Trigger one-time glow effect when user first enters
  useEffect(() => {
    if (!hasSeenGlow && !hasPair && !hasUrlParams) {
      const timer = setTimeout(() => {
        setHasSeenGlow(true);
      }, 1000); // Start glow after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenGlow, hasPair, hasUrlParams]);

  // Stop glow effect after duration
  useEffect(() => {
    if (hasSeenGlow) {
      const timer = setTimeout(() => {
        setHasSeenGlow(false);
      }, 3000); // Stop glow after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenGlow]);

  return hasSeenGlow;
};

