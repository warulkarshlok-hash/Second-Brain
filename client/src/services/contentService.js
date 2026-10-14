import api from './api.js';

export const contentService = {
  async getContents(params = {}) {
    const res = await api.get('/content', { params });
    return res.data;
  },

  async getContentById(id) {
    const res = await api.get(`/content/${id}`);
    return res.data;
  },

  async createContent(data) {
    const res = await api.post('/content', data);
    return res.data;
  },

  async updateContent(id, data) {
    const res = await api.put(`/content/${id}`, data);
    return res.data;
  },

  async deleteContent(id) {
    const res = await api.delete(`/content/${id}`);
    return res.data;
  },

  async toggleFavorite(id) {
    const res = await api.patch(`/content/${id}/favorite`);
    return res.data;
  },

  async togglePin(id) {
    const res = await api.patch(`/content/${id}/pin`);
    return res.data;
  },

  async getUserTags() {
    const res = await api.get('/content/tags');
    return res.data;
  },

  async getUserStats() {
    const res = await api.get('/content/stats');
    return res.data;
  },
};
