import { Content } from '../models/Content.js';
import { User } from '../models/User.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { isMemoryStoreActive } from '../config/db.js';

// In-memory collections for zero-setup local preview
const memoryContents = [];
const memoryUsers = [];
const memoryLogs = [];

// Seed high quality initial demo data into memory if empty
export const seedInitialMemoryData = (defaultUserId = 'demo-user-123') => {
  if (memoryContents.length > 0) return;

  const sampleItems = [
    {
      _id: 'mem_1',
      userId: defaultUserId,
      type: 'youtube',
      title: 'Building a Second Brain in 2026: The Ultimate System',
      url: 'https://www.youtube.com/watch?v=K-ssUVy9E9M',
      youtubeId: 'K-ssUVy9E9M',
      thumbnailUrl: 'https://img.youtube.com/vi/K-ssUVy9E9M/hqdefault.jpg',
      favicon: 'https://www.youtube.com/s/desktop/f7579299/img/favicon.ico',
      domain: 'youtube.com',
      description: 'Comprehensive guide to modern personal knowledge management using CODE (Capture, Organize, Distill, Express).',
      content: 'Key concepts discussed:\n- The four pillars of personal knowledge management: Capture, Organize, Distill, Express\n- Why storing ideas outside your biological memory reduces cognitive load\n- Progressive Summarization technique for long-term retention',
      summary: 'A deep-dive video explaining the CODE framework for managing digital information. Highlights how externalizing cognitive memory boosts creative output and eliminates information overload.',
      tags: ['productivity', 'knowledge-management', 'second-brain', 'pkm'],
      isFavorite: true,
      isPinned: true,
      readingTimeMinutes: 12,
      createdAt: new Date(Date.now() - 3600000 * 24 * 2),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    },
    {
      _id: 'mem_2',
      userId: defaultUserId,
      type: 'article',
      title: 'How to Build Semantic Search & Retrieval Augmented Generation (RAG)',
      url: 'https://example.com/semantic-search-rag',
      thumbnailUrl: '',
      favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=128',
      domain: 'example.com',
      description: 'Architecture breakdown of modern vector databases, chunking strategies, and LLM context injection.',
      content: `# Semantic Search and RAG Fundamentals

Retrieval-Augmented Generation (RAG) grounds Large Language Model responses in verified external facts. 

## Key Steps
1. **Document Ingestion**: Parsing text from PDFs, HTML, or notes.
2. **Chunking**: Dividing documents into semantic paragraphs of 250-500 tokens.
3. **Embeddings**: Converting chunks into dense vector representations.
4. **Vector Retrieval**: Performing cosine similarity search on the query.
5. **Prompt Augmentation**: Formatting retrieved context into system instructions.

By combining personal notes with generative models like Gemini, users get an accurate, hallucination-free knowledge vault.`,
      summary: 'Detailed architectural overview of RAG systems. Explains document chunking, vector embeddings, similarity search, and prompt grounding to build hallucination-resistant AI systems.',
      tags: ['ai', 'rag', 'architecture', 'engineering'],
      isFavorite: true,
      isPinned: false,
      readingTimeMinutes: 6,
      createdAt: new Date(Date.now() - 3600000 * 18),
      updatedAt: new Date(Date.now() - 3600000 * 18),
    },
    {
      _id: 'mem_3',
      userId: defaultUserId,
      type: 'url',
      title: 'Vite: Next Generation Frontend Tooling',
      url: 'https://vite.dev',
      thumbnailUrl: '',
      favicon: 'https://vite.dev/logo.svg',
      domain: 'vite.dev',
      description: 'Lightning-fast modern frontend build tool powered by native ES modules and Rollup/esbuild.',
      content: 'Vite provides instant server start, lightning-fast Hot Module Replacement (HMR), and rich features for React, Vue, and vanilla web applications.',
      summary: 'Official portal for Vite. Highlights modern dev server architecture using native browser ES modules, out-of-the-box TypeScript and JSX support, and high performance bundler.',
      tags: ['react', 'vite', 'javascript', 'tools'],
      isFavorite: false,
      isPinned: false,
      readingTimeMinutes: 3,
      createdAt: new Date(Date.now() - 3600000 * 8),
      updatedAt: new Date(Date.now() - 3600000 * 8),
    },
    {
      _id: 'mem_4',
      userId: defaultUserId,
      type: 'note',
      title: 'Startup Roadmap: Q4 Deliverables & Ideas',
      url: '',
      thumbnailUrl: '',
      favicon: '',
      domain: '',
      description: 'Internal brain-dump on core milestones, user feedback loops, and deployment checklist.',
      content: `## Q4 Strategic Goals
- Launch Second Brain MVP with Google Auth0 social login
- Implement Gemini Flash AI summarizer for articles and YouTube videos
- Add "Ask My Brain" interactive context QA
- Establish comprehensive role-based access control for administrative oversight

### Action Items
- [x] Configure Tailwind CSS with dark/light themes
- [x] Integrate Mongoose models with proper user-isolation indexes
- [ ] Connect production Auth0 tenant credentials
- [ ] Deploy frontend to Vercel and backend to Railway/Render`,
      summary: 'Actionable startup roadmap detailing key feature deliveries, authentication milestones, and hosting plans for Q4.',
      tags: ['startup', 'planning', 'roadmap', 'notes'],
      isFavorite: false,
      isPinned: true,
      readingTimeMinutes: 4,
      createdAt: new Date(Date.now() - 3600000 * 3),
      updatedAt: new Date(Date.now() - 3600000 * 3),
    },
  ];

  memoryContents.push(...sampleItems);

  // Seed default admin user
  if (memoryUsers.length === 0) {
    memoryUsers.push({
      _id: 'mem_user_1',
      auth0Id: defaultUserId,
      email: 'shlok@secondbrain.app',
      name: 'shlok warulkar',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
      lastLogin: new Date(),
      createdAt: new Date(Date.now() - 3600000 * 48),
    });

    memoryUsers.push({
      _id: 'mem_user_2',
      auth0Id: 'user_regular_456',
      email: 'sara.chen@techcorp.io',
      name: 'Sara Chen',
      picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'user',
      lastLogin: new Date(Date.now() - 3600000 * 12),
      createdAt: new Date(Date.now() - 3600000 * 72),
    });
  }

  // Seed initial activity logs
  if (memoryLogs.length === 0) {
    memoryLogs.push(
      {
        _id: 'mem_log_1',
        userId: defaultUserId,
        userEmail: 'shlok@secondbrain.app',
        userName: 'shlok warulkar',
        action: 'CONTENT_CREATE',
        details: { title: 'Building a Second Brain in 2026', type: 'youtube' },
        createdAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        _id: 'mem_log_2',
        userId: defaultUserId,
        userEmail: 'shlok@secondbrain.app',
        userName: 'shlok warulkar',
        action: 'AI_SUMMARIZE',
        details: { type: 'article', title: 'Semantic Search & RAG' },
        createdAt: new Date(Date.now() - 3600000 * 17),
      },
      {
        _id: 'mem_log_3',
        userId: 'user_regular_456',
        userEmail: 'sara.chen@techcorp.io',
        userName: 'Sara Chen',
        action: 'USER_LOGIN',
        details: { method: 'google-oauth2' },
        createdAt: new Date(Date.now() - 3600000 * 12),
      }
    );
  }
};

// Export accessors
export const getMemoryContents = () => memoryContents;
export const getMemoryUsers = () => memoryUsers;
export const getMemoryLogs = () => memoryLogs;
