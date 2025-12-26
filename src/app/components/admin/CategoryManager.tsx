import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  titleSw: string;
  subtitleSw: string;
  icon: string;
  helperText: string;
  helperTextSw: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const editorRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    titleSw: '',
    subtitleSw: '',
    icon: 'Music',
    helperText: '',
    helperTextSw: '',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
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
        setCategories(data.categories.sort((a: Category, b: Category) => a.order - b.order));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormData({
      id: `cat_${Date.now()}`,
      title: '',
      subtitle: '',
      titleSw: '',
      subtitleSw: '',
      icon: 'Music',
      helperText: '',
      helperTextSw: '',
      order: categories.length + 1,
    });
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setFormData({
      id: category.id,
      title: category.title,
      subtitle: category.subtitle,
      titleSw: category.titleSw || '',
      subtitleSw: category.subtitleSw || '',
      icon: category.icon,
      helperText: category.helperText || '',
      helperTextSw: category.helperTextSw || '',
      order: category.order,
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      const url = editingId
        ? `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/categories/${editingId}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/categories`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchCategories();
        setIsEditing(false);
        setEditingId(null);
      } else {
        setError(data.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bbbda4f3/categories/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        await fetchCategories();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete category');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading categories...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Category Management</h2>
        {!isEditing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
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
            {editingId ? 'Edit Category' : 'New Category'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., DAW"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title (Swahili)
                </label>
                <input
                  type="text"
                  value={formData.titleSw}
                  onChange={(e) => setFormData({ ...formData, titleSw: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., DAW"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subtitle (English)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., Choose your production software"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subtitle (Swahili)
                </label>
                <input
                  type="text"
                  value={formData.subtitleSw}
                  onChange={(e) => setFormData({ ...formData, subtitleSw: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., Chagua programu yako ya uzalishaji"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Helper Text (English)
              </label>
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                value={formData.helperText}
                onEditorChange={(content) => setFormData({ ...formData, helperText: content })}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: ['lists', 'link', 'code'],
                  toolbar: 'undo redo | bold italic | bullist numlist | link | code',
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  promotion: false,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Helper Text (Swahili)
              </label>
              <Editor
                value={formData.helperTextSw}
                onEditorChange={(content) => setFormData({ ...formData, helperTextSw: content })}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: ['lists', 'link', 'code'],
                  toolbar: 'undo redo | bold italic | bullist numlist | link | code',
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  promotion: false,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icon Name
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., Music"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
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
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <p className="text-slate-400">No categories found. Create your first category!</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                        Order: {category.order}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{category.subtitle}</p>
                    {category.helperText && (
                      <div
                        className="text-slate-400 text-sm"
                        dangerouslySetInnerHTML={{ __html: category.helperText }}
                      />
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Icon: {category.icon}</span>
                      <span>•</span>
                      <span>ID: {category.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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