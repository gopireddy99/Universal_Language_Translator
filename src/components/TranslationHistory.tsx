import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

interface TranslationItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
}

interface TranslationHistoryProps {
  history: TranslationItem[];
  onClear: () => void;
  onSelect: (item: TranslationItem) => void;
  languages: Record<string, string>;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  onClear,
  onSelect,
  languages
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Translation History
          </h3>
        </div>
        <p className="text-gray-500 text-center py-8">No translations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Translation History
        </h3>
        <button
          onClick={onClear}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Clear History"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {history.slice(0, 10).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500">
                {languages[item.sourceLanguage]} → {languages[item.targetLanguage]}
              </span>
              <span className="text-xs text-gray-400">
                {item.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-800 truncate">{item.originalText}</p>
            <p className="text-sm text-blue-600 truncate mt-1">{item.translatedText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};