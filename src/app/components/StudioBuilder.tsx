import { useState, useMemo, useEffect } from 'react';
import { Music, Wand2, Sliders, Library, Sparkles, Calculator } from 'lucide-react';
import { ProductSection } from './ProductSection';
import { CostSummary } from './CostSummary';
import { StorageSelector, StorageType } from './StorageSelector';
import { Checkout } from './Checkout';
import { PriceCalculation } from './PriceCalculation';
import { LocationSelection } from './LocationSelection';
import { LanguageCurrencySelector } from './LanguageCurrencySelector';
import { useLanguage } from '../contexts/LanguageContext';
import { kvStore } from '../../services/kvStore';
import type { Product as DBProduct, Category as DBCategory } from '../../types';

export interface LibraryPack {
  id: string;
  name: string;
  description: string;
  fileSize: number; // Size in GB
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fileSize: number; // Size in GB
  isFree?: boolean;
  libraryPacks?: LibraryPack[];
  image?: string;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  helperText?: string;
}

// Icon mapping for categories
const getIconForCategory = (iconName?: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Music': <Music className="w-5 h-5" />,
    'Wand2': <Wand2 className="w-5 h-5" />,
    'Sliders': <Sliders className="w-5 h-5" />,
    'Library': <Library className="w-5 h-5" />,
  };
  return iconMap[iconName || 'Library'] || <Library className="w-5 h-5" />;
};

