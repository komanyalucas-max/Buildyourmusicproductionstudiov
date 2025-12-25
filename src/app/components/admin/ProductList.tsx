import { useState } from 'react';
import { Product, Category } from '../../../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';

interface ProductListProps {
    products: Product[];
    categories: Category[];
    onEdit: (product: Product) => void;
    onAdd: () => void;
    onRefresh: () => void;
}

export function ProductList({ products, categories, onEdit, onAdd, onRefresh }: ProductListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || 'Unknown';
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setIsDeleting(id);
        try {
            await kvStore.delete(`product:${id}`);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete product');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Manage Products</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Size</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                    <td className="px-6 py-4">{getCategoryName(product.category_id)}</td>
                                    <td className="px-6 py-4">
                                        {product.is_free ? (
                                            <span className="text-emerald-400">Free</span>
                                        ) : (
                                            `$${product.price}`
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{product.file_size} GB</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={isDeleting === product.id}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No products found. Add one to get started!
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
