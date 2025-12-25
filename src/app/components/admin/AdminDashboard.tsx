import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  LogOut,
  BarChart3,
  Users,
  Settings,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { AdminReports } from './AdminReports';
import { kvStore } from '../../../services/kvStore';
import { Product, Category, Order } from '../../../types';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

type Tab = 'overview' | 'products' | 'categories' | 'orders' | 'settings' | 'reports';

export function AdminDashboard({ onBackToHome }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const [products, categories, orders] = await Promise.all([
        kvStore.listByPrefix<Product>('product:'),
        kvStore.listByPrefix<Category>('category:'),
        kvStore.listByPrefix<Order>('order:')
      ]);

      const orderValues = orders.map(o => o.value);
      const revenue = orderValues
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0);

      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        revenue
      });

    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    setSeedMessage('🌱 Seeding demo data...');

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      });

      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 200)}`);
      }

      if (response.ok && data.success) {
        setSeedMessage(`✅ Demo data seeded successfully!`);
        fetchStats();
        setTimeout(() => setSeedMessage(''), 5000);
      } else {
        const errorMsg = data.error || data.message || 'Unknown error';
        setSeedMessage(`❌ Failed to seed demo data: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Seed demo data error:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setSeedMessage(`❌ Error seeding demo data: ${errorMsg}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 flex">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0
        `}
      >
        <div className="p-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">StudioAdmin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-2 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/95">
          <button
            onClick={onBackToHome}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">StudioAdmin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2 hover:bg-slate-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-slate-400">Welcome back. Here's what's happening today.</p>
              </header>

              {isLoadingStats ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                        <Package className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="text-slate-400 text-sm">Total Products</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.products}</div>
                    <div className="text-purple-400 text-sm flex items-center gap-1">
                      Manage Inventory →
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-colors">
                        <FolderTree className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-slate-400 text-sm">Categories</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
                    <div className="text-cyan-400 text-sm flex items-center gap-1">
                      View Categories →
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all text-left group hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                        <ShoppingCart className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-slate-400 text-sm">Orders</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.orders}</div>
                    <div className="text-emerald-400 text-sm flex items-center gap-1">
                      View Orders →
                    </div>
                  </button>

                  <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-slate-400 text-sm">Revenue</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">${stats.revenue.toLocaleString()}</div>
                    <div className="text-blue-400 text-sm flex items-center gap-1">
                      Lifetime Earnings
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
                    <button
                      onClick={handleSeedDemoData}
                      disabled={isSeeding}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/30 rounded-2xl p-6 group hover:border-rose-500/50 transition-all"
                    >
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-rose-500/20 rounded-xl group-hover:bg-rose-500/30 transition-colors">
                          <Users className="w-6 h-6 text-rose-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {isSeeding ? 'Seeding Database...' : 'Seed Demo Data'}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {seedMessage || 'Reset your database with sample categories, products, and orders for testing.'}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'reports' && <AdminReports />}
        </div>
      </main>
    </div>
  );
}
