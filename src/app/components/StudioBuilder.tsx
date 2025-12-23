import { useState, useMemo } from 'react';
import { Music, Wand2, Sliders, Library, Sparkles, Calculator } from 'lucide-react';
import { ProductSection } from './ProductSection';
import { CostSummary } from './CostSummary';
import { StorageSelector, StorageType } from './StorageSelector';
import { Checkout } from './Checkout';
import { PriceCalculation } from './PriceCalculation';
import { LocationSelection } from './LocationSelection';
import { LanguageCurrencySelector } from './LanguageCurrencySelector';
import { useLanguage } from '../contexts/LanguageContext';

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

const categories: Category[] = [
  {
    id: 'daw',
    title: 'DAW (Where You Make Music)',
    subtitle: 'Your main workspace for creating, recording, and arranging music',
    icon: <Music className="w-5 h-5" />,
    helperText: 'You usually only need one',
    products: [
      {
        id: 'reaper',
        name: 'Reaper',
        description: 'Lightweight, affordable, and powerful for beginners',
        fileSize: 0.3,
      },
      {
        id: 'fl-studio',
        name: 'FL Studio',
        description: 'Popular for electronic music and beats',
        fileSize: 4.5,
      },
      {
        id: 'ableton-live',
        name: 'Ableton Live Standard',
        description: 'Great for live performance and electronic music',
        fileSize: 3.2,
      },
      {
        id: 'logic-pro',
        name: 'Logic Pro (Mac only)',
        description: 'Professional DAW with tons of built-in sounds',
        fileSize: 6.8,
      },
      {
        id: 'garageband',
        name: 'GarageBand (Mac/iOS)',
        description: 'Simple and free, perfect for starting out',
        fileSize: 2.1,
        isFree: true,
      },
      {
        id: 'cakewalk',
        name: 'Cakewalk by BandLab',
        description: 'Full-featured free DAW for Windows',
        fileSize: 1.8,
        isFree: true,
      },
    ],
  },
  {
    id: 'instruments',
    title: 'Instruments (Sound Makers)',
    subtitle: 'Virtual instruments to create melodies, beats, and bass lines',
    icon: <Wand2 className="w-5 h-5" />,
    products: [
      {
        id: 'vital',
        name: 'Vital',
        description: 'Modern synth with beautiful interface, free version available',
        fileSize: 0.4,
        isFree: true,
        libraryPacks: [
          {
            id: 'vital-community-1',
            name: 'Community Presets Vol. 1',
            description: 'User-created preset pack for diverse sounds',
            fileSize: 0.2,
          },
          {
            id: 'vital-bass',
            name: 'Bass Collection',
            description: 'Deep bass presets for electronic music',
            fileSize: 0.15,
          },
          {
            id: 'vital-pads',
            name: 'Atmospheric Pads',
            description: 'Lush pad sounds for ambient production',
            fileSize: 0.18,
          },
        ],
      },
      {
        id: 'keyscape',
        name: 'Keyscape',
        description: 'Realistic piano and keyboard sounds',
        fileSize: 77,
        libraryPacks: [
          {
            id: 'keyscape-vintage',
            name: 'Vintage Keyboards',
            description: 'Classic Rhodes, Wurlitzer, and Clavinet',
            fileSize: 28.5,
          },
          {
            id: 'keyscape-modern',
            name: 'Modern Pianos',
            description: 'Contemporary grand and upright pianos',
            fileSize: 35.2,
          },
          {
            id: 'keyscape-hybrid',
            name: 'Hybrid & Cinematic',
            description: 'Processed and designed piano sounds',
            fileSize: 18.7,
          },
        ],
      },
      {
        id: 'serum',
        name: 'Serum',
        description: 'Industry-standard wavetable synth',
        fileSize: 0.3,
        libraryPacks: [
          {
            id: 'serum-bass',
            name: 'Bass Masterclass',
            description: 'Professional bass presets for all genres',
            fileSize: 0.4,
          },
          {
            id: 'serum-edm',
            name: 'EDM Essentials',
            description: 'Leads, plucks, and pads for dance music',
            fileSize: 0.5,
          },
          {
            id: 'serum-fx',
            name: 'Sound Effects Library',
            description: 'Risers, impacts, and transitions',
            fileSize: 0.3,
          },
          {
            id: 'serum-vocal',
            name: 'Vocal Chops & Textures',
            description: 'Processed vocal sounds and chops',
            fileSize: 0.35,
          },
        ],
      },
      {
        id: 'kontakt',
        name: 'Kontakt 7',
        description: 'Sampler platform with huge library',
        fileSize: 42,
        libraryPacks: [
          {
            id: 'kontakt-yamaha',
            name: 'Yamaha C7 Grand Piano',
            description: 'Premium sampled Yamaha concert grand',
            fileSize: 18.5,
          },
          {
            id: 'kontakt-damage',
            name: 'Damage',
            description: 'Epic drums and percussion for cinematic tracks',
            fileSize: 24.2,
          },
          {
            id: 'kontakt-guitars',
            name: 'Session Guitarist',
            description: 'Acoustic and electric guitar phrases',
            fileSize: 15.7,
          },
          {
            id: 'kontakt-strings',
            name: 'Session Strings',
            description: 'Professional orchestral string ensemble',
            fileSize: 32.4,
          },
          {
            id: 'kontakt-brass',
            name: 'Session Brass',
            description: 'Dynamic brass section for any style',
            fileSize: 22.8,
          },
        ],
      },
      {
        id: 'labs',
        name: 'Spitfire LABS',
        description: 'Free collection of beautiful instrument sounds',
        fileSize: 3.5,
        isFree: true,
        libraryPacks: [
          {
            id: 'labs-strings',
            name: 'Soft Piano & Strings',
            description: 'Gentle orchestral textures',
            fileSize: 2.1,
          },
          {
            id: 'labs-ambient',
            name: 'Ambient Pads',
            description: 'Ethereal soundscapes and textures',
            fileSize: 1.8,
          },
          {
            id: 'labs-frozen',
            name: 'Frozen Strings',
            description: 'Icy and atmospheric string sounds',
            fileSize: 2.3,
          },
        ],
      },
    ],
  },
  {
    id: 'effects',
    title: 'Effects & Audio Tools (Sound Shapers)',
    subtitle: 'Tools to polish, shape, and enhance your sounds',
    icon: <Sliders className="w-5 h-5" />,
    products: [
      {
        id: 'valhalla-vintage',
        name: 'Valhalla Vintage Verb',
        description: 'Beautiful reverb plugin, very popular',
        fileSize: 0.05,
        libraryPacks: [
          {
            id: 'valhalla-presets-vol1',
            name: 'Producer Presets Vol. 1',
            description: 'Curated reverb presets from top producers',
            fileSize: 0.02,
          },
          {
            id: 'valhalla-vintage-collection',
            name: 'Vintage Spaces',
            description: 'Classic reverb algorithms and settings',
            fileSize: 0.03,
          },
        ],
      },
      {
        id: 'fabfilter-pro-q',
        name: 'FabFilter Pro-Q 3',
        description: 'Professional EQ for precision sound shaping',
        fileSize: 0.1,
        libraryPacks: [
          {
            id: 'fabfilter-mixing',
            name: 'Mixing Presets Pack',
            description: 'Starting points for vocals, drums, and instruments',
            fileSize: 0.05,
          },
          {
            id: 'fabfilter-mastering',
            name: 'Mastering Templates',
            description: 'Professional mastering EQ chains',
            fileSize: 0.04,
          },
          {
            id: 'fabfilter-creative',
            name: 'Creative FX',
            description: 'Unique sound design and effects',
            fileSize: 0.03,
          },
        ],
      },
      {
        id: 'soundtoys-bundle',
        name: 'Soundtoys 5',
        description: 'Creative effects bundle for character and color',
        fileSize: 1.2,
        libraryPacks: [
          {
            id: 'soundtoys-vintage',
            name: 'Vintage Character Pack',
            description: 'Analog-style warmth and saturation presets',
            fileSize: 0.3,
          },
          {
            id: 'soundtoys-modulation',
            name: 'Modulation Suite',
            description: 'Chorus, flanger, and phaser presets',
            fileSize: 0.25,
          },
          {
            id: 'soundtoys-delay',
            name: 'Delay & Echo Collection',
            description: 'Creative delay and echo settings',
            fileSize: 0.28,
          },
        ],
      },
      {
        id: 'izotope-ozone',
        name: 'iZotope Ozone Elements',
        description: 'AI-powered mastering assistant',
        fileSize: 0.8,
        libraryPacks: [
          {
            id: 'izotope-genre-masters',
            name: 'Genre Mastering Presets',
            description: 'Optimized settings for different music styles',
            fileSize: 0.15,
          },
          {
            id: 'izotope-loudness',
            name: 'Loudness Templates',
            description: 'Streaming platform ready masters',
            fileSize: 0.12,
          },
        ],
      },
      {
        id: 'free-effects',
        name: 'TDR Nova (Free)',
        description: 'Professional-quality free dynamic EQ',
        fileSize: 0.02,
        isFree: true,
        libraryPacks: [
          {
            id: 'tdr-vocal',
            name: 'Vocal Processing',
            description: 'Ready-to-use vocal EQ presets',
            fileSize: 0.01,
          },
          {
            id: 'tdr-drums',
            name: 'Drum Shaping',
            description: 'Punchy drum and percussion settings',
            fileSize: 0.01,
          },
        ],
      },
    ],
  },
  {
    id: 'samples',
    title: 'Samples & Creative Tools',
    subtitle: 'Pre-made sounds, loops, and one-shot samples for inspiration',
    icon: <Library className="w-5 h-5" />,
    products: [
      {
        id: 'splice',
        name: 'Splice Sounds',
        description: 'Huge library of royalty-free samples and loops',
        fileSize: 15,
      },
      {
        id: 'loopcloud',
        name: 'Loopcloud',
        description: 'Sample browser and manager with AI features',
        fileSize: 8,
      },
      {
        id: 'freesound',
        name: 'Freesound.org',
        description: 'Community-driven free sound library',
        fileSize: 0.1,
        isFree: true,
      },
      {
        id: 'output-arcade',
        name: 'Output Arcade',
        description: 'Loop and kit player with fresh content monthly',
        fileSize: 12,
      },
    ],
  },
];

