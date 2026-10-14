import express from 'express';
import {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  toggleFavorite,
  togglePin,
  getUserTags,
  getUserStats,
} from '../controllers/contentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All content routes require authentication and strictly isolate data to req.user.sub
router.use(requireAuth);

router.get('/', getContents);
router.post('/', createContent);
router.get('/tags', getUserTags);
router.get('/stats', getUserStats);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/pin', togglePin);

export default router;
