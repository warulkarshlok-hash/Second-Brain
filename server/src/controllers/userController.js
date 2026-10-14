import { Content } from '../models/Content.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryContents } from '../services/storeService.js';

/**
 * Get current authenticated user profile and stats
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    let totalSaved = 0;
    if (!isDbConnected() || isMemoryStoreActive()) {
      totalSaved = getMemoryContents().filter((c) => c.userId === userId).length;
    } else {
      totalSaved = await Content.countDocuments({ userId });
    }

    res.json({
      success: true,
      user: {
        ...req.user,
        totalSaved,
      },
    });
  } catch (error) {
    next(error);
  }
};
