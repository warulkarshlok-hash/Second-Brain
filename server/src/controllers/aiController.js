import { generateSummary, generateTags, queryUserBrain } from '../services/geminiService.js';
import { Content } from '../models/Content.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryContents } from '../services/storeService.js';
import { logActivity } from '../services/auditService.js';

/**
 * Summarize item content with Gemini AI
 */
export const summarizeContent = async (req, res, next) => {
  try {
    const { type = 'note', title, content = '', description = '', url = '' } = req.body;

    if (!title && !content && !description) {
      return res.status(400).json({
        success: false,
        error: 'Provide at least title, description, or content to generate a summary',
      });
    }

    const summary = await generateSummary({
      type,
      title: title || 'Untitled Knowledge Item',
      content,
      description,
      url,
    });

    await logActivity({
      userId: req.user.sub,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'AI_SUMMARIZE',
      details: { title, type },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Suggest tags with Gemini AI
 */
export const suggestTags = async (req, res, next) => {
  try {
    const { type = 'note', title = '', content = '', description = '', currentTags = [] } = req.body;

    if (!title && !content && !description) {
      return res.status(400).json({
        success: false,
        error: 'Provide title or content to suggest tags',
      });
    }

    const tags = await generateTags({
      type,
      title,
      content,
      description,
      currentTags,
    });

    await logActivity({
      userId: req.user.sub,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'AI_TAGS',
      details: { count: tags.length },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      tags,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * "Ask My Brain" - RAG semantic QA over user's personal vault
 */
export const askBrain = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'A search query or question is required',
      });
    }

    let userItems = [];

    if (!isDbConnected() || isMemoryStoreActive()) {
      userItems = getMemoryContents().filter((c) => c.userId === userId);
    } else {
      userItems = await Content.find({ userId })
        .select('title type description content summary tags url createdAt')
        .lean();
    }

    const result = await queryUserBrain({
      query: query.trim(),
      userItems,
    });

    await logActivity({
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'AI_ASK_BRAIN',
      details: { query: query.trim(), citationsCount: result.citations.length },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
