import { Content } from '../models/Content.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryContents } from '../services/storeService.js';
import { logActivity } from '../services/auditService.js';

// Helper: Extract YouTube video ID
const extractYouTubeId = (url = '') => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

// Helper: Extract domain
const extractDomain = (url = '') => {
  try {
    if (!url) return '';
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
};

// Helper: Calculate reading time in minutes
const calculateReadingTime = (text = '') => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Get all content for the authenticated user with filtering, search, and sorting
 */
export const getContents = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { type, tag, isFavorite, isPinned, search, sortBy = 'newest' } = req.query;

    if (!isDbConnected() || isMemoryStoreActive()) {
      let items = getMemoryContents().filter((item) => item.userId === userId);

      // Filtering
      if (type && type !== 'all') {
        items = items.filter((item) => item.type === type);
      }
      if (tag) {
        items = items.filter((item) => item.tags && item.tags.includes(tag.toLowerCase()));
      }
      if (isFavorite === 'true') {
        items = items.filter((item) => item.isFavorite === true);
      }
      if (isPinned === 'true') {
        items = items.filter((item) => item.isPinned === true);
      }
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.content && item.content.toLowerCase().includes(query)) ||
            (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
        );
      }

      // Sorting
      items.sort((a, b) => {
        // Pinned items always float to top first unless specifically sorted otherwise
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }

        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
        return new Date(b.createdAt) - new Date(a.createdAt); // default: newest
      });

      return res.json({
        success: true,
        count: items.length,
        data: items,
      });
    }

    // MongoDB Query
    const query = { userId };

    if (type && type !== 'all') {
      query.type = type;
    }
    if (tag) {
      query.tags = tag.toLowerCase();
    }
    if (isFavorite === 'true') {
      query.isFavorite = true;
    }
    if (isPinned === 'true') {
      query.isPinned = true;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sortBy === 'oldest') sortOption = { isPinned: -1, createdAt: 1 };
    if (sortBy === 'title') sortOption = { isPinned: -1, title: 1 };
    if (sortBy === 'updated') sortOption = { isPinned: -1, updatedAt: -1 };

    const contents = await Content.find(query).sort(sortOption);

    res.json({
      success: true,
      count: contents.length,
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single content item by ID (strictly isolated to the user)
 */
export const getContentById = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const item = getMemoryContents().find((c) => c._id === id && c.userId === userId);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Content not found' });
      }
      return res.json({ success: true, data: item });
    }

    const item = await Content.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new content item
 */
