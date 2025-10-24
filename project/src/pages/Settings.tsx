import { useState, useEffect } from 'react';
import { ArrowLeft, User as UserIcon, Mail, AlertCircle, CheckCircle, LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserAvatar from '../components/UserAvatar';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { user, signOut, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata) {
      setFullName(user.user_metadata.full_name || '');
      setAvatarUrl(user.user_metadata.avatar_url || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { error } = await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const userForAvatar = {
    name: fullName || user?.email || 'User',
    avatar: avatarUrl,
    status: 'online' as const,
  };

  return (
    <div className="fixed inset-0 bg-chat-bg z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <header className="bg-chat-sidebar border-b border-chat-divider px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-chat-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        </header>

        <div className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-6">
          <div className="bg-chat-sidebar rounded-2xl shadow-chat border border-chat-divider overflow-hidden">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-8 text-center">
              <div className="inline-block mb-3">
                <UserAvatar user={userForAvatar} size="xl" showStatus />
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {fullName || 'User'}
              </h2>
              <p className="text-primary-100 text-sm">{user?.email}</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-accent-500/10 border border-accent-500/20 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-accent-400">Profile updated successfully!</p>
                  </div>
                  <button onClick={() => setSuccess(false)} className="text-accent-400 hover:text-accent-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-chat-input text-text-secondary pl-11 pr-4 py-3 rounded-lg text-base cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-text-muted">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-chat-input text-text-primary placeholder-text-secondary pl-11 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-text-primary mb-2">
                    Avatar URL
                  </label>
                  <input
                    id="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-chat-input text-text-primary placeholder-text-secondary px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {loading ? 'Saving changes...' : 'Save Changes'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-chat-divider">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-chat-sidebar rounded-xl shadow-chat border border-chat-divider p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Account Created</span>
                <span className="text-text-primary">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">User ID</span>
                <span className="text-text-primary font-mono text-xs">{user?.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
