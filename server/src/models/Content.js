import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['youtube', 'url', 'article', 'note'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    youtubeId: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    readingTimeMinutes: {
      type: Number,
      default: 1,
    },
    aiGenerated: {
      summary: { type: Boolean, default: false },
      tags: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high performance filtered queries per user
contentSchema.index({ userId: 1, type: 1 });
contentSchema.index({ userId: 1, isFavorite: 1 });
contentSchema.index({ userId: 1, isPinned: 1 });
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ userId: 1, tags: 1 });

export const Content = mongoose.model('Content', contentSchema);
