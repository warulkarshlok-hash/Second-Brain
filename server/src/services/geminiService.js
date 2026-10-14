import { getGeminiClient, isGeminiConfigured } from '../config/gemini.js';

/**
 * Generate an executive summary using Google Gemini API
 */
export const generateSummary = async ({ type, title, content, description, url }) => {
  const gemini = getGeminiClient();

  if (!gemini || !isGeminiConfigured()) {
    // Intelligent fallback summary when GEMINI_API_KEY is not yet added
    const fallbackText = content || description || title;
    return `[AI Summary Preview] ${title}: Highlights key information about ${type}. Includes core concepts, practical applications, and actionable takeaways from the saved material. (Connect GEMINI_API_KEY in server/.env for live Gemini 1.5 Flash generation)`;
  }

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert knowledge curator for a "Second Brain" digital vault.
Generate a concise, insightful executive summary (2-4 sentences) capturing the core thesis, key insights, and actionable takeaways from the following item.

Content Details:
Type: ${type}
Title: ${title}
URL: ${url || 'N/A'}
Description: ${description || 'N/A'}
Text Content: ${content ? content.slice(0, 4000) : 'None provided'}

Guidelines:
- Highlight the most valuable points.
- Do not begin with "This is about..." or "In this video...".
- Be direct, professional, and punchy.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('❌ [Gemini Summarize Error]:', error.message);
    throw new Error(`Gemini summary generation failed: ${error.message}`);
  }
};

/**
 * Generate smart relevant tags using Google Gemini API
 */
export const generateTags = async ({ type, title, content, description, currentTags = [] }) => {
  const gemini = getGeminiClient();

  if (!gemini || !isGeminiConfigured()) {
    // Fallback tag suggestion
    const defaultTagPool = {
      youtube: ['video', 'learning', 'tutorial', 'insights'],
      article: ['reading', 'deep-dive', 'research', 'guide'],
      url: ['web', 'reference', 'tools', 'resource'],
      note: ['idea', 'brainstorm', 'workflow', 'draft'],
    };
    const words = `${title} ${description || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .slice(0, 3);

    const merged = Array.from(new Set([...currentTags, ...words, ...(defaultTagPool[type] || ['knowledge'])]));
    return merged.slice(0, 5);
  }

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate 3 to 6 relevant, high-quality tags for an item in a personal knowledge vault (Second Brain).
Type: ${type}
Title: ${title}
Context: ${(description || '') + ' ' + (content ? content.slice(0, 2000) : '')}
Existing Tags: ${currentTags.join(', ')}

Output rules:
- Return ONLY a comma-separated list of tags (e.g.: productivity, machine-learning, typescript).
- Tags must be lowercase, alphanumeric with hyphens if multi-word.
- Do not include hashtags (#) or bullets.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text().trim();
    
    const suggested = raw
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, '').replace(/\s+/g, '-'))
      .filter((t) => t.length > 1 && t.length < 30);

    return Array.from(new Set([...currentTags, ...suggested])).slice(0, 8);
  } catch (error) {
    console.error('❌ [Gemini Tags Error]:', error.message);
    throw new Error(`Gemini tag generation failed: ${error.message}`);
  }
};

/**
 * "Ask My Brain" - RAG Query over the user's personal vault items
 */
export const queryUserBrain = async ({ query, userItems = [] }) => {
  if (!userItems || userItems.length === 0) {
    return {
      answer: "Your Second Brain doesn't have any items saved yet! Save some YouTube videos, articles, links, or notes first, and I will be able to synthesize and answer questions based on your personal knowledge vault.",
      citations: [],
    };
  }

  // 1. Scoring & Relevance retrieval
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scoredItems = userItems.map((item) => {
    let score = 0;
    const titleLower = (item.title || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const tagsLower = (item.tags || []).join(' ').toLowerCase();

    queryTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 5;
      if (tagsLower.includes(term)) score += 3;
      if (descLower.includes(term)) score += 2;
      if (contentLower.includes(term)) score += 1;
    });

    return { item, score };
  });

  // Sort by relevance score
  scoredItems.sort((a, b) => b.score - a.score);

  // Take top 6 items (or all items if score is 0, give most recent 5)
  const topMatches = (scoredItems[0]?.score > 0 ? scoredItems.filter((s) => s.score > 0) : scoredItems)
    .slice(0, 6)
    .map((s) => s.item);

  const gemini = getGeminiClient();

  if (!gemini || !isGeminiConfigured()) {
    // Intelligent synthesized response when GEMINI_API_KEY is not yet added
    const citations = topMatches.map((item) => ({
      id: item._id,
      title: item.title,
      type: item.type,
      snippet: (item.summary || item.description || item.content || '').slice(0, 140) + '...',
    }));

    const titlesList = topMatches.map((m) => `• "${m.title}" (${m.type})`).join('\n');

    return {
      answer: `Based on your saved vault items:\n\n${titlesList}\n\nYour query regarding "${query}" touches on concepts documented in these entries. (💡 Notice: GEMINI_API_KEY is not yet set in server/.env. Add your Google Gemini API key to enable live conversational synthesis and deep multi-source answers!)`,
      citations,
      isDemo: true,
    };
  }

  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Format context from user's vault items
    const contextPrompt = topMatches
      .map((item, idx) => {
        return `[Source ${idx + 1} - "${item.title}"] (Type: ${item.type}, Tags: ${item.tags.join(', ')})
${item.summary ? `Summary: ${item.summary}\n` : ''}${item.description ? `Description: ${item.description}\n` : ''}${item.content ? `Content: ${item.content.slice(0, 1200)}\n` : ''}`;
      })
      .join('\n---\n');

    const prompt = `
You are the personal AI Assistant for "Second Brain".
The user is asking a question about their saved knowledge vault.

=== USER QUESTION ===
"${query}"

=== USER'S KNOWLEDGE VAULT CONTEXT ===
${contextPrompt}

=== INSTRUCTIONS ===
1. Answer the user's question directly, clearly, and thoughtfully based on the information provided in their vault.
2. Explicitly cite which saved items support your points using the format [Source: "Item Title"].
3. Synthesize ideas across multiple sources if relevant.
4. If the vault doesn't fully answer the question, answer with what is known from their notes and briefly supplement with general knowledge, making clear what was in their brain vs general insight.
5. Keep the tone helpful, sharp, and organized (use bullet points or headers if appropriate).
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim();

    const citations = topMatches.map((item) => ({
      id: item._id,
      title: item.title,
      type: item.type,
      snippet: (item.summary || item.description || item.content || '').slice(0, 140) + '...',
    }));

    return {
      answer,
      citations,
      isDemo: false,
    };
  } catch (error) {
    console.error('❌ [Gemini Ask Brain Error]:', error.message);
    throw new Error(`Ask My Brain failed: ${error.message}`);
  }
};
