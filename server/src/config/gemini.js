import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }

  if (!geminiClient) {
    try {
      geminiClient = new GoogleGenerativeAI(apiKey.trim());
      console.log('🤖 [Gemini AI] Initialized with Google Generative AI SDK');
    } catch (err) {
      console.error('❌ [Gemini AI Init Error]:', err.message);
      return null;
    }
  }

  return geminiClient;
};

export const isGeminiConfigured = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key'));
};
