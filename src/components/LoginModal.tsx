import React, { useState } from 'react';
import { X, Shield, Wallet, Lock, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPopupHelp, setShowPopupHelp] = useState(false);

  const handleLogin = async () => {
    try {
      setError(null);
      setShowPopupHelp(false);
      await login();
      // Note: For IMX Passport, this will redirect to Passport login page
      // The modal will be closed when the user returns and authentication succeeds
    } catch (err: any) {
      // Handle popup blocking more gracefully
      let errorMessage = 'Failed to connect with IMX Passport. Please try again.';
      let isPopupError = false;
      
      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.toString && typeof err.toString === 'function') {
          errorMessage = err.toString();
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check for popup-related errors
      isPopupError = errorMessage.toLowerCase().includes('popup') || 
                    errorMessage.toLowerCase().includes('blocked') ||
                    errorMessage.toLowerCase().includes('window') ||
                    errorMessage.includes('Popup blocked by browser');
      
      if (isPopupError) {
        errorMessage = 'Popup blocked by browser. Please allow popups for this site and try again.';
        setShowPopupHelp(true);
      }
      
      setError(errorMessage);
      console.warn('Login error:', err);
      
      // Don't re-throw the error - handle it gracefully
      return;
    }
  };

  const handleEnablePopups = () => {
    // Instructions for enabling popups
    const instructions = `To enable popups for this site:

Chrome/Edge:
1. Click the popup blocked icon in the address bar
2. Select "Always allow popups from ${window.location.origin}"
3. Try logging in again

Firefox:
1. Click the shield icon in the address bar
2. Turn off "Enhanced Tracking Protection" for this site
3. Try logging in again

Safari:
1. Go to Safari > Preferences > Websites > Pop-up Windows
2. Set this site to "Allow"
3. Try logging in again`;

    alert(instructions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with enhanced logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-400/10 backdrop-blur-sm border border-purple-500/20">
            <img 
              src="/Illuvilyticslogo.png" 
              alt="Illuvilytics" 
              className="w-16 h-16 object-contain filter drop-shadow-lg rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-400/30 rounded-2xl blur-lg opacity-50" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Connect with IMX Passport</h2>
          <p className="text-gray-400">
            Secure Web3 authentication for tournament participation
          </p>
        </div>

        {/* Tournament Access Notice */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-purple-400 font-medium text-sm mb-1">Tournament Access Required</div>
              <div className="text-gray-300 text-xs">
                Connect your wallet to create tournaments and participate in competitions. Your player ID will be used for reward distribution.
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Create and manage tournaments</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Participate in competitions</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Receive rewards to your wallet</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-gray-300">Secure player ID for tracking</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-red-400 text-sm block">{error}</span>
                {showPopupHelp && (
                  <button
                    onClick={handleEnablePopups}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-xs underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    How to enable popups
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Popup Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-yellow-400 font-medium text-sm mb-1">Popup Required</div>
              <div className="text-gray-300 text-xs">
                IMX Passport will open a secure popup window for authentication. Please allow popups for this site.
              </div>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Connect with IMX Passport
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-blue-400 font-medium text-sm mb-1">Mainnet Security</div>
              <div className="text-gray-300 text-xs">
                Connected to Immutable X mainnet. Your wallet and assets are protected by enterprise-grade security.
                We never store your private keys.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;