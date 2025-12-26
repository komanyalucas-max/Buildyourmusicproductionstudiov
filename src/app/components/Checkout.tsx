import { useState } from 'react';
import { ArrowLeft, Package, HardDrive, MapPin, User, CreditCard } from 'lucide-react';
import { Product, LibraryPack } from './StudioBuilder';
import { StorageType } from './StorageSelector';
import { getShippingCost } from './LocationSelection';

interface CheckoutProps {
  selectedProducts: Product[];
  selectedLibraryPacks: LibraryPack[];
  storageType: StorageType;
  storageCapacity: number;
  totalStorage: number;
  customerLocation: string;
  onBack: () => void;
}

export function Checkout({
  selectedProducts,
  selectedLibraryPacks,
  storageType,
  storageCapacity,
  totalStorage,
  customerLocation,
  onBack,
}: CheckoutProps) {
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePayment = () => {
    if (!customerName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order placed successfully! Thank you for your purchase.');
      onBack();
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio Builder
        </button>
        <h1 className="text-slate-900 mb-2">Checkout</h1>
        <p className="text-slate-600">Review your order and complete your purchase</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-slate-900">Selected Products</h2>
            </div>

            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div key={product.id}>
                  <div className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-slate-900">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.description}</p>
                    </div>
                    <div className="text-sm text-blue-600 ml-4">{formatStorage(product.fileSize)}</div>
                  </div>

                  {/* Library Packs for this product */}
                  {product.libraryPacks && selectedLibraryPacks.some((pack) =>
                    product.libraryPacks!.some((p) => p.id === pack.id)
                  ) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {selectedLibraryPacks
                        .filter((pack) => product.libraryPacks!.some((p) => p.id === pack.id))
                        .map((pack) => (
                          <div
                            key={pack.id}
                            className="flex items-start justify-between p-2 bg-purple-50 rounded-lg border border-purple-100"
                          >
                            <div className="flex-1">
                              <h4 className="text-sm text-slate-900">{pack.name}</h4>
                              <p className="text-xs text-slate-600">{pack.description}</p>
                            </div>
                            <div className="text-xs text-purple-600 ml-4">
                              {formatStorage(pack.fileSize)}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Storage Device */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <HardDrive className="w-5 h-5" />
              </div>
              <h2 className="text-slate-900">Storage Device</h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-900">{getStorageTypeName()}</h3>
                <span className="text-blue-600">
                  {storageCapacity >= 1000 ? `${storageCapacity / 1000} TB` : `${storageCapacity} GB`}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Total storage needed: {formatStorage(totalStorage)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-slate-900">Customer Information</h2>
            </div>

            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Delivery Location */}
              <div>
                <label htmlFor="location" className="block text-slate-700 mb-2">
                  Delivery Location
                </label>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span className="text-slate-900">{customerLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Order Total & Payment */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Products</span>
                  <span>{selectedProducts.length} items</span>
                </div>
                {selectedLibraryPacks.length > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Library Packs</span>
                    <span>{selectedLibraryPacks.length} packs</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Storage Device</span>
                  <span>1 unit</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-900">Total Storage</span>
                    <span className="text-slate-900">{formatStorage(totalStorage)}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !customerName.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                By completing your order, you agree to our terms of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}