import { useState, useEffect } from 'react';
import { Check, Package, HardDrive, ArrowRight, Sparkles, Truck, User, Mail } from 'lucide-react';
import { Product, LibraryPack } from './StudioBuilder';
import { StorageType } from './StorageSelector';
import { getShippingCost } from './LocationSelection';
import { useLanguage } from '../contexts/LanguageContext';

interface PriceCalculationProps {
  selectedProducts: Product[];
  selectedLibraryPacks: LibraryPack[];
  storageType: StorageType;
  storageCapacity: number;
  totalStorage: number;
  customerLocation: string;
  onContinueToCheckout: () => void;
  onBack: () => void;
}

// Pricing logic
const getProductPrice = (product: Product): number => {
  // Free products cost $0
  if (product.isFree) return 0;

  // Simple pricing based on product ID (you can customize this)
  const priceMap: Record<string, number> = {
    'reaper': 60,
    'fl-studio': 199,
    'ableton-live': 449,
    'logic-pro': 199,
    'keyscape': 399,
    'serum': 189,
    'kontakt': 399,
    'valhalla-vintage': 50,
    'fabfilter-pro-q': 179,
    'soundtoys-bundle': 499,
    'izotope-ozone': 129,
    'splice': 9.99,
    'loopcloud': 14.99,
    'output-arcade': 9.99,
  };

  return priceMap[product.id] || 99;
};

const getLibraryPackPrice = (pack: LibraryPack): number => {
  // Library packs pricing
  const priceMap: Record<string, number> = {
    // Kontakt packs
    'kontakt-yamaha': 149,
    'kontakt-damage': 199,
    'kontakt-guitars': 99,
    'kontakt-strings': 299,
    'kontakt-brass': 249,

    // Vital packs
    'vital-community-1': 0, // Free
    'vital-bass': 29,
    'vital-pads': 29,

    // Keyscape packs
    'keyscape-vintage': 149,
    'keyscape-modern': 179,
    'keyscape-hybrid': 99,

    // Serum packs
    'serum-bass': 49,
    'serum-edm': 49,
    'serum-fx': 39,
    'serum-vocal': 45,

    // LABS packs
    'labs-strings': 0, // Free
    'labs-ambient': 0, // Free
    'labs-frozen': 0, // Free

    // Valhalla packs
    'valhalla-presets-vol1': 15,
    'valhalla-vintage-collection': 20,

    // FabFilter packs
    'fabfilter-mixing': 29,
    'fabfilter-mastering': 29,
    'fabfilter-creative': 25,

    // Soundtoys packs
    'soundtoys-vintage': 39,
    'soundtoys-modulation': 35,
    'soundtoys-delay': 35,

    // iZotope packs
    'izotope-genre-masters': 25,
    'izotope-loudness': 20,

    // TDR packs
    'tdr-vocal': 0, // Free
    'tdr-drums': 0, // Free
  };

  return priceMap[pack.id] || 49;
};

const getStoragePrice = (type: StorageType, capacity: number): number => {
  if (!type) return 0;

  const prices: Record<string, Record<number, number>> = {
    'usb': { 32: 15, 64: 25, 128: 40 },
    'hdd': { 256: 45, 500: 60, 1000: 80, 2000: 120 },
    'sata-ssd': { 256: 50, 500: 75, 1000: 110, 2000: 200 },
    'nvme-ssd': { 256: 70, 500: 100, 1000: 150, 2000: 280 },
  };

  return prices[type]?.[capacity] || 0;
};

// Helper function to get product image
const getProductImage = (productId: string): string => {
  const imageMap: Record<string, string> = {
    // DAWs
    'reaper': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'fl-studio': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'ableton-live': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'logic-pro': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'garageband': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'cakewalk': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',

    // Instruments
    'vital': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'keyscape': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'serum': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'kontakt': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'labs': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',

    // Effects
    'valhalla-vintage': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'fabfilter-pro-q': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'soundtoys-bundle': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'izotope-ozone': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'free-effects': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',

    // Samples
    'splice': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'loopcloud': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'freesound': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'output-arcade': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
  };

  return imageMap[productId] || 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400';
};

// Helper function to get library pack image
const getLibraryPackImage = (packId: string): string => {
  // Use different images for different types of library packs
  const imageMap: Record<string, string> = {
    // Sound wave/audio visualization for most packs
    default: 'https://images.unsplash.com/photo-1692838952665-a7a9577fde9e?w=400',
    // Music library/studio for sound libraries
    library: 'https://images.unsplash.com/photo-1566918230723-378f6e7878d7?w=400',
    // Vinyl for vintage/classic packs
    vintage: 'https://images.unsplash.com/photo-1603850121303-d4ade9e5ba65?w=400',
    // DAW screen for preset packs
    preset: 'https://images.unsplash.com/photo-1763336333573-e1f656aa3255?w=400',
  };

  // Categorize packs by type
  if (packId.includes('vintage') || packId.includes('classic')) {
    return imageMap.vintage;
  } else if (packId.includes('preset') || packId.includes('community')) {
    return imageMap.preset;
  } else if (packId.includes('strings') || packId.includes('brass') || packId.includes('piano') || packId.includes('guitar')) {
    return imageMap.library;
  }

  return imageMap.default;
};

