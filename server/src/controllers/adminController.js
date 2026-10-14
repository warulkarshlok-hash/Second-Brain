import { User } from '../models/User.js';
import { Content } from '../models/Content.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryUsers, getMemoryContents, getMemoryLogs } from '../services/storeService.js';
import { logActivity } from '../services/auditService.js';

/**
 * Get comprehensive system statistics for Admin Dashboard
 */
export const getAdminStats = async (req, res, next) => {
  try {
    if (!isDbConnected() || isMemoryStoreActive()) {
      const users = getMemoryUsers();
      const contents = getMemoryContents();
      const logs = getMemoryLogs();

      const typeBreakdown = {
        youtube: contents.filter((c) => c.type === 'youtube').length,
        url: contents.filter((c) => c.type === 'url').length,
        article: contents.filter((c) => c.type === 'article').length,
        note: contents.filter((c) => c.type === 'note').length,
      };

      const aiCalls = logs.filter((l) => l.action.startsWith('AI_')).length;

      return res.json({
        success: true,
        stats: {
          totalUsers: users.length,
          totalContents: contents.length,
          typeBreakdown,
          totalAiQueries: aiCalls,
          totalLogs: logs.length,
          favoritesCount: contents.filter((c) => c.isFavorite).length,
          activeToday: users.filter((u) => {
            const diff = Date.now() - new Date(u.lastLogin).getTime();
            return diff < 86400000;
          }).length,
        },
      });
    }

    // MongoDB Aggregations
    const [totalUsers, totalContents, logsCount, aiLogsCount] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      ActivityLog.countDocuments(),
      ActivityLog.countDocuments({ action: { $regex: /^AI_/ } }),
    ]);

    const typeBreakdownAgg = await Content.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const typeBreakdown = {
      youtube: 0,
      url: 0,
      article: 0,
      note: 0,
    };
    typeBreakdownAgg.forEach((item) => {
      if (typeBreakdown[item._id] !== undefined) {
        typeBreakdown[item._id] = item.count;
      }
    });

    const favoritesCount = await Content.countDocuments({ isFavorite: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalContents,
        typeBreakdown,
        totalAiQueries: aiLogsCount,
        totalLogs: logsCount,
        favoritesCount,
        activeToday: 1, // Current active users
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with their content count (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    if (!isDbConnected() || isMemoryStoreActive()) {
      const memoryUsers = getMemoryUsers();
      const contents = getMemoryContents();

      const userList = memoryUsers.map((u) => ({
        _id: u._id,
        auth0Id: u.auth0Id,
        email: u.email,
        name: u.name,
        picture: u.picture,
        role: u.role,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
        contentCount: contents.filter((c) => c.userId === u.auth0Id).length,
      }));

      return res.json({ success: true, data: userList });
    }

    const users = await User.find().sort({ createdAt: -1 }).lean();

    // Map content count per user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const count = await Content.countDocuments({ userId: u.auth0Id });
        return {
          ...u,
          contentCount: count,
        };
      })
    );

    res.json({ success: true, data: usersWithCounts });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (promote/demote user, Admin only)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: "Role must be 'user' or 'admin'" });
    }

    if (!isDbConnected() || isMemoryStoreActive()) {
      const users = getMemoryUsers();
      const target = users.find((u) => u.auth0Id === userId || u._id === userId);
      if (!target) return res.status(404).json({ success: false, error: 'User not found' });

      target.role = role;

      await logActivity({
        userId: req.user.sub,
        userEmail: req.user.email,
        userName: req.user.name,
        action: 'ADMIN_ROLE_CHANGE',
        details: { targetUserId: userId, newRole: role },
        ipAddress: req.ip,
      });

      return res.json({ success: true, message: `User role updated to ${role}`, data: target });
    }

    const targetUser = await User.findOneAndUpdate(
      { $or: [{ auth0Id: userId }, { _id: userId }] },
      { $set: { role } },
      { new: true }
    );

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await logActivity({
      userId: req.user.sub,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'ADMIN_ROLE_CHANGE',
      details: { targetUserId: targetUser.auth0Id, newRole: role },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `User role updated to ${role}`, data: targetUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent system activity logs (Admin only)
 */
export const getActivityLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const logs = getMemoryLogs().slice(0, limit);
      return res.json({ success: true, data: logs });
    }

    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
