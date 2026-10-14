import express from 'express';
import { summarizeContent, suggestTags, askBrain } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(requireAuth);
router.use(aiLimiter);

router.post('/summarize', summarizeContent);
router.post('/tags', suggestTags);
router.post('/ask-brain', askBrain);

export default router;
