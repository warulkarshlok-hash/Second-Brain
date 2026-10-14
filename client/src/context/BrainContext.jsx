import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contentService } from '../services/contentService.js';
import { useAppAuth } from './AuthContext.jsx';
import { setAuthTokenGetter } from '../services/api.js';

const BrainContext = createContext();

export const BrainProvider = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAppAuth();

  // Content state
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [activeType, setActiveType] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('second_brain_view_mode') || 'grid');

  // Aggregated metadata
  const [userTags, setUserTags] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    youtube: 0,
    url: 0,
    article: 0,
    note: 0,
    favorites: 0,
    pinned: 0,
  });

  // Modals & Panels state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState('note');
  const [editingItem, setEditingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);
  const [isAskBrainOpen, setIsAskBrainOpen] = useState(false);
  const [askBrainInitialQuery, setAskBrainInitialQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Active view: 'vault' | 'admin'
  const [activeView, setActiveView] = useState('vault');

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync token getter with Axios client
  useEffect(() => {
    setAuthTokenGetter(getAccessTokenSilently, () => user);
  }, [getAccessTokenSilently, user]);

  // Persist viewMode
  const changeViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('second_brain_view_mode', mode);
  };

  // Fetch items based on active filters
  const fetchContents = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        type: activeType,
        sortBy,
      };
      if (selectedTag) params.tag = selectedTag;
      if (onlyFavorites) params.isFavorite = 'true';
      if (onlyPinned) params.isPinned = 'true';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await contentService.getContents(params);
      setContents(response.data || []);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeType, selectedTag, onlyFavorites, onlyPinned, searchQuery, sortBy, addToast]);

  // Fetch tags and stats
  const fetchMetadata = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [tagsRes, statsRes] = await Promise.all([
        contentService.getUserTags(),
        contentService.getUserStats(),
      ]);
      setUserTags(tagsRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContents();
      fetchMetadata();
    }
  }, [isAuthenticated, fetchContents, fetchMetadata]);

  // Add Item
  const createItem = async (data) => {
    try {
      const res = await contentService.createContent(data);
      addToast(`"${res.data.title}" saved to Second Brain`, 'success');
      await Promise.all([fetchContents(), fetchMetadata()]);
      setIsAddModalOpen(false);
      return res.data;
    } catch (err) {
      addToast(`Failed to save: ${err.message}`, 'error');
      throw err;
    }
  };

  // Update Item
  const updateItem = async (id, data) => {
    try {
      const res = await contentService.updateContent(id, data);
      addToast('Changes saved successfully', 'success');
      await Promise.all([fetchContents(), fetchMetadata()]);
      if (detailItem?._id === id) {
        setDetailItem(res.data);
      }
      setEditingItem(null);
      return res.data;
    } catch (err) {
      addToast(`Update failed: ${err.message}`, 'error');
      throw err;
    }
  };

  // Delete Item
  const deleteItem = async (id) => {
    try {
      await contentService.deleteContent(id);
      addToast('Item removed from vault', 'success');
      if (detailItem?._id === id) setDetailItem(null);
      setDeleteTargetItem(null);
      await Promise.all([fetchContents(), fetchMetadata()]);
    } catch (err) {
      addToast(`Delete failed: ${err.message}`, 'error');
      throw err;
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (id) => {
    try {
      const res = await contentService.toggleFavorite(id);
      setContents((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isFavorite: res.data.isFavorite } : item))
      );
      if (detailItem?._id === id) {
        setDetailItem((prev) => ({ ...prev, isFavorite: res.data.isFavorite }));
      }
      fetchMetadata();
    } catch (err) {
      addToast(`Failed to update favorite: ${err.message}`, 'error');
    }
  };

  // Toggle Pin
  const togglePin = async (id) => {
    try {
      const res = await contentService.togglePin(id);
      setContents((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isPinned: res.data.isPinned } : item))
      );
      if (detailItem?._id === id) {
        setDetailItem((prev) => ({ ...prev, isPinned: res.data.isPinned }));
      }
      fetchContents();
    } catch (err) {
      addToast(`Failed to update pin: ${err.message}`, 'error');
    }
  };

  // Modal Openers
  const openAddModal = (type = 'note') => {
    setAddModalInitialType(type);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
  };

  const openDetailModal = (item) => {
    setDetailItem(item);
  };

  const openAskBrain = (query = '') => {
    setAskBrainInitialQuery(query);
    setIsAskBrainOpen(true);
  };

  const toggleCommandPalette = () => {
    setIsCommandPaletteOpen((prev) => !prev);
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    contents,
    isLoading,
    error,
    activeType,
    setActiveType,
    selectedTag,
    setSelectedTag,
    onlyFavorites,
    setOnlyFavorites,
    onlyPinned,
    setOnlyPinned,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    changeViewMode,
    userTags,
    stats,
    activeView,
    setActiveView,
    toasts,
    addToast,
    removeToast,
    createItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    togglePin,
    fetchContents,
    fetchMetadata,
    // Modals
    isAddModalOpen,
    setIsAddModalOpen,
    addModalInitialType,
    openAddModal,
    editingItem,
    setEditingItem,
    openEditModal,
    detailItem,
    setDetailItem,
    openDetailModal,
    deleteTargetItem,
    setDeleteTargetItem,
    isAskBrainOpen,
    setIsAskBrainOpen,
    askBrainInitialQuery,
    openAskBrain,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    toggleCommandPalette,
  };

  return <BrainContext.Provider value={value}>{children}</BrainContext.Provider>;
};

export const useBrain = () => {
  const context = useContext(BrainContext);
  if (!context) throw new Error('useBrain must be used within a BrainProvider');
  return context;
};
