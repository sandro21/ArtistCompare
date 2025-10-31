import { useState, useCallback, useRef } from 'react';

export const useLoadingScreen = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLoadingAnimation = useCallback(() => {
    // Clear any existing timeout and interval
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }

    setIsInitialLoading(true);
    setLoadingProgress(0);

    // Animate progress bar from 0 to 100 over 2.5 seconds
    const duration = 2500; // 2.5 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const steps = duration / interval; // 60 steps
    const progressIncrement = 100 / steps; // ~1.67% per step

    let currentProgress = 0;
    loadingIntervalRef.current = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setLoadingProgress(100);
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current);
          loadingIntervalRef.current = null;
        }
      } else {
        setLoadingProgress(currentProgress);
      }
    }, interval);

    // Hide loading screen after 2.5 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      setIsInitialLoading(false);
      setLoadingProgress(0);
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
      loadingTimeoutRef.current = null;
    }, duration);
  }, []);

  const stopLoading = useCallback(() => {
    setIsInitialLoading(false);
    setLoadingProgress(0);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }, []);

  return {
    isInitialLoading,
    loadingProgress,
    startLoadingAnimation,
    stopLoading,
  };
};

