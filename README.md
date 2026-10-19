# 🧠 Second Brain — Modern Full-Stack Knowledge Management Vault

> Second Brain allows users to capture, organize, search, and retrieve knowledge—including YouTube videos, website bookmarks, in-depth articles, and personal notes—in a unified, secure digital vault powered by Google Gemini AI.

---

## ✨ Key Features

- **🔐 Auth0 Authentication**: Secure login supporting Google, social identities, and email/password authentication.
- **🛡️ Strict User Isolation & Authorization**: Every knowledge item is strictly bound to the authenticated user's Auth0 subject identifier (`sub`). No cross-user data leakage is possible.
- **👑 Role-Based Access Control (RBAC) & Admin Console**:
  - Separate Admin Dashboard accessible only by users with the `admin` role.
  - Platform-wide telemetry: registered users, item counts, type distributions, AI calls count.
  - User management table with one-click role promotions and demotions.
  - Real-time audit trail and system activity logs.
- **🎬 Smart Content Management**:
  - **YouTube**: Automatic video ID parsing, live high-res thumbnail previews, and distraction-free responsive embedded player.
  - **Website Links**: Domain and favicon extraction with quick external launch.
  - **Articles**: Distraction-free reader view, word count, and estimated reading time.
  - **Notes & Ideas**: Markdown-enabled quick capture with copy-to-clipboard functionality.
- **🤖 Google Gemini AI Intelligence**:
  - **One-Click Summarizer**: Generates executive summaries and key takeaways using `gemini-3.8-flash`.
  - **Smart Tag Generator**: Automatically suggests relevant, contextual tags.
  - **"Ask My Brain" (RAG Semantic Retrieval)**: Ask questions in natural language and receive grounded answers synthesized directly from your personal knowledge vault, complete with clickable source citations.
- **⚡ Modern SaaS UI & UX**:
  - Dark Mode and Light Mode with persistent state and smooth transitions.
  - Command Palette (`Ctrl + K` or `Cmd + K`) for instant navigation and action triggering.
  - Multi-attribute filtering (Content Type, Tags, Favorites, Pinned) and sorting (Newest, Oldest, Title A-Z, Updated).
  - Grid view and List view toggles.
  - Skeleton loaders, custom empty states, and toast notifications.
  - Zero-setup local preview mode when credentials are not yet entered.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Axios, `@auth0/auth0-react` |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose (MongoDB ODM) |
| **Security & Auth** | Auth0 JWT verification (`express-oauth2-jwt-bearer`), Helmet, Express Rate Limit, CORS |
| **AI Engine** | Google Gemini API (`@google/generative-ai`) |
| **Deployment Ready** | Vercel (Client) + Render / Railway / Node server (Backend) |

---

## 📁 Project Architecture

```
second-brain/
├── package.json                   # Monorepo root workspace orchestration
├── .gitignore                     # Git ignore rules for secrets, builds, and node_modules
├── .env.example                   # Unified environment variable template with documentation
├── README.md                      # Comprehensive project guide
│
├── client/                        # React + Vite Frontend
│   ├── .env.example               # Client environment variable template
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx               # React entry point
│       ├── App.jsx                # App wrapper with auth gating
│       ├── index.css              # Tailwind base, utilities, and sleek scrollbar
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth0 integration with demo preview fallback
│       │   ├── ThemeContext.jsx   # Dark/light mode theme provider
│       │   └── BrainContext.jsx   # Vault state, filters, search, and modal manager
│       ├── services/
│       │   ├── api.js             # Axios client with Bearer token interceptor
│       │   ├── contentService.js  # CRUD endpoints for vault items
│       │   ├── aiService.js       # Summarize, tag suggestion, and Ask Brain API calls
│       │   └── adminService.js    # Telemetry, user management, and activity logs
│       ├── components/
│       │   ├── layout/            # Sidebar, Navbar, and CommandPalette (Ctrl+K)
│       │   ├── content/           # ContentCard, ContentGrid, ContentModal, DetailModal, FilterBar
│       │   ├── ai/                # AskBrainModal (Gemini RAG interactive assistant)
│       │   ├── admin/             # AdminStats, UsersTable, ActivityLogTable
│       │   └── common/            # Toast notifications, Skeleton loaders, Empty states, YouTubeIcon
│       └── pages/
│           ├── DashboardPage.jsx  # Main authenticated personal vault dashboard
│           ├── LandingPage.jsx    # SaaS landing & Auth0 sign-in gateway
│           └── AdminPage.jsx      # Protected RBAC administrative dashboard
│
└── server/                        # Node.js + Express Backend
    ├── .env.example               # Backend private secrets template
    ├── package.json
    └── src/
        ├── server.js              # Express app bootstrap, security middleware, and routes
        ├── config/
        │   ├── db.js              # MongoDB connection with in-memory fallback
        │   └── gemini.js          # Google Generative AI client initialization
        ├── middleware/
        │   ├── auth.js            # Auth0 JWT verification & user syncing
        │   ├── rbac.js            # requireAdmin role-based access control
        │   ├── rateLimiter.js     # API & AI rate limiting
        │   └── errorHandler.js    # Centralized JSON error response handler
        ├── models/
        │   ├── Content.js         # Mongoose schema for YouTube, URL, Article, Note
        │   ├── User.js            # Synced Auth0 users & role permissions
        │   └── ActivityLog.js     # Immutable audit log entries
        ├── controllers/
        │   ├── contentController.js # Strict user-isolated CRUD
        │   ├── aiController.js      # Gemini summary, tags, and Ask Brain RAG
        │   ├── adminController.js   # Platform metrics, user roles, audit trail
        │   └── userController.js    # Profile & session status
        ├── routes/
        │   ├── contentRoutes.js
        │   ├── aiRoutes.js
        │   ├── adminRoutes.js
        │   └── userRoutes.js
        └── services/
            ├── geminiService.js   # Gemini Flash AI generation & RAG context matching
            ├── storeService.js    # In-memory storage & seed data for local preview
            └── auditService.js    # Activity logger
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn**

### 2. Installation
Run the following from the root directory to install all root, server, and client dependencies:
```bash
npm run install:all
```

### 3. Start Development Servers
To run both the React frontend and Express backend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

> **💡 Zero-Setup Preview**: You can launch and test the application immediately! If environment variables are empty, the app runs in interactive Preview Mode with pre-populated seed data, YouTube embeds, reader view, and mock AI responses.

---

## 🔑 Environment Variables Setup

Before deploying or using real Auth0, MongoDB, and Gemini accounts, copy the `.env.example` files to `.env`:

### Frontend Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```env
# Auth0 Domain (from Auth0 Dashboard -> Applications -> Settings -> Domain)
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com

