import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

const isAuth0Configured = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  return Boolean(domain && clientId && domain.trim() !== '' && clientId.trim() !== '' && !domain.includes('YOUR_DOMAIN'));
};

// Internal wrapper to hook into Auth0 when configured
const Auth0InnerWrapper = ({ children }) => {
  const auth0 = useAuth0();
  const [syncedRole, setSyncedRole] = useState('user');

  // Check roles from token or claims
  useEffect(() => {
    if (auth0.user) {
      const roles =
        auth0.user['https://secondbrain.app/roles'] ||
        auth0.user['http://secondbrain.app/roles'] ||
        auth0.user.roles ||
        [];
      if (roles.includes('admin')) {
        setSyncedRole('admin');
      }
    }
  }, [auth0.user]);

  const value = {
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user: auth0.user
      ? {
          sub: auth0.user.sub,
          name: auth0.user.name || auth0.user.nickname,
          email: auth0.user.email,
          picture: auth0.user.picture,
          role: syncedRole,
        }
      : null,
    loginWithRedirect: auth0.loginWithRedirect,
    logout: () => auth0.logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessTokenSilently: auth0.getAccessTokenSilently,
    isDemoMode: false,
    hasAuth0Credentials: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Standalone fallback provider when Auth0 env variables are not yet provided
const DemoAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('second_brain_demo_auth') !== 'false';
  });

  const [currentUser, setCurrentUser] = useState({
    sub: 'demo-user-123',
    name: 'shlok warulkar',
    email: 'shlok@secondbrain.app',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'admin',
  });

  const loginWithRedirect = () => {
    setIsAuthenticated(true);
    localStorage.setItem('second_brain_demo_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('second_brain_demo_auth', 'false');
  };

  const switchDemoRole = (role) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const getAccessTokenSilently = async () => 'demo_dev_token';

  const value = {
    isAuthenticated,
    isLoading: false,
    user: isAuthenticated ? currentUser : null,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isDemoMode: true,
    hasAuth0Credentials: false,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Top-level provider exporter
export const AppAuthProvider = ({ children }) => {
  const configured = isAuth0Configured();

  if (configured) {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          ...(audience ? { audience } : {}),
        }}
      >
        <Auth0InnerWrapper>{children}</Auth0InnerWrapper>
      </Auth0Provider>
    );
  }

  return <DemoAuthProvider>{children}</DemoAuthProvider>;
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppAuth must be used within AppAuthProvider');
  return context;
};
