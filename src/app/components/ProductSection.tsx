import { Category } from './StudioBuilder';
import { ProductItem } from './ProductItem';

interface ProductSectionProps {
  category: Category;
  selectedItems: Set<string>;
  onToggleItem: (productId: string) => void;
  selectedLibraryPacks: Set<string>;
  onToggleLibraryPack: (packId: string) => void;
}

export function ProductSection({
  category,
  selectedItems,
  onToggleItem,
  selectedLibraryPacks,
  onToggleLibraryPack,
}: ProductSectionProps) {
  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl hover:border-purple-500/50 transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform">
            <div className="text-purple-300">{category.icon}</div>
          </div>
          <div className="flex-1">
            <h2 className="text-white mb-1">{category.title}</h2>
            <p className="text-slate-400">{category.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="p-6 space-y-3">
        {category.products.map((product) => {
          const isSelected = selectedItems.has(product.id);
          const hasLibraryPacks = product.libraryPacks && product.libraryPacks.length > 0;

          return (
            <div key={product.id} className="space-y-2">
              {/* Main Product */}
              <label
                className={`group/item relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600/50 hover:bg-slate-800/70'
                }`}
              >
                {/* Custom Checkbox */}
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleItem(product.id)}
                    className="peer sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent' 
                      : 'border-slate-600 group-hover/item:border-slate-500'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white">{product.name}</h3>
                    {product.isFree && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-full backdrop-blur-sm">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{product.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                    isSelected 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    {formatStorage(product.fileSize)}
                  </div>
                  {hasLibraryPacks && isSelected && (
                    <span className="text-xs text-purple-300">+{product.libraryPacks.length} packs</span>
                  )}
                </div>
              </label>

              {/* Library Packs */}
              {hasLibraryPacks && isSelected && (
                <div className="ml-10 space-y-2 animate-in slide-in-from-top-2 duration-300">
                  {product.libraryPacks.map((pack) => {
                    const isPackSelected = selectedLibraryPacks.has(pack.id);
                    return (
                      <label
                        key={pack.id}
                        className={`group/pack relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          isPackSelected
                            ? 'bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/50 shadow-md shadow-fuchsia-500/20'
                            : 'bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                        }`}
                      >
                        {/* Custom Checkbox */}
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isPackSelected}
                            onChange={() => onToggleLibraryPack(pack.id)}
                            className="peer sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isPackSelected 
                              ? 'bg-gradient-to-br from-fuchsia-500 to-purple-500 border-transparent' 
                              : 'border-slate-600 group-hover/pack:border-slate-500'
                          }`}>
                            {isPackSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-white mb-0.5">{pack.name}</h4>
                          <p className="text-xs text-slate-400">{pack.description}</p>
                        </div>

                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                          isPackSelected 
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' 
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {formatStorage(pack.fileSize)}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}