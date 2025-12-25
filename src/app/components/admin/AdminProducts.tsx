import { useState, useEffect } from 'react';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { Product, Category } from '../../../types';
import { kvStore } from '../../../services/kvStore';

export function AdminProducts() {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                kvStore.listByPrefix<Product>('product:'),
                kvStore.listByPrefix<Category>('category:')
            ]);

            setProducts(productsData.map(d => d.value));
            setCategories(categoriesData.map(d => d.value).sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingProduct(null);
        setView('form');
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setView('form');
    };

    const handleSave = () => {
        fetchData(); // Refresh list
        setView('list');
    };

    const handleCancel = () => {
        setView('list');
        setEditingProduct(null);
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
                <ProductList
                    products={products}
                    categories={categories}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onRefresh={fetchData}
                />
            ) : (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