export const createContent = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { type, title, url, description, content, summary, tags = [], isFavorite = false, isPinned = false } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, error: 'Title and type are required' });
    }

    if (!['youtube', 'url', 'article', 'note'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid content type' });
    }

    let youtubeId = '';
    let thumbnailUrl = '';
    let favicon = '';
    let domain = '';

    if (type === 'youtube' && url) {
      youtubeId = extractYouTubeId(url);
      if (youtubeId) {
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }
      favicon = 'https://www.youtube.com/s/desktop/f7579299/img/favicon.ico';
      domain = 'youtube.com';
    } else if (url) {
      domain = extractDomain(url);
      if (domain) {
        favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }
    }

    const sanitizedTags = Array.isArray(tags)
      ? tags.map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
      : [];

    const readingTime = calculateReadingTime((content || '') + ' ' + (description || ''));

    const contentData = {
      userId,
      type,
      title: title.trim(),
      url: url ? url.trim() : '',
      youtubeId,
      thumbnailUrl,
      favicon,
      domain,
      description: description ? description.trim() : '',
      content: content ? content.trim() : '',
      summary: summary ? summary.trim() : '',
      tags: sanitizedTags,
      isFavorite: Boolean(isFavorite),
      isPinned: Boolean(isPinned),
      readingTimeMinutes: readingTime,
    };

    if (!isDbConnected() || isMemoryStoreActive()) {
      const newItem = {
        ...contentData,
        _id: `mem_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      getMemoryContents().unshift(newItem);

      await logActivity({
        userId,
        userEmail: req.user.email,
        userName: req.user.name,
        action: 'CONTENT_CREATE',
        details: { id: newItem._id, title: newItem.title, type: newItem.type },
        ipAddress: req.ip,
      });

      return res.status(201).json({ success: true, data: newItem });
    }

    const created = await Content.create(contentData);

    await logActivity({
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'CONTENT_CREATE',
      details: { id: created._id, title: created.title, type: created.type },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

/**
 * Update content item (strictly isolated to user)
 */
export const updateContent = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const updates = req.body;

    // Disallow altering ownership
    delete updates.userId;

    if (updates.url && updates.type === 'youtube') {
      updates.youtubeId = extractYouTubeId(updates.url);
      if (updates.youtubeId) {
        updates.thumbnailUrl = `https://img.youtube.com/vi/${updates.youtubeId}/hqdefault.jpg`;
      }
    }

    if (updates.tags && Array.isArray(updates.tags)) {
      updates.tags = updates.tags.map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean);
    }

    if (!isDbConnected() || isMemoryStoreActive()) {
      const contents = getMemoryContents();
      const index = contents.findIndex((c) => c._id === id && c.userId === userId);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Content not found' });
      }

      contents[index] = {
        ...contents[index],
        ...updates,
        updatedAt: new Date(),
      };

      await logActivity({
        userId,
        userEmail: req.user.email,
        userName: req.user.name,
        action: 'CONTENT_UPDATE',
        details: { id, title: contents[index].title },
        ipAddress: req.ip,
      });

      return res.json({ success: true, data: contents[index] });
    }

    const updated = await Content.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    await logActivity({
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'CONTENT_UPDATE',
      details: { id: updated._id, title: updated.title },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete content item (strictly isolated to user)
 */
export const deleteContent = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const contents = getMemoryContents();
      const index = contents.findIndex((c) => c._id === id && c.userId === userId);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Content not found' });
      }

      const deleted = contents.splice(index, 1)[0];

      await logActivity({
        userId,
        userEmail: req.user.email,
        userName: req.user.name,
        action: 'CONTENT_DELETE',
        details: { id, title: deleted.title, type: deleted.type },
        ipAddress: req.ip,
      });

      return res.json({ success: true, message: 'Content deleted successfully' });
    }

    const deleted = await Content.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    await logActivity({
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      action: 'CONTENT_DELETE',
      details: { id: deleted._id, title: deleted.title, type: deleted.type },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const contents = getMemoryContents();
      const item = contents.find((c) => c._id === id && c.userId === userId);
      if (!item) return res.status(404).json({ success: false, error: 'Content not found' });

      item.isFavorite = !item.isFavorite;
      item.updatedAt = new Date();
      return res.json({ success: true, data: item });
    }

    const item = await Content.findOne({ _id: id, userId });
    if (!item) return res.status(404).json({ success: false, error: 'Content not found' });

    item.isFavorite = !item.isFavorite;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle pin status
 */
export const togglePin = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const contents = getMemoryContents();
      const item = contents.find((c) => c._id === id && c.userId === userId);
      if (!item) return res.status(404).json({ success: false, error: 'Content not found' });

      item.isPinned = !item.isPinned;
      item.updatedAt = new Date();
      return res.json({ success: true, data: item });
    }

    const item = await Content.findOne({ _id: id, userId });
    if (!item) return res.status(404).json({ success: false, error: 'Content not found' });

    item.isPinned = !item.isPinned;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all unique tags and their counts for the authenticated user
 */
export const getUserTags = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const items = getMemoryContents().filter((c) => c.userId === userId);
      const tagCount = {};
      items.forEach((item) => {
        (item.tags || []).forEach((t) => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      });

      const tags = Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      return res.json({ success: true, data: tags });
    }

    const tagAggregation = await Content.aggregate([
      { $match: { userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: tagAggregation });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user dashboard stats
 */
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    if (!isDbConnected() || isMemoryStoreActive()) {
      const items = getMemoryContents().filter((c) => c.userId === userId);
      const stats = {
        total: items.length,
        youtube: items.filter((c) => c.type === 'youtube').length,
        url: items.filter((c) => c.type === 'url').length,
        article: items.filter((c) => c.type === 'article').length,
        note: items.filter((c) => c.type === 'note').length,
        favorites: items.filter((c) => c.isFavorite).length,
        pinned: items.filter((c) => c.isPinned).length,
      };
      return res.json({ success: true, data: stats });
    }

    const items = await Content.find({ userId }).select('type isFavorite isPinned');
    const stats = {
      total: items.length,
      youtube: items.filter((c) => c.type === 'youtube').length,
      url: items.filter((c) => c.type === 'url').length,
      article: items.filter((c) => c.type === 'article').length,
      note: items.filter((c) => c.type === 'note').length,
      favorites: items.filter((c) => c.isFavorite).length,
      pinned: items.filter((c) => c.isPinned).length,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
