import { useState, useEffect } from 'react';

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/languages');
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }
        const data = await response.json();
        setLanguages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load languages');
        // Fallback languages
        setLanguages({
          'auto': 'Auto Detect',
          'en': 'English',
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German',
          'it': 'Italian',
          'pt': 'Portuguese',
          'ru': 'Russian',
          'ja': 'Japanese',
          'ko': 'Korean',
          'zh': 'Chinese',
          'ar': 'Arabic',
          'hi': 'Hindi',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, isLoading, error };
};