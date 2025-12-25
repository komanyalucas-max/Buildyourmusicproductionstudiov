import { useState } from 'react';
import { Order } from '../../../types';
import { Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';

interface OrderListProps {
    orders: Order[];
    onRefresh: () => void;
}

export function OrderList({ orders, onRefresh }: OrderListProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleStatusUpdate = async (order: Order, newStatus: 'pending' | 'completed' | 'cancelled') => {
        setIsUpdating(order.id);
        try {
            const updatedOrder = { ...order, status: newStatus };
            await kvStore.set(`order:${order.id}`, updatedOrder);
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
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Manage Orders</h2>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{order.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{order.customer_name}</div>
                                        <div className="text-xs text-slate-500">{order.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.items.length} items
                                        <div className="text-xs text-slate-500 mt-1">
                                            {order.items.map(i => i.product_name).join(', ').substring(0, 30)}
                                            {order.items.map(i => i.product_name).join(', ').length > 30 ? '...' : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">${order.total_amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)} capitalize flex w-fit items-center gap-1`}>
                                            {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                            {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order, 'completed')}
                                                        disabled={!!isUpdating}
                                                        className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                        title="Mark Completed"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order, 'cancelled')}
                                                        disabled={!!isUpdating}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Cancel Order"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
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
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