export function PriceCalculation({
  selectedProducts: selectedProductsSet,
  selectedLibraryPacks: selectedLibraryPacksSet,
  storageType,
  storageCapacity,
  totalStorage,
  customerLocation,
  onContinueToCheckout,
  onBack,
}: PriceCalculationProps) {
  const [isCalculating, setIsCalculating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Convert Sets to Arrays for easier manipulation
  const selectedProducts = Array.from(selectedProductsSet || []);
  const selectedLibraryPacks = Array.from(selectedLibraryPacksSet || []);

  useEffect(() => {
    if (isCalculating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsCalculating(false), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isCalculating]);

  const productsTotal = selectedProducts.reduce((sum, product) => sum + getProductPrice(product), 0);
  const libraryPacksTotal = selectedLibraryPacks.reduce((sum, pack) => sum + getLibraryPackPrice(pack), 0);
  const storagePrice = getStoragePrice(storageType, storageCapacity || 0);
  const subtotal = productsTotal + libraryPacksTotal + storagePrice;
  const shippingCost = getShippingCost(customerLocation);
  const total = subtotal + shippingCost;

  const handleOrderNow = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please fill in your name and email to continue');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Proceed with checkout
    onContinueToCheckout();
  };

  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const getStorageTypeName = () => {
    switch (storageType) {
      case 'usb':
        return 'USB Flash Drive';
      case 'hdd':
        return 'Hard Drive';
      case 'sata-ssd':
        return 'SATA SSD';
      case 'nvme-ssd':
        return 'NVMe SSD';
      default:
        return 'Unknown';
    }
  };

  // Loading state
  if (isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-xl opacity-75 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Calculating Your Total
            </h2>
            <p className="text-slate-300">Please wait while we process your selection...</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-slate-700/50 backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full shadow-lg shadow-purple-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-3">
              {progress}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Price summary state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-75" />
            <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            Your Studio Summary
          </h1>
          <p className="text-slate-300">
            Here's everything you've selected for your music production setup
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gallery Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* Products Gallery */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-indigo-500/30">
                  <Package className="w-5 h-5 text-indigo-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Products</h2>
                <span className="ml-auto px-3 py-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 rounded-full text-sm">
                  {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {selectedProducts.map((product) => {
                  const productImage = getProductImage(product.id);
                  const hasLibraryPacks = product.libraryPacks && selectedLibraryPacks.some((pack) =>
                    product.libraryPacks!.some((p) => p.id === pack.id)
                  );

                  return (
                    <div key={product.id} className="group">
                      <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all">
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                          {/* FREE Badge */}
                          {product.isFree && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 backdrop-blur-sm rounded-full border border-emerald-400/50 shadow-lg">
                              <span className="text-white text-xs font-bold">FREE</span>
                            </div>
                          )}

                          {/* Library Pack Indicator */}
                          {hasLibraryPacks && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-fuchsia-500/80 to-purple-500/80 backdrop-blur-sm rounded-full border border-fuchsia-400/50 shadow-lg">
                              <span className="text-white text-xs font-bold">+ Packs</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                              {formatStorage(product.fileSize)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Library Packs for this product */}
                      {hasLibraryPacks && (
                        <div className="mt-3 ml-4 space-y-2">
                          {selectedLibraryPacks
                            .filter((pack) => product.libraryPacks!.some((p) => p.id === pack.id))
                            .map((pack) => {
                              const packImage = getLibraryPackImage(pack.id);
                              const packPrice = getLibraryPackPrice(pack);
                              const isFree = packPrice === 0;

                              return (
                                <div
                                  key={pack.id}
                                  className="group/pack relative bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-fuchsia-500/30 overflow-hidden hover:border-fuchsia-500/50 transition-all"
                                >
                                  <div className="flex items-center gap-3 p-3">
                                    {/* Pack Thumbnail */}
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                      <img
                                        src={packImage}
                                        alt={pack.name}
                                        className="w-full h-full object-cover group-hover/pack:scale-110 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

                                      {/* Free badge on thumbnail */}
                                      {isFree && (
                                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-emerald-500 rounded text-[10px] font-bold text-white">
                                          FREE
                                        </div>
                                      )}
                                    </div>

                                    {/* Pack Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full flex-shrink-0" />
                                        <h4 className="text-sm text-white font-medium truncate">{pack.name}</h4>
                                      </div>
                                      <p className="text-xs text-slate-400">{formatStorage(pack.fileSize)}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Storage Section */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30">
                      <HardDrive className="w-5 h-5 text-blue-300" />
                    </div>
                    <h2 className="text-white font-semibold">Storage Device</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-300 font-medium">{getStorageTypeName()}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {storageCapacity >= 1000 ? `${storageCapacity / 1000} TB` : `${storageCapacity} GB`}
                    </h3>
                    <div className="pt-3 border-t border-slate-700/50">
                      <p className="text-sm text-slate-400">
                        {formatStorage(totalStorage)} used of {storageCapacity >= 1000 ? `${storageCapacity / 1000} TB` : `${storageCapacity} GB`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Section */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl border border-purple-500/30">
                      <Truck className="w-5 h-5 text-purple-300" />
                    </div>
                    <h2 className="text-white font-semibold">Shipping</h2>
                  </div>

                  <div>
                    <h3 className="text-white mb-1">Delivery Location</h3>
                    <p className="text-sm text-slate-400">{customerLocation}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 bg-slate-900/50 backdrop-blur-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Products & Tools</span>
                      <span className="text-slate-300">${(productsTotal + libraryPacksTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Storage Device</span>
                      <span className="text-slate-300">${storagePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shipping</span>
                      <span className="text-slate-300">${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-700/50 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-white font-semibold">Total Amount</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details Form */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-indigo-500/30">
                      <User className="w-5 h-5 text-indigo-300" />
                    </div>
                    <h2 className="text-white font-semibold">Client Details</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label htmlFor="customer-name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                          id="customer-name"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="customer-email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-slate-500" />
                        </div>
                        <input
                          id="customer-email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOrderNow}
                  className="group relative w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2">
                    <span className="font-semibold">Order Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-4 px-6 bg-slate-800/50 backdrop-blur-xl text-slate-300 rounded-2xl border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all"
                >
                  Back to Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}