import { useState } from 'react';
import { Order } from '../../../services/orderService';
import { pesapalService } from '../../../services/pesapalService';
import { CreditCard, RefreshCw, XCircle, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PesapalOrderActionsProps {
    order: Order;
    onRefresh: () => void;
}

export function PesapalOrderActions({ order, onRefresh }: PesapalOrderActionsProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkPaymentStatus = async () => {
        if (!order.pesapalTrackingId) {
            setError('No Pesapal tracking ID found for this order');
            return;
        }

        setIsChecking(true);
        setError(null);
        setStatusMessage(null);

        try {
            const status = await pesapalService.getTransactionStatus(order.pesapalTrackingId);

            const statusDesc = pesapalService.getStatusDescription(status.status_code);
            setStatusMessage(
                `Payment Status: ${statusDesc}\n` +
                `Method: ${status.payment_method}\n` +
                `Amount: ${status.currency} ${status.amount}\n` +
                `Confirmation: ${status.confirmation_code || 'N/A'}`
            );

            // Auto-refresh after checking status
            setTimeout(() => {
                onRefresh();
            }, 1000);
        } catch (err: any) {
            console.error('Failed to check payment status:', err);
            setError(err.message || 'Failed to check payment status');
        } finally {
            setIsChecking(false);
        }
    };

    const cancelPesapalOrder = async () => {
        if (!order.pesapalTrackingId) {
            setError('No Pesapal tracking ID found for this order');
            return;
        }

        if (!confirm('Are you sure you want to cancel this Pesapal order? This action cannot be undone.')) {
            return;
        }

        setIsCancelling(true);
        setError(null);
        setStatusMessage(null);

        try {
            const result = await pesapalService.cancelOrder(order.pesapalTrackingId);

            if (result.status === '200') {
                setStatusMessage('Order successfully cancelled on Pesapal');
                setTimeout(() => {
                    onRefresh();
                }, 1500);
            } else {
                setError(result.message || 'Failed to cancel order');
            }
        } catch (err: any) {
            console.error('Failed to cancel order:', err);
            setError(err.message || 'Failed to cancel Pesapal order');
        } finally {
            setIsCancelling(false);
        }
    };

    if (!order.pesapalTrackingId) {
        return null;
    }

    return (
        <div className="mt-4 space-y-3">
            {/* Pesapal Info */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300">Pesapal Payment</span>
                </div>
                <div className="text-xs text-purple-400 font-mono">
                    Tracking ID: {order.pesapalTrackingId.slice(0, 20)}...
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={checkPaymentStatus}
                    disabled={isChecking}
                    className="flex-1 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition-colors border border-blue-500/20 hover:border-blue-500/40 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isChecking ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            Check Status
                        </>
                    )}
                </button>

                {(order.status === 'pending_payment' || order.status === 'processing') && (
                    <button
                        onClick={cancelPesapalOrder}
                        disabled={isCancelling}
                        className="flex-1 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20 hover:border-red-500/40 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isCancelling ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-3.5 h-3.5" />
                                Cancel on Pesapal
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Status Message */}
            {statusMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-300 whitespace-pre-line">
                        {statusMessage}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-300">
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
}
