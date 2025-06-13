import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Passport } from '@imtbl/sdk/passport';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email list - in production, this would be stored securely in your backend
const ADMIN_EMAILS = [
  'admin@illuvium.io',
  'tournament@illuvium.io',
  'moderator@illuvium.io',
  'payfairvip@gmail.com',
  'richard.reyes@illuvium.io'
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passportInstance, setPassportInstance] = useState<any>(null);

  // Initialize Passport
  useEffect(() => {
    const initPassport = async () => {
      try {
        // Get environment from env vars, default to sandbox
        const environment = import.meta.env.VITE_ENVIRONMENT === 'production' 
          ? 'production'
          : 'sandbox';

        // Initialize Passport with configurable environment
        const passportConfig = {
          baseConfig: {
            environment,
            publishableKey: import.meta.env.VITE_PUBLISHABLE_KEY || 'pk_imapik-RqdtsHMXYynIbGe$2sL0',
          },
          clientId: import.meta.env.VITE_CLIENT_ID || '4GnLLWvnWPXIs17rD1eSxvjsSnMVAiUS',
          redirectUri: `${window.location.origin}/redirect`,
          logoutRedirectUri: window.location.origin,
          audience: 'platform_api',
          scope: 'openid offline_access email transact'
        };

        console.log('Initializing Passport with config:', {
          environment: passportConfig.baseConfig.environment,
          clientId: passportConfig.clientId,
          publishableKey: passportConfig.baseConfig.publishableKey?.substring(0, 20) + '...'
        });

        const passportClient = new Passport(passportConfig);
        setPassportInstance(passportClient);

        // Check if user is already logged in
        try {
          const accessToken = await passportClient.getAccessToken();
          if (accessToken) {
            const userInfo = await passportClient.getUserInfo();
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
    const playerId = userInfo.sub || ''; // This is the player ID from IMX Passport
    const walletAddress = userInfo.wallet_address || userInfo.sub || '';
    
    console.log('Creating user from IMX Passport User Info:', {
      sub: userInfo.sub,
      email: userInfo.email,
      nickname: userInfo.nickname,
      wallet_address: userInfo.wallet_address,
      preferred_username: userInfo.preferred_username
    });
    
    return {
      id: userInfo.sub,
      email,
      walletAddress,
      playerId, // This is the key field for tournament rewards distribution
      nickname: userInfo.nickname || userInfo.preferred_username || email.split('@')[0] || 'User',
      isAdmin: checkAdminStatus(email),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
  };

  const checkAdminStatus = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!passportInstance) {
        throw new Error('IMX Passport not initialized. Please refresh the page and try again.');
      }

      console.log('Initiating IMX Passport login...');
      
      // Check if popups are likely to be blocked
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
        testPopup?.close();
        throw new Error('POPUP_BLOCKED');
      }
      testPopup.close();
      
      // Real IMX Passport login - this will redirect to Passport
      // Note: This performs a full page redirect, so no code after this will execute
      await passportInstance.login();
      
      // The code below will never execute because login() redirects the page
      // User authentication will be handled by the useEffect hook after redirect
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsLoading(false);
      
      // Handle specific error cases
      if (error.message === 'POPUP_BLOCKED') {
        throw new Error('Popup blocked by browser. Please allow popups for this site and try again.');
      } else if (error.message && error.message.includes('disposed window')) {
        throw new Error('Authentication window was closed. Please allow popups and try again.');
      } else if (error.message && error.message.includes('navigate')) {
        throw new Error('Browser blocked the authentication process. Please check your popup blocker settings.');
      } else {
        throw new Error('Failed to connect with IMX Passport. Please check your browser settings and try again.');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (passportInstance) {
        console.log('Logging out from IMX Passport...');
        await passportInstance.logout();
      }
      
      // Clear local state
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};