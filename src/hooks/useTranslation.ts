import { useState, useCallback } from 'react';

interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
  isDemoMode?: boolean;
}

interface TranslationItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
}

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TranslationItem[]>([]);

  const translate = useCallback(async (
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResult | null> => {
    if (!text.trim()) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          from: sourceLanguage,
          to: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TranslationResult = await response.json();

      // Add to history
      const historyItem: TranslationItem = {
        id: Date.now().toString(),
        originalText: text,
        translatedText: result.translatedText,
        sourceLanguage: result.detectedLanguage || sourceLanguage,
        targetLanguage,
        timestamp: new Date(),
      };

      setHistory(prev => [historyItem, ...prev]);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.error('Translation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    translate,
    isLoading,
    error,
    history,
    clearHistory,
  };
};