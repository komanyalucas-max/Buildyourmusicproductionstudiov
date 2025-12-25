import { useState } from 'react';
import { Category } from '../../../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import { kvStore } from '../../../services/kvStore';

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onAdd: () => void;
    onRefresh: () => void;
}

export function CategoryList({ categories, onEdit, onAdd, onRefresh }: CategoryListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        setIsDeleting(id);
        try {
            await kvStore.delete(`category:${id}`);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete category');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Manage Categories</h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Icon</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Order</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-2xl">{category.icon || '📁'}</td>
                                    <td className="px-6 py-4 font-medium text-white">{category.name}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{category.description?.replace(/<[^>]*>?/gm, '')}</td>
                                    <td className="px-6 py-4">{category.order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(category)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                disabled={isDeleting === category.id}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No categories found. Add one to get started!
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
