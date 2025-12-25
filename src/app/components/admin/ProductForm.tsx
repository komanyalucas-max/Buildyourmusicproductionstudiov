import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Product, Category } from '../../../types';
import { kvStore } from '../../../services/kvStore';
import { Save, X } from 'lucide-react';

// Fix for ReactQuill SSR/Type issues
// @ts-ignore
const Quill = ReactQuill as any;

interface ProductFormProps {
    product?: Product | null; // If null, creating new
    categories: Category[];
    onSave: () => void;
    onCancel: () => void;
}

export function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category_id: categories[0]?.id || '',
        price: 0,
        file_size: 0,
        is_free: false,
        description: '',
        features: []
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else if (categories.length > 0) {
            setFormData(prev => ({ ...prev, category_id: categories[0].id }));
        }
    }, [product, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const id = product?.id || `prod_${crypto.randomUUID()}`;
            const newProduct: Product = {
                ...formData as Product,
                id,
                created_at: product?.created_at || new Date().toISOString()
            };

            await kvStore.set(`product:${id}`, newProduct);
            onSave();
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
                {product ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">File Size (GB)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.file_size}
                            onChange={(e) => setFormData({ ...formData, file_size: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_free}
                            onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500"
                        />
                        <span>Is Free Product?</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Features (Comma separated)</label>
                    <input
                        type="text"
                        value={formData.features?.join(', ')}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        placeholder="VST Support, 64-bit, etc"
                    />
                </div>

                <div className="h-80 pb-12">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <div className="h-64 bg-slate-800/50 rounded-lg text-slate-100">
                        <Quill
                            theme="snow"
                            value={formData.description}
                            onChange={(content: string) => setFormData({ ...formData, description: content })}
                            className="h-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}
