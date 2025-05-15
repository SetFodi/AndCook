'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LoadingIndicator from '../components/ui/LoadingIndicator';

interface LoadingContextType {
  isLoading: boolean;
  isSessionLoading: boolean;
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
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track session loading state
  useEffect(() => {
    console.log(`Session status changed: ${status}`);

    if (status === 'loading') {
      setIsSessionLoading(true);
    } else {
      console.log('Session loaded, waiting to ensure data consistency...');
      // Add a delay to ensure all session-dependent data is loaded
      const timer = setTimeout(() => {
        console.log('Session loading complete, ready to fetch data');
        setIsSessionLoading(false);
        setInitialLoadComplete(true);
      }, 1500); // 1.5 second delay after session is loaded for better reliability

      return () => clearTimeout(timer);
    }
  }, [status]);

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
    isSessionLoading,
    startLoading,
    stopLoading
  }), [isLoading, isSessionLoading, startLoading, stopLoading]);

  // Show loading indicator if either regular loading or session loading is active
  const showLoadingIndicator = isLoading || (isSessionLoading && !initialLoadComplete);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {showLoadingIndicator && (
        <LoadingIndicator
          fullScreen
          size="large"
          text={isSessionLoading ? "Loading your session..." : undefined}
        />
      )}
    </LoadingContext.Provider>
  );
}
