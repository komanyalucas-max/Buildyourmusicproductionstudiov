import { useState, useEffect } from 'react';
import { Eye, Package } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_country: string;
  shipping_city: string;
  shipping_address?: string;
  products: string[];
  product_details?: Array<{ id: string; name: string; price: number; size: number }>;
  storage_device?: string;
  total_storage_gb: number;
  subtotal_usd: number;
  shipping_cost_usd: number;
  total_usd: number;
  currency: string;
  status: string;
  created_at: string;
}

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/orders`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Order Management</h2>
        <div className="text-sm text-slate-400">
          Total: {orders.length} orders
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {selectedOrder ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Order Details</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Back to List
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Customer Information</h4>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <p className="text-white">{selectedOrder.customer_name}</p>
                  <p className="text-slate-300 text-sm">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-slate-300 text-sm">{selectedOrder.customer_phone}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Shipping Address</h4>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-1">
                  <p className="text-white">{selectedOrder.shipping_city}, {selectedOrder.shipping_country}</p>
                  {selectedOrder.shipping_address && (
                    <p className="text-slate-300 text-sm">{selectedOrder.shipping_address}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Order Status</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border font-semibold ${getStatusColor(selectedOrder.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Products</h4>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  {selectedOrder.product_details && selectedOrder.product_details.length > 0 ? (
                    selectedOrder.product_details.map((product, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                        <div>
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-slate-400 text-xs">{product.size} GB</p>
                        </div>
                        <p className="text-cyan-400 font-semibold">${product.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">No product details available</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Storage</h4>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-white text-sm">{selectedOrder.storage_device || 'N/A'}</p>
                  <p className="text-slate-400 text-xs">Total: {selectedOrder.total_storage_gb} GB</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">Payment Summary</h4>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="text-white">${selectedOrder.subtotal_usd}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Shipping</span>
                    <span className="text-white">${selectedOrder.shipping_cost_usd}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                    <span className="text-white">Total</span>
                    <span className="text-cyan-400">${selectedOrder.total_usd}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              Order ID: {selectedOrder.id} • Created: {formatDate(selectedOrder.created_at)}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{order.customer_name}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Email</p>
                        <p className="text-slate-200">{order.customer_email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Location</p>
                        <p className="text-slate-200">{order.shipping_city}, {order.shipping_country}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Total</p>
                        <p className="text-cyan-400 font-bold">${order.total_usd}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                      <span>{order.products.length} products</span>
                      <span>•</span>
                      <span>{order.total_storage_gb} GB</span>
                      <span>•</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}