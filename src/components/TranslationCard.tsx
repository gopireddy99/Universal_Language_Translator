import React from 'react';
import { Copy, Volume2, Check } from 'lucide-react';

interface TranslationCardProps {
  title: string;
  text: string;
  onChange?: (text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  onCopy?: () => void;
  copied?: boolean;
  maxLength?: number;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  title,
  text,
  onChange,
  readOnly = false,
  placeholder,
  onCopy,
  copied = false,
  maxLength
}) => {
  const handleSpeak = () => {
    if (text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {text && (
            <>
              <button
                onClick={handleSpeak}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Listen"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              {onCopy && (
                <button
                  onClick={onCopy}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full h-32 p-4 border rounded-lg resize-none transition-all duration-200 ${
            readOnly
              ? 'bg-gray-50 border-gray-200 text-gray-800'
              : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          } ${text ? 'text-gray-900' : 'text-gray-500'}`}
        />
        {maxLength && !readOnly && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {text.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};