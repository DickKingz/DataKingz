import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Passport } from '@imtbl/sdk/passport';
import { AuthContextType, User } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../data/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email list - in production, this would be stored securely in your backend
const ADMIN_EMAILS = [
  'admin@illuvium.io',
  'tournament@illuvium.io',
  'moderator@illuvium.io',
  'payfairvip@gmail.com',
  'richard.reyes@illuvium.io'
];

// Test mode configuration
const TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';
const TEST_ADMIN_EMAIL = 'test.admin@illuvium.io';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passportClient, setPassportClient] = useState<Passport | null>(null);

  // Fetch adminLevel from Firestore users collection
  const fetchAdminLevel = async (uid: string, email: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().adminLevel || undefined;
    } else {
      // Auto-create user doc if not exists
      await setDoc(userRef, { email, adminLevel: null });
      return undefined;
    }
  };

  useEffect(() => {
    const initPassport = async () => {
      try {
        if (TEST_MODE) {
          // Create test admin user
          const testUser: User = {
            id: 'test-admin-id',
            email: TEST_ADMIN_EMAIL,
            walletAddress: '0xTestWalletAddress',
            playerId: 'test-player-id',
            nickname: 'Test Admin',
            isAdmin: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            adminLevel: 'master',
          };
          setUser(testUser);
          setIsLoading(false);
          return;
        }

        // Initialize Passport client
        const passport = new Passport({
          baseConfig: {
            environment: import.meta.env.VITE_ENVIRONMENT === 'production' ? 'production' : 'sandbox',
            publishableKey: import.meta.env.VITE_PUBLISHABLE_KEY || '',
          },
          clientId: import.meta.env.VITE_PASSPORT_CLIENT_ID || '',
          redirectUri: window.location.origin + '/redirect',
          scope: 'openid offline_access email profile',
          logoutRedirectUri: window.location.origin + '/logout',
        });

        setPassportClient(passport);

        // Check if user is already logged in
        try {
          const accessToken = await passport.getAccessToken();
          if (accessToken) {
            const userInfo = await passport.getUserInfo();
            if (userInfo) {
              const userData = await createUserFromPassport(userInfo);
              setUser(userData);
              console.log('User already authenticated:', userData);
            }
          }
        } catch (error) {
          // User not logged in, which is fine
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Failed to initialize Passport:', error);
        // For demo purposes, we'll continue without Passport
        console.log('Running in demo mode without IMX Passport');
      } finally {
        setIsLoading(false);
      }
    };

    initPassport();
  }, []);

  const createUserFromPassport = async (userInfo: any): Promise<User> => {
    const email = userInfo.email || '';
    const playerId = userInfo.sub || '';
    const walletAddress = userInfo.wallet_address || userInfo.sub || '';
    const uid = userInfo.sub || '';
    const adminLevel = await fetchAdminLevel(uid, email);
    return {
      id: uid,
      email,
      walletAddress,
      playerId,
      nickname: userInfo.nickname || userInfo.preferred_username || email.split('@')[0] || 'User',
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      adminLevel,
    };
  };

  const checkAdminStatus = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase()) || (TEST_MODE && email === TEST_ADMIN_EMAIL);
  };

  const login = async () => {
    if (TEST_MODE) {
      // Simulate test admin login
      const testUser: User = {
        id: 'test-admin-id',
        email: TEST_ADMIN_EMAIL,
        walletAddress: '0xTestWalletAddress',
        playerId: 'test-player-id',
        nickname: 'Test Admin',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        adminLevel: 'master',
      };
      setUser(testUser);
      return;
    }

    if (!passportClient) {
      throw new Error('Passport client not initialized');
    }

    try {
      await passportClient.login();
      const userInfo = await passportClient.getUserInfo();
      if (userInfo) {
        const userData = await createUserFromPassport(userInfo);
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (TEST_MODE) {
      setUser(null);
      return;
    }

    if (!passportClient) {
      throw new Error('Passport client not initialized');
    }

    try {
      await passportClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAdminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};