import { useState, useEffect } from 'react';
import { CategoryList } from './CategoryList';
import { CategoryForm } from './CategoryForm';
import { Category } from '../../../types';
import { kvStore } from '../../../services/kvStore';

export function AdminCategories() {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const categoriesData = await kvStore.listByPrefix<Category>('category:');
            setCategories(categoriesData.map(d => d.value).sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        setView('form');
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setView('form');
    };

    const handleSave = () => {
        fetchData();
        setView('list');
    };

    const handleCancel = () => {
        setView('list');
        setEditingCategory(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {view === 'list' ? (
                <CategoryList
                    categories={categories}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onRefresh={fetchData}
                />
            ) : (
                <CategoryForm
                    category={editingCategory}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
