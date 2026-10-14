import api from './api.js';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async getActivityLogs(limit = 50) {
    const res = await api.get('/admin/logs', { params: { limit } });
    return res.data;
  },
};