export function StudioBuilder() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedLibraryPacks, setSelectedLibraryPacks] = useState<Set<string>>(new Set());
  const [storageType, setStorageType] = useState<StorageType>(null);
  const [storageCapacity, setStorageCapacity] = useState<number | null>(null);
  const [customerLocation, setCustomerLocation] = useState<string>('');
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [showPriceCalculation, setShowPriceCalculation] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const { t } = useLanguage();

  // Fetch categories and products from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [categoriesData, productsData] = await Promise.all([
          kvStore.listByPrefix<DBCategory>('category:'),
          kvStore.listByPrefix<DBProduct>('product:')
        ]);

        // Transform database data to UI format
        const dbCategories = categoriesData.map(c => c.value).sort((a, b) => a.order - b.order);
        const dbProducts = productsData.map(p => p.value);

        // Group products by category
        const transformedCategories: Category[] = dbCategories.map(cat => {
          const categoryProducts = dbProducts
            .filter(p => p.category_id === cat.id)
            .map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              fileSize: p.file_size,
              isFree: p.is_free,
              libraryPacks: [], // TODO: Add library packs support from database
              image: undefined
            }));

          return {
            id: cat.id,
            title: cat.name,
            subtitle: cat.description,
            icon: getIconForCategory(cat.icon),
            products: categoryProducts,
            helperText: cat.helper_text || undefined
          };
        });

        setCategories(transformedCategories);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load products. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        // Also remove all library packs for this product
        const product = categories
          .flatMap((cat) => cat.products)
          .find((p) => p.id === productId);
        if (product?.libraryPacks) {
          setSelectedLibraryPacks((prevPacks) => {
            const newPacks = new Set(prevPacks);
            product.libraryPacks!.forEach((pack) => newPacks.delete(pack.id));
            return newPacks;
          });
        }
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleLibraryPack = (packId: string) => {
    setSelectedLibraryPacks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packId)) {
        newSet.delete(packId);
      } else {
        newSet.add(packId);
      }
      return newSet;
    });
  };

  const selectFreeStudio = () => {
    const freeProducts = categories
      .flatMap((cat) => cat.products)
      .filter((p) => p.isFree)
      .map((p) => p.id);
    setSelectedItems(new Set(freeProducts));
    setSelectedLibraryPacks(new Set()); // Clear library packs when using free studio
  };

  const totalStorage = useMemo(() => {
    let storage = 0;

    categories.forEach((category) => {
      category.products.forEach((product) => {
        if (selectedItems.has(product.id)) {
          storage += product.fileSize;
          // Add selected library packs
          if (product.libraryPacks) {
            product.libraryPacks.forEach((pack) => {
              if (selectedLibraryPacks.has(pack.id)) {
                storage += pack.fileSize;
              }
            });
          }
        }
      });
    });

    return storage;
  }, [selectedItems, selectedLibraryPacks]);

  const canCalculatePrice =
    selectedItems.size > 0 &&
    storageType !== null &&
    storageCapacity !== null &&
    storageCapacity >= totalStorage;

  const getSelectedProducts = () => {
    return categories
      .flatMap((cat) => cat.products)
      .filter((p) => selectedItems.has(p.id));
  };

  const getSelectedLibraryPacksData = () => {
    const packs: LibraryPack[] = [];
    categories.forEach((category) => {
      category.products.forEach((product) => {
        if (product.libraryPacks && selectedItems.has(product.id)) {
          product.libraryPacks.forEach((pack) => {
            if (selectedLibraryPacks.has(pack.id)) {
              packs.push(pack);
            }
          });
        }
      });
    });
    return packs;
  };

  // Show checkout view
  if (isCheckout && storageCapacity !== null && storageType !== null && customerLocation) {
    return (
      <Checkout
        selectedProducts={getSelectedProducts()}
        selectedLibraryPacks={getSelectedLibraryPacksData()}
        storageType={storageType}
        storageCapacity={storageCapacity}
        totalStorage={totalStorage}
        customerLocation={customerLocation}
        onBack={() => setIsCheckout(false)}
      />
    );
  }

  // Show price calculation view
  if (showPriceCalculation && storageCapacity !== null && storageType !== null && customerLocation) {
    return (
      <PriceCalculation
        selectedProducts={getSelectedProducts()}
        selectedLibraryPacks={getSelectedLibraryPacksData()}
        storageType={storageType}
        storageCapacity={storageCapacity}
        totalStorage={totalStorage}
        customerLocation={customerLocation}
        onContinueToCheckout={() => {
          setShowPriceCalculation(false);
          setIsCheckout(true);
        }}
        onBack={() => setShowPriceCalculation(false)}
      />
    );
  }

  // Show location selection view
  if (showLocationSelection) {
    return (
      <LocationSelection
        onLocationSelected={(location) => {
          setCustomerLocation(location);
          setShowLocationSelection(false);
          setShowPriceCalculation(true);
        }}
        onBack={() => setShowLocationSelection(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300 text-lg">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Compact Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 relative z-10 border-b border-slate-700/30 pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-cyan-300 text-[10px] font-medium tracking-wide uppercase">AI-Powered Studio</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                {t('app.title')}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm hidden sm:block max-w-xl text-balance">
                {t('app.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end lg:self-center">
              <button
                onClick={selectFreeStudio}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">Free Starter</span>
              </button>
              <LanguageCurrencySelector />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {categories.map((category, index) => (
                <ProductSection
                  key={category.id}
                  category={category}
                  selectedItems={selectedItems}
                  onToggleItem={toggleItem}
                  selectedLibraryPacks={selectedLibraryPacks}
                  onToggleLibraryPack={toggleLibraryPack}
                  defaultExpanded={index === 0}
                />
              ))}
            </div>

            {/* Sidebar - Storage Selection & Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div id="storage-selector">
                  <StorageSelector
                    selectedType={storageType}
                    selectedCapacity={storageCapacity}
                    onTypeChange={setStorageType}
                    onCapacityChange={setStorageCapacity}
                  />
                </div>
                <CostSummary
                  totalStorage={totalStorage}
                  storageCapacity={storageCapacity}
                  storageType={storageType}
                />

                {/* Calculate Price Button */}
                {canCalculatePrice && (
                  <button
                    onClick={() => setShowLocationSelection(true)}
                    className="group relative w-full py-5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <Calculator className="w-6 h-6 text-white" />
                      <span className="text-white font-semibold text-lg">Calculate Price</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Sticky Action Bar */}
          <div className="lg:hidden fixed bottom-6 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 z-50 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Total Storage</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <span className={storageCapacity && totalStorage > storageCapacity ? 'text-red-400' : 'text-cyan-400'}>
                    {totalStorage < 1 ? (totalStorage * 1024).toFixed(0) + ' MB' : totalStorage.toFixed(1) + ' GB'}
                  </span>
                  {storageCapacity && (
                    <span className="text-sm text-slate-500 font-normal">/ {storageCapacity} GB</span>
                  )}
                </p>
              </div>
              {canCalculatePrice ? (
                <button
                  onClick={() => setShowLocationSelection(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  Calculate
                </button>
              ) : (
                <button
                  onClick={() => document.getElementById('storage-selector')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 bg-slate-800 rounded-xl text-slate-400 font-medium text-sm active:scale-95 transition-all border border-slate-700"
                >
                  Select Storage
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}