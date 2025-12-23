import { useState, useEffect } from 'react';
import { StudioBuilder } from './components/StudioBuilder';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home, Info, Mail, LayoutDashboard, LogOut, Package, FolderTree, ShoppingCart, BarChart3 } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';

type View = 'home' | 'about' | 'contact' | 'admin-dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Navigation Header - Only show on non-admin pages */}
        {currentView !== 'admin-dashboard' && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
                >
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">Studio Builder</span>
                </button>

                {/* Navigation Items */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setCurrentView('home')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentView === 'home'
                        ? 'bg-slate-800/50 text-cyan-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('about')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentView === 'about'
                        ? 'bg-slate-800/50 text-cyan-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('contact')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentView === 'contact'
                        ? 'bg-slate-800/50 text-cyan-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </button>

                  {/* Admin Dashboard Button - Direct access without login */}
                  <button
                    onClick={() => setCurrentView('admin-dashboard')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
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
            <AdminDashboard onBackToHome={handleBackToHome} />
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
      setInitMessage('⚠️ Could not initialize admin. Please try signing in anyway.');
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

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400 text-center">
              Need to create an admin account?{' '}
              <span className="text-purple-400">Contact system administrator</span>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400 text-center">
              Don't have an admin account?{' '}
              <button
                onClick={handleInitAdmin}
                className="text-purple-400 hover:underline"
              >
                Initialize Admin
              </button>
            </p>
          </div>

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

// Inline Admin Dashboard Component
function AdminDashboard({ onBackToHome }: { onBackToHome: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders'>('overview');
  const [stats, setStats] = useState({ users: 0, categories: 0, products: 0, library_packs: 0, orders: 0 });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    setSeedMessage('🌱 Seeding demo data...');
    setErrorDetails('');
    
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data`;
      console.log('Calling seed endpoint:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 200)}`);
      }
      
      console.log('Seed response data:', data);
      
      if (response.ok && data.success) {
        setSeedMessage(`✅ Demo data seeded successfully! ${data.stats.users} users, ${data.stats.categories} categories, ${data.stats.products} products, ${data.stats.library_packs} library packs, ${data.stats.orders} orders created.`);
        setStats(data.stats);
      } else {
        const errorMsg = data.error || data.message || 'Unknown error';
        setSeedMessage(`❌ Failed to seed demo data: ${errorMsg}`);
        setErrorDetails(`Status: ${response.status}\nDetails: ${JSON.stringify(data, null, 2)}`);
        console.error('Seed error details:', data);
      }
    } catch (err) {
      console.error('Seed demo data error:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setSeedMessage(`❌ Error seeding demo data: ${errorMsg}`);
      setErrorDetails(`Error: ${errorMsg}\nCheck browser console for more details`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'categories'
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FolderTree className="w-5 h-5" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <button
                onClick={onBackToHome}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Package className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-white">{stats.products}</p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <FolderTree className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Categories</p>
                    <p className="text-3xl font-bold text-white">{stats.categories}</p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <ShoppingCart className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{stats.orders}</p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-white">$0</p>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    onClick={handleSeedDemoData}
                    disabled={isSeeding}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSeeding ? '🌱 Seeding Database...' : '🚀 Seed Complete Demo Data'}
                  </button>
                  <p className="text-sm text-slate-400 text-center mt-3">
                    Click to populate database with 20 products, 4 categories, 5 orders, and more!
                  </p>
                </div>

                {seedMessage && (
                  <div className={`mt-6 p-4 rounded-xl border ${
                    seedMessage.includes('✅') 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <p className={`text-sm ${
                      seedMessage.includes('✅') ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {seedMessage}
                    </p>
                    {errorDetails && (
                      <div className="mt-2 text-xs text-slate-400">
                        <pre>{errorDetails}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Manage Categories</h2>
                <p className="text-slate-400">Category management coming soon...</p>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Manage Products</h2>
                <p className="text-slate-400">Product management coming soon...</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Manage Orders</h2>
                <p className="text-slate-400">Order management coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}