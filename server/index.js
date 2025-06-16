import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Language codes mapping
const LANGUAGES = {
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
  'zh': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'tr': 'Turkish',
  'pl': 'Polish',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'cs': 'Czech',
  'sk': 'Slovak',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sr': 'Serbian',
  'sl': 'Slovenian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'uk': 'Ukrainian',
  'be': 'Belarusian',
  'ka': 'Georgian',
  'hy': 'Armenian',
  'he': 'Hebrew',
  'ur': 'Urdu',
  'fa': 'Persian',
  'bn': 'Bengali',
  'ta': 'Tamil',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'kn': 'Kannada',
  'gu': 'Gujarati',
  'pa': 'Punjabi',
  'mr': 'Marathi',
  'ne': 'Nepali',
  'si': 'Sinhala',
  'my': 'Myanmar',
  'km': 'Khmer',
  'lo': 'Lao',
  'ka': 'Georgian',
  'am': 'Amharic',
  'sw': 'Swahili',
  'zu': 'Zulu',
  'af': 'Afrikaans'
};

// Get available languages
app.get('/api/languages', (req, res) => {
  res.json(LANGUAGES);
});

// Translate text using MyMemory API
app.post('/api/translate', async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !to) {
      return res.status(400).json({ 
        error: 'Missing required fields: text and target language' 
      });
    }

    // Handle auto-detect
    const sourceLanguage = from === 'auto' ? 'auto' : from;
    
    // MyMemory Translation API (free tier)
    const apiUrl = 'https://api.mymemory.translated.net/get';
    const params = {
      q: text,
      langpair: sourceLanguage === 'auto' ? `${to}|${to}` : `${sourceLanguage}|${to}`,
      de: 'translator@example.com' // Optional email for higher quota
    };

    const response = await axios.get(apiUrl, { params });
    
    if (response.data && response.data.responseData) {
      const translatedText = response.data.responseData.translatedText;
      const detectedLanguage = response.data.responseData.match?.detectedSourceLanguage;
      
      res.json({
        translatedText,
        detectedLanguage,
        originalText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: to,
        confidence: response.data.responseData.match?.quality || 0
      });
    } else {
      // Fallback response for demonstration
      res.json({
        translatedText: `[DEMO] Translated: "${text}" from ${sourceLanguage} to ${to}`,
        detectedLanguage: sourceLanguage,
        originalText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: to,
        confidence: 0.85
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    
    // Provide fallback translation for demo purposes
    const { text, from, to } = req.body;
    res.json({
      translatedText: `[DEMO MODE] Translation of "${text}" from ${from || 'auto'} to ${to}`,
      detectedLanguage: from,
      originalText: text,
      sourceLanguage: from,
      targetLanguage: to,
      confidence: 0.75,
      isDemoMode: true
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Translation server running on http://localhost:${PORT}`);
});