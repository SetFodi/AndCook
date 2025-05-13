'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import LoadingIndicator from '../components/ui/LoadingIndicator';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  // Use a counter to track nested loading states
  const startLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = prev + 1;
      if (newCount === 1) {
        setIsLoading(true);
      }
      return newCount;
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isLoading,
    startLoading,
    stopLoading
  }), [isLoading, startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && <LoadingIndicator fullScreen size="large" />}
    </LoadingContext.Provider>
  );
}