# Auth0 Client ID (from Auth0 Dashboard -> Applications -> Settings -> Client ID)
VITE_AUTH0_CLIENT_ID=your_client_id_here

# Auth0 API Audience (from Auth0 Dashboard -> Applications -> APIs -> API Identifier)
VITE_AUTH0_AUDIENCE=https://api.secondbrain.app

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or Atlas cluster)
MONGODB_URI=mongodb://localhost:27017/second-brain

# Auth0 Issuer Base URL (Must match your Auth0 Domain with https:// and trailing slash)
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com/

# Auth0 API Audience identifier (Must match VITE_AUTH0_AUDIENCE)
AUTH0_AUDIENCE=https://api.secondbrain.app

# Allowed Frontend Origin
CLIENT_ORIGIN=http://localhost:5173

# Google Gemini API Key (Obtain from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Comma-separated list of Admin emails (these users are automatically granted the admin role)
ADMIN_EMAILS=admin@example.com,youremail@domain.com
```

---

## 🔒 Step-by-Step Auth0 Setup Guide

1. Log into your [Auth0 Dashboard](https://manage.auth0.com/).
2. **Create Single Page Application (SPA)**:
   - Navigate to **Applications** > **Applications** > **Create Application**.
   - Name: `Second Brain Web App`.
   - Type: **Single Page Web Applications**.
   - Under **Allowed Callback URLs**, add: `http://localhost:5173` (and your production domain).
   - Under **Allowed Logout URLs**, add: `http://localhost:5173`.
   - Under **Allowed Web Origins**, add: `http://localhost:5173`.
   - Copy **Domain** into `VITE_AUTH0_DOMAIN` and **Client ID** into `VITE_AUTH0_CLIENT_ID`.
3. **Create API (for Backend JWT Validation)**:
   - Navigate to **Applications** > **APIs** > **Create API**.
   - Name: `Second Brain API`.
   - Identifier: `https://api.secondbrain.app` (or your chosen URI).
   - Signing Algorithm: `RS256`.
   - Copy the Identifier into `VITE_AUTH0_AUDIENCE` and `AUTH0_AUDIENCE`.
   - Set `AUTH0_ISSUER_BASE_URL=https://<your-tenant>.auth0.com/`.

---

## 🤖 Step-by-Step Google Gemini Setup Guide

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and create a new API key.
3. Paste the key into `server/.env` as `GEMINI_API_KEY=AIzaSy...`.
4. The application uses the `gemini-3.8-flash` model for high-speed summaries, tag extraction, and RAG semantic question answering.

---

## 🛡️ Security Architecture

1. **Token Verification**: Every private API request validates the Auth0 RS256 JWT signature and audience against Auth0's public JSON Web Key Set (JWKS).
2. **User Data Isolation**: Every database document has an indexed `userId` field matching the token's `sub` claim. All database queries enforce `{ userId: req.user.sub }`.
3. **No Credential Storage**: Passwords are never stored on the application backend—Auth0 handles all credential management, hashing, social logins, and multi-factor authentication.
4. **Secret Protection**: Backend secrets (`GEMINI_API_KEY`, `MONGODB_URI`, etc.) are kept strictly in `server/.env` and are never exposed to the client bundle.
5. **Rate Limiting & Security Headers**: Helmet adds secure HTTP headers; express-rate-limit prevents DDoS and AI quota abuse.

---

## 🚢 Deployment

### Frontend (e.g. Vercel)
1. Set the root directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Configure environment variables (`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `VITE_API_BASE_URL`).

### Backend (e.g. Render / Railway / DigitalOcean)
1. Set the root directory to `server`.
2. Build command: `npm install`.
3. Start command: `node src/server.js`.
4. Configure backend environment variables (`MONGODB_URI`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_AUDIENCE`, `GEMINI_API_KEY`, `CLIENT_ORIGIN`, `ADMIN_EMAILS`).

---

## 📄 License
MIT License. Built for modern knowledge workers.
