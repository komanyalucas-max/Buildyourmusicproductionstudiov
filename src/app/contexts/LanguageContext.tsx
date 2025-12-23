import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'sw';
export type Currency = 'USD' | 'TZS';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'Build Your Music Production Studio',
    'app.subtitle': 'Select the perfect tools for your music journey',
    
    // Language & Currency
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    
    // Categories
    'category.daw.title': 'DAW (Where You Make Music)',
    'category.daw.subtitle': 'Your main workspace for creating, recording, and arranging music',
    'category.daw.helper': 'You usually only need one',
    
    'category.instruments.title': 'Instruments (Sound Makers)',
    'category.instruments.subtitle': 'Virtual instruments to create melodies, beats, and bass lines',
    
    'category.effects.title': 'Effects & Audio Tools',
    'category.effects.subtitle': 'Plugins to polish and enhance your sound',
    
    'category.samples.title': 'Samples & Creative Tools',
    'category.samples.subtitle': 'Pre-made sounds and loops to speed up your workflow',
    
    // Product labels
    'product.free': 'FREE',
    'product.packs': '+ Packs',
    'product.libraryPacks': 'Library Packs',
    
    // Storage
    'storage.title': 'Choose Your Storage Device',
    'storage.subtitle': 'Select where you\'ll store all your music tools',
    'storage.totalNeeded': 'Total Storage Needed',
    'storage.recommended': 'Recommended',
    'storage.capacity': 'Capacity',
    'storage.device': 'Storage Device',
    'storage.used': 'used of',
    
    'storage.usb': 'USB Flash Drive',
    'storage.hdd': 'Hard Drive (HDD)',
    'storage.sata': 'SATA SSD',
    'storage.nvme': 'NVMe SSD',
    
    // Location
    'location.title': 'Where Should We Ship?',
    'location.subtitle': 'Choose your delivery location',
    'location.primary': 'Choose Location',
    'location.secondary': 'Select Region/Country',
    'location.tanzania': 'Tanzania',
    'location.other': 'Other Countries',
    
    // Tanzania regions
    'region.dar': 'Dar es Salaam',
    'region.arusha': 'Arusha',
    'region.mwanza': 'Mwanza',
    'region.dodoma': 'Dodoma',
    'region.mbeya': 'Mbeya',
    'region.zanzibar': 'Zanzibar',
    
    // Other countries
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.congo': 'Congo',
    'country.ethiopia': 'Ethiopia',
    'country.somalia': 'Somalia',
    'country.malawi': 'Malawi',
    
    // Summary
    'summary.title': 'Your Studio Summary',
    'summary.subtitle': 'Here\'s everything you\'ve selected for your music production setup',
    'summary.calculating': 'Calculating Your Total',
    'summary.wait': 'Please wait while we process your selection...',
    'summary.yourProducts': 'Your Products',
    'summary.items': 'items',
    'summary.item': 'item',
    
    // Price breakdown
    'price.products': 'Products & Tools',
    'price.storage': 'Storage Device',
    'price.shipping': 'Shipping',
    'price.total': 'Total Amount',
    'price.deliveryLocation': 'Delivery Location',
    
    // Client details
    'client.title': 'Client Details',
    'client.name': 'Full Name',
    'client.email': 'Email Address',
    'client.namePlaceholder': 'Enter your full name',
    'client.emailPlaceholder': 'your.email@example.com',
    
    // Buttons
    'button.continue': 'Continue',
    'button.back': 'Back to Selection',
    'button.orderNow': 'Order Now',
    'button.viewSummary': 'View Summary & Checkout',
    
    // Messages
    'message.fillDetails': 'Please fill in your name and email to continue',
    'message.validEmail': 'Please enter a valid email address',
    'message.selectProducts': 'Please select at least one product',
    'message.selectStorage': 'Please select a storage device',
    'message.selectLocation': 'Please select your delivery location',
  },
  sw: {
    // Header
    'app.title': 'Jenga Studio Yako ya Kutengeneza Muziki',
    'app.subtitle': 'Chagua zana kamili kwa safari yako ya muziki',
    
    // Language & Currency
    'settings.language': 'Lugha',
    'settings.currency': 'Sarafu',
    
    // Categories
    'category.daw.title': 'DAW (Mahali Unapotengeneza Muziki)',
    'category.daw.subtitle': 'Eneo lako kuu la kuunda, kurekodi, na kupanga muziki',
    'category.daw.helper': 'Kwa kawaida unahitaji moja tu',
    
    'category.instruments.title': 'Vyombo vya Muziki (Vatengenezaji Sauti)',
    'category.instruments.subtitle': 'Vyombo vya dijiti vya kuunda melodi, mapigo, na mistari ya bass',
    
    'category.effects.title': 'Athari na Zana za Sauti',
    'category.effects.subtitle': 'Programu za kuboresha na kuongeza ubora wa sauti yako',
    
    'category.samples.title': 'Sampuli na Zana za Ubunifu',
    'category.samples.subtitle': 'Sauti zilizotayarishwa na loops ili kuharakisha mchakato wako',
    
    // Product labels
    'product.free': 'BURE',
    'product.packs': '+ Vifurushi',
    'product.libraryPacks': 'Vifurushi vya Maktaba',
    
    // Storage
    'storage.title': 'Chagua Kifaa chako cha Kuhifadhi',
    'storage.subtitle': 'Chagua mahali utakopohifadhi zana zako zote za muziki',
    'storage.totalNeeded': 'Jumla ya Nafasi Inayohitajika',
    'storage.recommended': 'Inashauriwa',
    'storage.capacity': 'Uwezo',
    'storage.device': 'Kifaa cha Kuhifadhi',
    'storage.used': 'imetumika kati ya',
    
    'storage.usb': 'USB Flash Drive',
    'storage.hdd': 'Hard Drive (HDD)',
    'storage.sata': 'SATA SSD',
    'storage.nvme': 'NVMe SSD',
    
    // Location
    'location.title': 'Tulete Wapi?',
    'location.subtitle': 'Chagua eneo lako la uwasilishaji',
    'location.primary': 'Chagua Eneo',
    'location.secondary': 'Chagua Mkoa/Nchi',
    'location.tanzania': 'Tanzania',
    'location.other': 'Nchi Nyingine',
    
    // Tanzania regions
    'region.dar': 'Dar es Salaam',
    'region.arusha': 'Arusha',
    'region.mwanza': 'Mwanza',
    'region.dodoma': 'Dodoma',
    'region.mbeya': 'Mbeya',
    'region.zanzibar': 'Zanzibar',
    
    // Other countries
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.congo': 'Congo',
    'country.ethiopia': 'Ethiopia',
    'country.somalia': 'Somalia',
    'country.malawi': 'Malawi',
    
    // Summary
    'summary.title': 'Muhtasari wa Studio Yako',
    'summary.subtitle': 'Hapa kuna kila kitu ulichochagua kwa mfumo wako wa kutengeneza muziki',
    'summary.calculating': 'Tunahesabu Jumla Yako',
    'summary.wait': 'Tafadhali subiri tunapochakata uchaguzi wako...',
    'summary.yourProducts': 'Bidhaa Zako',
    'summary.items': 'vitu',
    'summary.item': 'kitu',
    
    // Price breakdown
    'price.products': 'Bidhaa na Zana',
    'price.storage': 'Kifaa cha Kuhifadhi',
    'price.shipping': 'Usafirishaji',
    'price.total': 'Jumla ya Malipo',
    'price.deliveryLocation': 'Eneo la Uwasilishaji',
    
    // Client details
    'client.title': 'Maelezo ya Mteja',
    'client.name': 'Jina Kamili',
    'client.email': 'Anwani ya Barua Pepe',
    'client.namePlaceholder': 'Ingiza jina lako kamili',
    'client.emailPlaceholder': 'barua.pepe@mfano.com',
    
    // Buttons
    'button.continue': 'Endelea',
    'button.back': 'Rudi Kwa Uchaguzi',
    'button.orderNow': 'Oda Sasa',
    'button.viewSummary': 'Tazama Muhtasari na Lipia',
    
    // Messages
    'message.fillDetails': 'Tafadhali jaza jina na barua pepe yako ili kuendelea',
    'message.validEmail': 'Tafadhali ingiza anwani sahihi ya barua pepe',
    'message.selectProducts': 'Tafadhali chagua angalau bidhaa moja',
    'message.selectStorage': 'Tafadhali chagua kifaa cha kuhifadhi',
    'message.selectLocation': 'Tafadhali chagua eneo lako la uwasilishaji',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const formatPrice = (price: number): string => {
    if (currency === 'TZS') {
      // Convert USD to TZS (approximately 1 USD = 2,500 TZS)
      const tzsPrice = price * 2500;
      return `${tzsPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })} TZS`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
