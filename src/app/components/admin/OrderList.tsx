import { useState } from 'react';
import { Order, orderService } from '../../../services/orderService';
import { Trash2, CheckCircle, XCircle, Clock, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';
import { OrderCard } from './OrderCard';
import { CreateOrderModal } from './CreateOrderModal';

interface OrderListProps {
    orders: Order[];
    onRefresh: () => void;
}

export function OrderList({ orders, onRefresh }: OrderListProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusUpdate = async (order: Order, newStatus: Order['status']) => {
        setIsUpdating(order.id);
        try {
            await orderService.updateOrderStatus(order.id, newStatus);
            onRefresh();
        } catch (error) {
            console.error('Failed to update order:', error);
            alert('Failed to update order');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        setIsUpdating(id);
        try {
            await kvStore.delete(`order:${id}`);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'pending_payment': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    const filteredOrders = orders.filter(order => {
        const name = order.customer?.name?.toLowerCase() || '';
        const email = order.customer?.email?.toLowerCase() || '';
        const id = order.id?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search) || id.includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Manage Orders</h2>
                    <p className="text-slate-400 mt-1">View and manage customer orders ({orders.length})</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors font-medium flex items-center gap-2 shadow-lg shadow-purple-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Order
                    </button>

                    <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 flex gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={handleStatusUpdate}
                            onDelete={handleDelete}
                            onRefresh={onRefresh}
                            isUpdating={isUpdating === order.id}
                        />
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                            No orders found matching your search.
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Items</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Payment</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredOrders.map((order) => {
                                    // Safety checks
                                    const itemCount = (order.items?.products?.length || 0) + (order.items?.libraryPacks?.length || 0);
                                    const itemNames = [
                                        ...(order.items?.products?.map(p => p.name) || []),
                                        ...(order.items?.libraryPacks?.map(p => p.name) || [])
                                    ];
                                    const customerName = order.customer?.name || 'Unknown';
                                    const customerEmail = order.customer?.email || '-';
                                    const customerLocation = order.customer?.location || '-';
                                    const totalAmount = order.totalAmount || 0;
                                    const status = order.status || 'pending_payment';
                                    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

                                    return (
                                        <tr key={order.id || Math.random()} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{(order.id || '???').substring(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{customerName}</div>
                                                <div className="text-xs text-slate-500">{customerEmail}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    {customerLocation}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white">{itemCount} items</span>
                                                <div className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">
                                                    {itemNames.join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">${totalAmount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs">
                                                    {order.paymentMethod ? (
                                                        <span className="capitalize text-slate-300">{order.paymentMethod}</span>
                                                    ) : (
                                                        <span className="text-slate-600">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(status)} capitalize flex w-fit items-center gap-1`}>
                                                    {(status === 'completed' || status === 'paid') && <CheckCircle className="w-3 h-3" />}
                                                    {status === 'pending_payment' && <Clock className="w-3 h-3" />}
                                                    {status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                                    {status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{createdAt.toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(status === 'pending_payment' || status === 'paid') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order, 'completed')}
                                                            disabled={!!isUpdating}
                                                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                            title="Mark Completed"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {status !== 'cancelled' && status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order, 'cancelled')}
                                                            disabled={!!isUpdating}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Cancel Order"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        disabled={!!isUpdating}
                                                        className="p-2 text-slate-400 hover:bg-slate-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500 bg-slate-900/20">
                                            No orders found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={onRefresh}
            />
        </div>
    );
}
