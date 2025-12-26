import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  fileSize: number;
  price: number;
  isFree: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const editorRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    categoryId: '',
    name: '',
    description: '',
    fileSize: 0,
    price: 0,
    isFree: false,
    image: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/categories`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      id: `prod_${Date.now()}`,
      categoryId: categories[0]?.id || '',
      name: '',
      description: '',
      fileSize: 0,
      price: 0,
      isFree: false,
      image: '',
    });
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      fileSize: product.fileSize,
      price: product.price,
      isFree: product.isFree,
      image: product.image || '',
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      const url = editingId
        ? `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/products/${editingId}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/products`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          id: formData.id,
          categoryId: formData.categoryId,
          name: formData.name,
          description: formData.description,
          fileSize: formData.fileSize,
          price: formData.price,
          isFree: formData.isFree,
          image: formData.image,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchProducts();
        setIsEditing(false);
        setEditingId(null);
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        await fetchProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete product');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setError('');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.title || categoryId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        {!isEditing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Product' : 'New Product'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., FL Studio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                value={formData.description}
                onEditorChange={(content) => setFormData({ ...formData, description: content })}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: ['lists', 'link', 'code', 'table'],
                  toolbar: 'undo redo | bold italic underline | bullist numlist | link | table | code',
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  promotion: false,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  File Size (GB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  disabled={formData.isFree}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/20"
                  />
                  <span className="text-sm text-slate-300">Free Product</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Image URL (optional)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                placeholder="https://example.com/image.png"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <p className="text-slate-400">No products found. Create your first product!</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.isFree 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {product.isFree ? 'FREE' : `$${product.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-cyan-400 mb-2">
                      Category: {getCategoryName(product.categoryId)}
                    </p>
                    <div
                      className="text-slate-300 text-sm mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Size: {product.fileSize} GB</span>
                      <span>•</span>
                      <span>ID: {product.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}