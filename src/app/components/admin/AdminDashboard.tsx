import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  BarChart3,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'overview' | 'products' | 'categories' | 'orders';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <div className="flex">
        {/* Sidebar */}
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
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat Cards */}
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Package className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <FolderTree className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Categories</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <ShoppingCart className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-white">0</p>
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