export function StudioBuilder() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedLibraryPacks, setSelectedLibraryPacks] = useState<Set<string>>(new Set());
  const [storageType, setStorageType] = useState<StorageType>(null);
  const [storageCapacity, setStorageCapacity] = useState<number | null>(null);
  const [customerLocation, setCustomerLocation] = useState<string>('');
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [showPriceCalculation, setShowPriceCalculation] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const { t } = useLanguage();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Language & Currency Selector - Top Right */}
      <div className="flex justify-end mb-6 relative z-10">
        <LanguageCurrencySelector />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full mb-6">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-300 text-sm">AI-Powered Studio Builder</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {t('app.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          {t('app.subtitle')}
        </p>
      </div>

      {/* Free Starter Button */}
      <div className="mb-12 flex justify-center relative z-10">
        <button
          onClick={selectFreeStudio}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <Sparkles className="w-6 h-6 text-white relative z-10" />
          <span className="text-white font-semibold relative z-10">Free Starter Studio</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map((category) => (
            <ProductSection
              key={category.id}
              category={category}
              selectedItems={selectedItems}
              onToggleItem={toggleItem}
              selectedLibraryPacks={selectedLibraryPacks}
              onToggleLibraryPack={toggleLibraryPack}
            />
          ))}
        </div>

        {/* Sidebar - Storage Selection & Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <StorageSelector
              selectedType={storageType}
              selectedCapacity={storageCapacity}
              onTypeChange={setStorageType}
              onCapacityChange={setStorageCapacity}
            />
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
    </div>
  );
}