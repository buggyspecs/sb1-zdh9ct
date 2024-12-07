'use client';

import { useState, useCallback } from 'react';

interface ConversionItem {
  id: string;
  name: string;
  url: string;
  blob?: Blob;
  status: 'converting' | 'completed' | 'error';
  error?: string;
  timeTaken?: number;
}

export function useConversions() {
  const [conversions, setConversions] = useState<ConversionItem[]>([]);

  const addConversions = useCallback((newConversions: ConversionItem[]) => {
    setConversions(prev => [...prev, ...newConversions]);
  }, []);

  const updateConversion = useCallback((id: string, updates: Partial<ConversionItem>) => {
    setConversions(prev =>
      prev.map(conv =>
        conv.id === id
          ? { ...conv, ...updates }
          : conv
      )
    );
  }, []);

  const clearConversions = useCallback(() => {
    setConversions([]);
  }, []);

  return {
    conversions,
    addConversions,
    updateConversion,
    clearConversions
  };
}