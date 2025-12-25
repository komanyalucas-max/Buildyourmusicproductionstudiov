import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Category } from '../../../types';
import { kvStore } from '../../../services/kvStore';
import { Save, X } from 'lucide-react';

// Fix for ReactQuill SSR/Type issues
// @ts-ignore
const Quill = ReactQuill as any;

interface CategoryFormProps {
    category?: Category | null;
    onSave: () => void;
    onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        name_sw: '',
        description: '',
        icon: '',
        order: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData(category);
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const id = category?.id || `cat_${crypto.randomUUID()}`;
            const newCategory: Category = {
                ...formData as Category,
                id,
                created_at: category?.created_at || new Date().toISOString()
            };

            await kvStore.set(`category:${id}`, newCategory);
            onSave();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
                {category ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Swahili Name (Optional)</label>
                        <input
                            type="text"
                            value={formData.name_sw || ''}
                            onChange={(e) => setFormData({ ...formData, name_sw: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Order/Priority</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Icon (Emoji/URL)</label>
                        <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="e.g. 🎵"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Helper Text</label>
                        <input
                            type="text"
                            value={formData.helper_text || ''}
                            onChange={(e) => setFormData({ ...formData, helper_text: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="e.g. Recommended for beginners"
                        />
                    </div>
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
                        Save Category
                    </button>
                </div>
            </form>
        </div>
    );
}
