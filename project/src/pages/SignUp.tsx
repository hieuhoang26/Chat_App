import { useState } from 'react';
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

export default function SignUp({ onSwitchToLogin }: SignUpProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-chat-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-chat-sidebar rounded-2xl shadow-chat p-8 border border-chat-divider text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-accent-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Account Created!</h2>
            <p className="text-text-secondary mb-6">
              You can now sign in with your credentials.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chat-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-chat-sidebar rounded-2xl shadow-chat p-8 border border-chat-divider">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">C</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Sign up to start chatting</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-chat-input text-text-primary placeholder-text-secondary pl-11 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-chat-input text-text-primary placeholder-text-secondary pl-11 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="w-full bg-chat-input text-text-primary placeholder-text-secondary pl-11 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-chat-input text-text-primary placeholder-text-secondary pl-11 pr-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
