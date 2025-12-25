import { useState, useEffect } from 'react';
import { StudioBuilder } from './components/StudioBuilder';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home, Info, Mail, LayoutDashboard, Shield, Lock, Menu, X } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';
import { supabase } from '../utils/supabaseClient';
import { AdminDashboard } from './components/admin/AdminDashboard';

type View = 'home' | 'about' | 'contact' | 'admin-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAdminLoggedIn(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBackToHome = () => {
    setCurrentView('home');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
    setCurrentView('home');
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Navigation Header - Only show on non-admin pages */}
        {currentView !== 'admin-dashboard' && (
          <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <button
                    onClick={() => navigateTo('home')}
                    className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
                  >
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg shadow-lg shadow-purple-500/20">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Studio Builder</span>
                  </button>

                  {/* Desktop Navigation Items */}
                  <div className="hidden md:flex items-center gap-4 lg:gap-6">
                    <button
                      onClick={() => navigateTo('home')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'home'
                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                        }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>

                    <button
                      onClick={() => navigateTo('about')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'about'
                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                        }`}
                    >
                      <Info className="w-4 h-4" />
                      <span>About</span>
                    </button>

                    <button
                      onClick={() => navigateTo('contact')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === 'contact'
                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                        }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact</span>
                    </button>

                    {/* Admin Dashboard Button */}
                    <button
                      onClick={() => navigateTo('admin-dashboard')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  </div>

                  {/* Mobile Menu Button - Absolute Positioned */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden z-50">
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/50 backdrop-blur-sm shadow-lg"
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-lg text-white">Menu</span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Items */}
                  <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <button
                      onClick={() => navigateTo('home')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'home'
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Home</span>
                    </button>

                    <button
                      onClick={() => navigateTo('about')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'about'
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                      <Info className="w-5 h-5" />
                      <span className="font-medium">About</span>
                    </button>

                    <button
                      onClick={() => navigateTo('contact')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'contact'
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Contact</span>
                    </button>

                    <div className="my-4 border-t border-slate-800/50" />

                    <button
                      onClick={() => navigateTo('admin-dashboard')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-purple-300 hover:text-white hover:bg-slate-700/50 transition-all font-medium"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </button>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 text-center">
                      © 2024 Studio Builder
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content */}
        <div className={currentView !== 'admin-dashboard' ? 'pt-16' : ''}>
          {currentView === 'home' && <StudioBuilder />}

          {currentView === 'about' && (
            <div className="min-h-screen flex items-center justify-center px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  About Studio Builder
                </h1>
                <p className="text-xl text-slate-300 mb-8">
                  Studio Builder is your comprehensive solution for building a professional music production setup.
                  We help you select the perfect combination of software, plugins, and storage to match your creative needs and budget.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="text-4xl mb-4">🎵</div>
                    <h3 className="text-white font-semibold mb-2">Curated Selection</h3>
                    <p className="text-slate-400 text-sm">Hand-picked tools for music producers at every level</p>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="text-4xl mb-4">💾</div>
                    <h3 className="text-white font-semibold mb-2">Storage Calculator</h3>
                    <p className="text-slate-400 text-sm">Automatically calculates your storage needs</p>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="text-4xl mb-4">🚚</div>
                    <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
                    <p className="text-slate-400 text-sm">Ships to Tanzania and neighboring countries</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'contact' && (
            <div className="min-h-screen flex items-center justify-center px-4">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
                  Get In Touch
                </h1>
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                      <textarea
                        rows={5}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      />
                    </div>
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/50 font-medium">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'admin-dashboard' && (
            isAdminLoggedIn ? (
              <AdminDashboard onBackToHome={handleLogout} />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
            )
          )}
        </div>
      </div>
    </LanguageProvider>
  );
}

// Inline Admin Login Component
function AdminLogin({ onLoginSuccess }: { onLoginSuccess: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('pass@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(true);
  const [initMessage, setInitMessage] = useState('');

  // Auto-initialize admin user on component mount
  useEffect(() => {
    handleInitAdmin();
  }, []);

  // Initialize default admin user
  const handleInitAdmin = async () => {
    setInitMessage('Initializing admin account...');
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/auth/init-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setInitMessage('✅ Admin account created! You can now sign in.');
        setShowDefaultCredentials(true);
      } else if (data.message?.includes('already exists')) {
        setInitMessage('✅ Admin account ready. Use the credentials below to sign in.');
        setShowDefaultCredentials(true);
      } else {
        setInitMessage('');
      }
    } catch (err) {
      console.error('Init admin error:', err);
      // setInitMessage('⚠️ Could not initialize admin. Please try signing in anyway.');
      // Suppress network errors from auto-init to avoid alarming user if they are just loading the page
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        setError('Failed to create session');
        setIsLoading(false);
        return;
      }

      // Verify admin role
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        setError('Unauthorized - Admin access required');
        setIsLoading(false);
        return;
      }

      onLoginSuccess(data.session.access_token, data.user);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-xl shadow-purple-500/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Sign in to manage your studio builder</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {initMessage && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 text-center">
                {initMessage}
              </p>
            </div>
          )}

          {showDefaultCredentials && (
            <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-xs text-cyan-300 font-semibold mb-2 text-center">Default Credentials:</p>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="text-slate-400">Email:</span> admin@gmail.com</p>
                <p><span className="text-slate-400">Password:</span> pass@123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}