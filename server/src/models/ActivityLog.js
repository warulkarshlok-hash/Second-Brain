import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CONTENT_CREATE',
        'CONTENT_UPDATE',
        'CONTENT_DELETE',
        'CONTENT_FAVORITE',
        'AI_SUMMARIZE',
        'AI_TAGS',
        'AI_ASK_BRAIN',
        'USER_LOGIN',
        'ADMIN_ROLE_CHANGE',
      ],
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
