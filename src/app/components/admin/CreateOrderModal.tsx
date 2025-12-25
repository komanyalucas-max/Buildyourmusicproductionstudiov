import { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Order, orderService } from '../../../services/orderService';
import { StorageType } from '../StorageSelector';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        location: '',
        storageType: 'SSD' as StorageType,
        storageCapacity: 500,
        itemName: '',
        itemPrice: 0
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create a simplified order for manual entry
            const orderPayload: any = {
                customer: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    location: formData.location
                },
                items: {
                    products: [{
                        id: crypto.randomUUID(),
                        name: formData.itemName || 'Custom Item',
                        price: Number(formData.itemPrice),
                        category_id: 'custom',
                        description: 'Manually added item',
                        file_size: 0,
                        is_free: false,
                        features: [],
                        created_at: new Date().toISOString()
                    }],
                    libraryPacks: []
                },
                storage: {
                    type: formData.storageType,
                    capacity: Number(formData.storageCapacity)
                },
                totalStorage: Number(formData.storageCapacity),
                totalAmount: Number(formData.itemPrice),
                paymentMethod: 'other'
            };

            await orderService.createOrder(orderPayload);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to create order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white">Create New Order</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Customer Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                    value={formData.customerEmail}
                                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-700/50" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Order Item</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                    value={formData.itemName}
                                    onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                                    value={formData.itemPrice}
                                    onChange={e => setFormData({ ...formData, itemPrice: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium border border-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Create Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
