import { Order } from '../../../services/orderService';
import { Package, User, Mail, MapPin, Calendar, CreditCard, ChevronDown, CheckCircle, XCircle, Trash2, Clock, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { PesapalOrderActions } from './PesapalOrderActions';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (order: Order, status: Order['status']) => void;
    onDelete: (id: string) => void;
    onRefresh: () => void;
    isUpdating: boolean;
}

export function OrderCard({ order, onUpdateStatus, onDelete, onRefresh, isUpdating }: OrderCardProps) {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'paid': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'; // rose for premium red
            case 'pending_payment': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    if (!order) return null;

    // Safety checks for legacy data
    const itemCount = (order.items?.products?.length || 0) + (order.items?.libraryPacks?.length || 0);
    const productNames = [
        ...(order.items?.products?.map(p => p.name) || []),
        ...(order.items?.libraryPacks?.map(p => p.name) || [])
    ];

    // Default values if missing
    const orderId = order.id || 'Unknown ID';
    const orderStatus = order.status || 'pending_payment';
    const totalAmount = order.totalAmount || 0;
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    const customer = order.customer || { name: 'Unknown', email: '-', location: '-' };

    return (
        <div className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600/50 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-900/10">
            {/* Header: ID & Status */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                        <Package className="w-3 h-3" />
                        #{orderId.slice(0, 8)}
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border w-fit flex items-center gap-1.5 ${getStatusColor(orderStatus)}`}>
                        {orderStatus === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {orderStatus === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {orderStatus === 'pending_payment' && <Clock className="w-3 h-3" />}
                        <span className="capitalize">{orderStatus.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xl font-bold text-white tracking-tight">
                        ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        {createdAt.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-700/50 my-4" />

            {/* Customer Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{customer.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{customer.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Summary */}
            <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Order Items</span>
                    <span className="text-xs bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded-md">{itemCount}</span>
                </div>
                <div className="space-y-1">
                    {productNames.slice(0, 3).map((name, i) => (
                        <div key={i} className="text-xs text-slate-300 truncate pl-1 border-l-2 border-slate-600">
                            {name}
                        </div>
                    ))}
                    {productNames.length > 3 && (
                        <div className="text-xs text-slate-500 italic pl-1">
                            +{productNames.length - 3} more items...
                        </div>
                    )}
                </div>
            </div>

            {/* Pesapal Actions */}
            {order.paymentMethod === 'pesapal' && (
                <PesapalOrderActions order={order} onRefresh={onRefresh} />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                <div className="flex gap-2 w-full">
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                            onClick={() => onUpdateStatus(order, 'completed')}
                            disabled={isUpdating}
                            className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                        </button>
                    )}

                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                            onClick={() => onUpdateStatus(order, 'cancelled')}
                            disabled={isUpdating}
                            className="flex-1 py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium transition-colors border border-rose-500/20 hover:border-rose-500/40 flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(order.id)}
                        disabled={isUpdating}
                        className="py-2 px-3 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-900/30"
                        title="Delete Order"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
