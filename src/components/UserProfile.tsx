import React, { useState } from 'react';
import { User, LogOut, Settings, Shield, Wallet, Mail, Calendar, Crown, Hash, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, isLoading } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Prefer nickname, fallback to email prefix
  const displayName = user.nickname || user.email.split('@')[0] || 'User';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Profile</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">{displayName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm">ID: {user.playerId}</span>
                {user.isAdmin && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">ADMIN</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Account Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-400 text-sm">Player ID</div>
                  <div className="text-white font-mono flex items-center gap-2">
                    {user.playerId}
                    <button onClick={() => handleCopy(user.playerId, 'playerId')} title="Copy Player ID">
                      <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
                    </button>
                    {copiedField === 'playerId' && <span className="text-green-400 text-xs ml-1">Copied!</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-400 text-sm">Email</div>
                  <div className="text-white">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Wallet className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-400 text-sm">Wallet Address</div>
                  <div className="text-white font-mono text-sm flex items-center gap-2">
                    {user.walletAddress ? truncateAddress(user.walletAddress) : 'No wallet connected'}
                    {user.walletAddress && (
                      <button onClick={() => handleCopy(user.walletAddress, 'walletAddress')} title="Copy Wallet Address">
                        <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
                      </button>
                    )}
                    {copiedField === 'walletAddress' && <span className="text-green-400 text-xs ml-1">Copied!</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-400 text-sm">Member Since</div>
                  <div className="text-white">{formatDate(user.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-gray-400 text-sm">Last Login</div>
                  <div className="text-white">{formatDate(user.lastLogin)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Status */}
          {user.isAdmin && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Administrator Access</span>
              </div>
              <div className="text-gray-300 text-sm">
                You have administrative privileges including tournament management and community moderation.
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">Secured by IMX Passport</span>
            </div>
            <div className="text-gray-300 text-sm">
              Your account is protected by Immutable X's enterprise-grade security. Your private keys never leave your device.
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-sm w-full mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Confirm Sign Out</h3>
              <p className="text-gray-300 text-sm mb-6">
                Are you sure you want to sign out? You'll need to reconnect with IMX Passport to access your account again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;