import { ActivityLog } from '../models/ActivityLog.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryLogs } from './storeService.js';

export const logActivity = async ({ userId, userEmail, userName, action, details, ipAddress }) => {
  try {
    const entry = {
      userId,
      userEmail: userEmail || '',
      userName: userName || '',
      action,
      details: details || {},
      ipAddress: ipAddress || '',
      createdAt: new Date(),
    };

    if (!isDbConnected() || isMemoryStoreActive()) {
      const logs = getMemoryLogs();
      logs.unshift({ ...entry, _id: `mem_log_${Date.now()}` });
      if (logs.length > 500) logs.pop();
      return;
    }

    await ActivityLog.create(entry);
  } catch (error) {
    console.error('⚠️ [Audit Log Error]:', error.message);
  }
};
