import api from './api.js';

export const aiService = {
  async summarize(payload) {
    const res = await api.post('/ai/summarize', payload);
    return res.data;
  },

  async suggestTags(payload) {
    const res = await api.post('/ai/tags', payload);
    return res.data;
  },

  async askBrain(query) {
    const res = await api.post('/ai/ask-brain', { query });
    return res.data;
  },
};
