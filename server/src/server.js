import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');
import { connectDB, isDbConnected, isMemoryStoreActive } from './config/db.js';
import { isGeminiConfigured } from './config/gemini.js';
import { seedInitialMemoryData } from './services/storeService.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import contentRoutes from './routes/contentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows embedding YouTube previews
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching origins
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, can restrict in production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email', 'x-user-name', 'x-user-picture'],
  })
);

// Request parsing & logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health check & system diagnostics endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      mode: isMemoryStoreActive() ? 'In-Memory Preview' : 'MongoDB Persistent',
    },
    gemini: {
      configured: isGeminiConfigured(),
    },
    auth0: {
      configured: Boolean(process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_AUDIENCE),
    },
  });
});

// API Routes
app.use('/api/content', contentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Serve static frontend assets
app.use(express.static(clientDist));

// Wildcard SPA route
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Centralized error handling
app.use(errorHandler);

// Bootstrap server
const startServer = async () => {
  try {
    // Attempt MongoDB connection
    const dbOk = await connectDB();
    if (!dbOk) {
      seedInitialMemoryData();
    }

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 SECOND BRAIN SERVER RUNNING ON PORT ${PORT}`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('\n🛑 Gracefully shutting down Second Brain server...');
      server.close(() => {
        console.log('🏁 Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Fatal server boot error:', error);
    process.exit(1);
  }
};

startServer();
