import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMemoryStoreActive, isDbConnected } from '../config/db.js';
import { getMemoryUsers, seedInitialMemoryData } from '../services/storeService.js';

const isAuth0Configured = () => {
  const issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const audience = process.env.AUTH0_AUDIENCE;
  return Boolean(
    issuer &&
    issuer.trim() !== '' &&
    !issuer.includes('YOUR_TENANT') &&
    audience &&
    audience.trim() !== '' &&
    !audience.includes('YOUR_AUDIENCE')
  );
};

// Official Auth0 JWT check when configured
let checkJwtMiddleware = null;

if (isAuth0Configured()) {
  try {
    checkJwtMiddleware = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
      tokenSigningAlg: 'RS256',
    });
    console.log('🔒 [Auth0] JWT Verification middleware initialized');
  } catch (err) {
    console.error('⚠️ [Auth0 Init Error]:', err.message);
  }
}

/**
 * Universal Auth Middleware
 * - Verifies Auth0 JWT when configured in server/.env
 * - Falls back gracefully in development / demo mode if credentials are not yet set
 * - Enforces user identification & sets req.user = { sub, email, name, role }
 */
export const requireAuth = async (req, res, next) => {
  try {
    // If Auth0 credentials are live
    if (isAuth0Configured() && checkJwtMiddleware) {
      return checkJwtMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(401).json({
            success: false,
            error: 'Unauthorized: Invalid or expired Auth0 token',
            details: err.message,
          });
        }

        const payload = req.auth?.payload || {};
        const sub = payload.sub;
        if (!sub) {
          return res.status(401).json({ success: false, error: 'Unauthorized: Missing token subject (sub)' });
        }

        // Attach user object to request
        await attachUserToReq(req, payload);
        return next();
      });
    }

    // Fallback mode when Auth0 credentials are not yet set
    const authHeader = req.headers.authorization;
    let decoded = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Try unverified decode for client token passed during development
      try {
        decoded = jwt.decode(token);
      } catch (e) {
        // Not a standard JWT, continue to fallback
      }
    }

    // Determine user ID
    const demoSub = req.headers['x-user-id'] || decoded?.sub || 'demo-user-123';
    const email = req.headers['x-user-email'] || decoded?.email || 'shlok@secondbrain.app';
    const name = req.headers['x-user-name'] || decoded?.name || 'shlok warulkar';
    const picture = req.headers['x-user-picture'] || decoded?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    await attachUserToReq(req, {
      sub: demoSub,
      email,
      name,
      picture,
    });

    return next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({ success: false, error: 'Authentication internal error' });
  }
};

/**
 * Helper to sync user in DB/memory and attach to req.user with role calculation
 */
async function attachUserToReq(req, payload) {
  const sub = payload.sub;
  const email = payload.email || req.headers['x-user-email'] || '';
  const name = payload.name || req.headers['x-user-name'] || 'Brain User';
  const picture = payload.picture || req.headers['x-user-picture'] || '';

  // Check admin privileges via ADMIN_EMAILS or Auth0 custom roles claim
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const customRoles =
    payload['https://secondbrain.app/roles'] ||
    payload['http://secondbrain.app/roles'] ||
    payload.roles ||
    [];

  let isAdmin = customRoles.includes('admin');
  if (email && adminEmails.includes(email.toLowerCase())) {
    isAdmin = true;
  }

  // If local memory fallback is active
  if (!isDbConnected() || isMemoryStoreActive()) {
    seedInitialMemoryData(sub);
    const memoryUsers = getMemoryUsers();
    let existingUser = memoryUsers.find((u) => u.auth0Id === sub);

    if (!existingUser) {
      existingUser = {
        _id: `mem_user_${Date.now()}`,
        auth0Id: sub,
        email,
        name,
        picture,
        role: isAdmin || sub === 'demo-user-123' ? 'admin' : 'user',
        lastLogin: new Date(),
        createdAt: new Date(),
      };
      memoryUsers.push(existingUser);
    } else {
      existingUser.lastLogin = new Date();
      if (isAdmin) existingUser.role = 'admin';
    }

    req.user = {
      sub,
      email: existingUser.email,
      name: existingUser.name,
      picture: existingUser.picture,
      role: existingUser.role,
    };
    return;
  }

  // MongoDB active
  try {
    let dbUser = await User.findOne({ auth0Id: sub });
    if (!dbUser) {
      dbUser = await User.create({
        auth0Id: sub,
        email,
        name,
        picture,
        role: isAdmin ? 'admin' : 'user',
        lastLogin: new Date(),
      });
    } else {
      dbUser.lastLogin = new Date();
      if (email && dbUser.email !== email) dbUser.email = email;
      if (name && dbUser.name !== name) dbUser.name = name;
      if (picture && dbUser.picture !== picture) dbUser.picture = picture;
      if (isAdmin && dbUser.role !== 'admin') dbUser.role = 'admin';
      await dbUser.save();
    }

    req.user = {
      sub: dbUser.auth0Id,
      email: dbUser.email,
      name: dbUser.name,
      picture: dbUser.picture,
      role: dbUser.role,
    };
  } catch (err) {
    console.error('Error syncing user:', err.message);
    req.user = {
      sub,
      email,
      name,
      picture,
      role: isAdmin ? 'admin' : 'user',
    };
  }
}
