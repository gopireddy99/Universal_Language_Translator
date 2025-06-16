import React, { useState, useCallback } from 'react';
import { Languages, ArrowLeftRight, Globe, Zap } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationCard } from './components/TranslationCard';
import { TranslationHistory } from './components/TranslationHistory';
import { useTranslation } from './hooks/useTranslation';
import { useLanguages } from './hooks/useLanguages';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [copied, setCopied] = useState(false);

  const { translate, isLoading, error, history, clearHistory } = useTranslation();
  const { languages, isLoading: languagesLoading } = useLanguages();

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    const result = await translate(sourceText, sourceLanguage, targetLanguage);
    if (result) {
      setTranslatedText(result.translatedText);
    }
  }, [sourceText, sourceLanguage, targetLanguage, translate]);

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') return;
    
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = async () => {
    if (translatedText) {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHistorySelect = (item: any) => {
    setSourceText(item.originalText);
    setTranslatedText(item.translatedText);
    setSourceLanguage(item.sourceLanguage);
    setTargetLanguage(item.targetLanguage);
  };

  if (languagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Languages className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Universal Translator</h1>
                <p className="text-sm text-gray-600">Powered by AI • 50+ Languages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>Real-time translation</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Translation Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Selectors */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <LanguageSelector
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  languages={languages}
                  label="From"
                />
                
                <div className="flex items-center justify-between">
                  <LanguageSelector
                    value={targetLanguage}
                    onChange={setTargetLanguage}
                    languages={languages}
                    label="To"
                    excludeAuto
                  />
                  <button
                    onClick={handleSwapLanguages}
                    disabled={sourceLanguage === 'auto'}
                    className="ml-4 p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                    title="Swap Languages"
                  >
                    <ArrowLeftRight className={`h-5 w-5 ${sourceLanguage === 'auto' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Translation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TranslationCard
                title="Original Text"
                text={sourceText}
                onChange={setSourceText}
                placeholder="Enter text to translate..."
                maxLength={5000}
              />
              
              <TranslationCard
                title="Translation"
                text={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                onCopy={handleCopy}
                copied={copied}
              />
            </div>

            {/* Translate Button */}
            <div className="text-center">
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Translating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5" />
                    <span>Translate</span>
                  </div>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TranslationHistory
              history={history}
              onClear={clearHistory}
              onSelect={handleHistorySelect}
              languages={languages}
            />

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>50+ supported languages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Automatic language detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Text-to-speech playback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Translation history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Copy to clipboard</span>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-6">
              <h3 className="text-lg font-semibold mb-4">Translation Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Translations:</span>
                  <span className="font-semibold">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Languages Available:</span>
                  <span className="font-semibold">{Object.keys(languages).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Character Limit:</span>
                  <span className="font-semibold">5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;