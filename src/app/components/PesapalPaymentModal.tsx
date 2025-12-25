import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Order } from '../../services/orderService';
import { pesapalService, PesapalOrderResponse } from '../../services/pesapalService';

interface PesapalPaymentModalProps {
    order: Order;
    onClose: () => void;
    onPaymentComplete: (trackingId: string) => void;
}

export function PesapalPaymentModal({ order, onClose, onPaymentComplete }: PesapalPaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pesapalResponse, setPesapalResponse] = useState<PesapalOrderResponse | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

    useEffect(() => {
        // Listen for payment callback
        const handleMessage = async (event: MessageEvent) => {
            // Verify origin for security
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'PESAPAL_CALLBACK') {
                const { OrderTrackingId, OrderMerchantReference } = event.data;
                await checkPaymentStatus(OrderTrackingId);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const initiatePesapalPayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Create Pesapal order request
            const pesapalOrder = pesapalService.createOrderRequest(
                order.id,
                order.totalAmount,
                order.customer.email,
                order.customer.name,
                undefined, // phone number (optional)
                `Studio Builder Order - ${order.items.products.length + order.items.libraryPacks.length} items`
            );

            // Submit to Pesapal
            const response = await pesapalService.submitOrder(pesapalOrder);
            setPesapalResponse(response);
            setPaymentStatus('processing');

            // Open payment URL in iframe or new window
            // For better UX, we'll use an iframe
        } catch (err: any) {
            console.error('Pesapal payment error:', err);
            setError(err.message || 'Failed to initialize payment. Please try again.');
            setPaymentStatus('failed');
        } finally {
            setIsLoading(false);
        }
    };

    const checkPaymentStatus = async (trackingId: string) => {
        try {
            const status = await pesapalService.getTransactionStatus(trackingId);

            if (status.status_code === 1) {
                // Payment completed
                setPaymentStatus('completed');
                setTimeout(() => {
                    onPaymentComplete(trackingId);
                }, 2000);
            } else if (status.status_code === 2) {
                // Payment failed
                setPaymentStatus('failed');
                setError(status.description || 'Payment failed');
            } else if (status.status_code === 3) {
                // Payment reversed
                setPaymentStatus('failed');
                setError('Payment was reversed');
            }
        } catch (err: any) {
            console.error('Failed to check payment status:', err);
            setError('Failed to verify payment status');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <CreditCard className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Pesapal Payment</h3>
                            <p className="text-sm text-slate-400">Secure payment gateway</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Order Summary */}
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Order ID:</span>
                            <span className="text-white font-mono text-sm">{order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Customer:</span>
                            <span className="text-white text-sm">{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm">Items:</span>
                            <span className="text-white text-sm">
                                {order.items.products.length + order.items.libraryPacks.length} items
                            </span>
                        </div>
                        <div className="h-px bg-slate-700/50 my-3" />
                        <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium">Total Amount:</span>
                            <span className="text-2xl font-bold text-white">
                                TZS {order.totalAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    {paymentStatus === 'pending' && !pesapalResponse && (
                        <div className="text-center py-8">
                            <button
                                onClick={initiatePesapalPayment}
                                disabled={isLoading}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Initializing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay with Pesapal
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Pesapal Payment Iframe */}
                    {pesapalResponse && paymentStatus === 'processing' && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-300">
                                    <p className="font-medium mb-1">Complete your payment</p>
                                    <p className="text-blue-400">
                                        Select your preferred payment method and follow the instructions below.
                                    </p>
                                </div>
                            </div>

                            <div className="border-2 border-slate-700 rounded-xl overflow-hidden">
                                <iframe
                                    src={pesapalResponse.redirect_url}
                                    className="w-full h-[500px]"
                                    title="Pesapal Payment"
                                />
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {paymentStatus === 'completed' && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Payment Successful!</h4>
                            <p className="text-slate-400">Your order has been confirmed.</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-300">
                                <p className="font-medium mb-1">Payment Error</p>
                                <p className="text-red-400">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Failed State */}
                    {paymentStatus === 'failed' && (
                        <div className="text-center py-8">
                            <button
                                onClick={initiatePesapalPayment}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
