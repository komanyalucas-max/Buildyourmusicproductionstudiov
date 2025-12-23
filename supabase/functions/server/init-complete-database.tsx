import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

/**
 * Complete Database Initialization Script
 * Populates the KV store with a full, structured dataset
 */

async function initializeCompleteDatabase() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing environment variables');
    Deno.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🚀 Starting Complete Database Initialization...\n');
  console.log('═══════════════════════════════════════════════\n');

  // ============================================
  // 1. SYSTEM SETTINGS
  // ============================================
  console.log('⚙️  Setting up system configuration...');

  const shippingRates = {
    Tanzania: {
      'Dar es Salaam': 5,
      'Dodoma': 8,
      'Arusha': 10,
      'Mwanza': 12,
      'Zanzibar': 15,
      'Other': 10,
    },
    Kenya: {
      'Nairobi': 15,
      'Mombasa': 18,
      'Other': 20,
    },
    Uganda: {
      'Kampala': 20,
      'Other': 25,
    },
    Rwanda: {
      'Kigali': 25,
      'Other': 30,
    },
    Burundi: {
      'Bujumbura': 30,
      'Other': 35,
    },
  };

  await kv.set('settings:shipping_rates', shippingRates);
  await kv.set('settings:currency_rate', { usd_to_tzs: 2500 });
  await kv.set('settings:tax_rate', { rate: 0.18, name: 'VAT' }); // 18% VAT
  
  console.log('  ✅ Shipping rates configured for 5 countries');
  console.log('  ✅ Currency rate: 1 USD = 2500 TZS');
  console.log('  ✅ Tax rate: 18% VAT\n');

  // ============================================
  // 2. DEMO USERS
  // ============================================
  console.log('👥 Creating demo users...');

  const demoUsers = [
    {
      email: 'admin@gmail.com',
      password: 'pass@123',
      metadata: { 
        name: 'Super Admin', 
        role: 'admin',
        phone: '+255 700 000 001',
        country: 'Tanzania'
      },
    },
    {
      email: 'customer1@example.com',
      password: 'demo123',
      metadata: { 
        name: 'John Doe', 
        role: 'customer',
        phone: '+255 123 456 789',
        country: 'Tanzania',
        city: 'Dar es Salaam'
      },
    },
    {
      email: 'customer2@example.com',
      password: 'demo123',
      metadata: { 
        name: 'Jane Smith', 
        role: 'customer',
        phone: '+255 987 654 321',
        country: 'Kenya',
        city: 'Nairobi'
      },
    },
    {
      email: 'producer@example.com',
      password: 'demo123',
      metadata: { 
        name: 'Michael Producer', 
        role: 'customer',
        phone: '+256 700 123 456',
        country: 'Uganda',
        city: 'Kampala'
      },
    },
  ];

  let userCount = 0;
  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.metadata,
      });

      if (error && !error.message.includes('already been registered')) {
        console.error(`  ❌ Error creating ${user.email}:`, error.message);
      } else if (error) {
        console.log(`  ℹ️  ${user.email} already exists`);
        userCount++;
      } else {
        console.log(`  ✅ Created: ${user.email} (${user.metadata.name})`);
        userCount++;
        
        // Store additional user metadata in KV store
        if (data.user) {
          await kv.set(`user:${data.user.id}`, {
            id: data.user.id,
            email: user.email,
            ...user.metadata,
            created_at: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`  ❌ Error with ${user.email}:`, err);
    }
  }
  
  console.log(`\n  📊 Total users: ${userCount}\n`);

  // ============================================
  // 3. CATEGORIES
  // ============================================
  console.log('📁 Creating product categories...');

  const categories = [
    {
      id: 'cat_1',
      name: 'DAW (Where You Make Music)',
      name_sw: 'DAW (Programu Kuu ya Kutengeneza Muziki)',
      description: 'Your main workspace for creating, recording, and arranging music',
      description_sw: 'Programu kuu ya kurekodi na kuandaa muziki',
      icon: 'Music',
      helper_text: 'You usually only need one',
      helper_text_sw: 'Kwa kawaida unahitaji moja tu',
      order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_2',
      name: 'Instruments (Sound Makers)',
      name_sw: 'Vyombo vya Muziki (Vya Dijitali)',
      description: 'Virtual instruments to create melodies, beats, and bass lines',
      description_sw: 'Vyombo vya dijitali vya kutengeneza sauti na midundo',
      icon: 'Wand2',
      helper_text: '',
      helper_text_sw: '',
      order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_3',
      name: 'Effects & Audio Tools',
      name_sw: 'Zana za Kuboresha Sauti',
      description: 'Polish your sound with effects and mixing tools',
      description_sw: 'Kuboresha na kuchanganya sauti kwa ubora',
      icon: 'Sliders',
      helper_text: '',
      helper_text_sw: '',
      order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_4',
      name: 'Samples & Creative Tools',
      name_sw: 'Sampuli na Zana za Ubunifu',
      description: 'Ready-made sounds and creative utilities',
      description_sw: 'Sauti tayari na zana za ubunifu',
      icon: 'Library',
      helper_text: '',
      helper_text_sw: '',
      order: 4,
      created_at: new Date().toISOString(),
    },
  ];

  for (const category of categories) {
    await kv.set(`category:${category.id}`, category);
    console.log(`  ✅ ${category.name}`);
  }
  
  console.log(`\n  📊 Total categories: ${categories.length}\n`);

  // ============================================
  // 4. PRODUCTS
  // ============================================
  console.log('📦 Creating products...');

  const products = [
    // ============== DAW Products ==============
    {
      id: 'prod_1',
      category_id: 'cat_1',
      name: 'Reaper',
      description: 'Lightweight, affordable, and powerful for beginners. Full-featured DAW with low system requirements.',
      file_size: 0.3,
      is_free: false,
      price: 60,
      image: '',
      features: ['Multi-track recording', 'VST/AU plugin support', '64-bit mixing', 'Customizable interface'],
      system_requirements: 'Windows 7+, macOS 10.5+, Linux',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_2',
      category_id: 'cat_1',
      name: 'FL Studio',
      description: 'Popular for electronic music and beats. Intuitive pattern-based workflow.',
      file_size: 4.5,
      is_free: false,
      price: 199,
      image: '',
      features: ['Step sequencer', 'Piano roll', 'Mixer', 'Lifetime free updates'],
      system_requirements: 'Windows 8.1+, macOS 10.13.6+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_3',
      category_id: 'cat_1',
      name: 'Ableton Live Standard',
      description: 'Great for live performance and electronic music. Session and arrangement views.',
      file_size: 3.2,
      is_free: false,
      price: 449,
      image: '',
      features: ['Session view', 'Audio warping', 'MIDI effects', 'Max for Live'],
      system_requirements: 'Windows 10+, macOS 10.13.6+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_4',
      category_id: 'cat_1',
      name: 'Logic Pro (Mac only)',
      description: 'Professional DAW with tons of built-in sounds and effects. Mac exclusive.',
      file_size: 6.8,
      is_free: false,
      price: 199,
      image: '',
      features: ['90GB sound library', 'Dolby Atmos mixing', 'Smart Tempo', 'Live Loops'],
      system_requirements: 'macOS 12.3+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_5',
      category_id: 'cat_1',
      name: 'GarageBand (Mac/iOS)',
      description: 'Simple and free, perfect for starting out. Great for beginners.',
      file_size: 2.1,
      is_free: true,
      price: 0,
      image: '',
      features: ['Touch instruments', 'Live Loops', 'Sound library', 'Easy to use'],
      system_requirements: 'macOS 12.3+, iOS 15+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_6',
      category_id: 'cat_1',
      name: 'Cakewalk by BandLab',
      description: 'Full-featured free DAW for Windows. Professional-grade recording.',
      file_size: 1.8,
      is_free: true,
      price: 0,
      image: '',
      features: ['Unlimited tracks', 'VST3 support', 'ProChannel', 'Advanced MIDI'],
      system_requirements: 'Windows 10+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_7',
      category_id: 'cat_1',
      name: 'Studio One Professional',
      description: 'Modern DAW with powerful mixing console and mastering suite.',
      file_size: 5.5,
      is_free: false,
      price: 399,
      image: '',
      features: ['Drag & drop workflow', 'Chord track', 'Mastering suite', 'Cloud collaboration'],
      system_requirements: 'Windows 10+, macOS 10.13+',
      created_at: new Date().toISOString(),
    },

    // ============== Instrument Products ==============
    {
      id: 'prod_8',
      category_id: 'cat_2',
      name: 'Vital',
      description: 'Modern wavetable synth with beautiful interface, free version available.',
      file_size: 0.4,
      is_free: true,
      price: 0,
      image: '',
      features: ['Wavetable synthesis', 'Visual feedback', 'Modulation', '170+ presets (free)'],
      system_requirements: 'Windows 7+, macOS 10.12+, Linux',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_9',
      category_id: 'cat_2',
      name: 'Serum',
      description: 'Industry-standard wavetable synth used by top producers worldwide.',
      file_size: 1.2,
      is_free: false,
      price: 189,
      image: '',
      features: ['Visual wavetables', 'Ultra-clean sound', 'Real-time wavetable manipulation', '450+ presets'],
      system_requirements: 'Windows 7+, macOS 10.8+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_10',
      category_id: 'cat_2',
      name: 'Kontakt 7',
      description: 'Industry-leading sampler with massive sound library ecosystem.',
      file_size: 50,
      is_free: false,
      price: 399,
      image: '',
      features: ['55GB factory library', 'Advanced scripting', 'Time-stretching', '1000+ instruments'],
      system_requirements: 'Windows 10+, macOS 10.14+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_11',
      category_id: 'cat_2',
      name: 'Spitfire LABS',
      description: 'Free collection of unique, professional-quality sounds.',
      file_size: 2.5,
      is_free: true,
      price: 0,
      image: '',
      features: ['50+ free instruments', 'Cinematic sounds', 'Easy interface', 'Regular updates'],
      system_requirements: 'Windows 7+, macOS 10.10+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_12',
      category_id: 'cat_2',
      name: 'Omnisphere 2',
      description: 'Flagship synthesizer with massive sound library (14,000+ sounds).',
      file_size: 64,
      is_free: false,
      price: 499,
      image: '',
      features: ['14000+ sounds', 'Hardware integration', 'Granular synthesis', 'Arpeggiator'],
      system_requirements: 'Windows 7+, macOS 10.12+',
      created_at: new Date().toISOString(),
    },

    // ============== Effects Products ==============
    {
      id: 'prod_13',
      category_id: 'cat_3',
      name: 'FabFilter Pro-Q 3',
      description: 'Professional equalizer with surgical precision and beautiful interface.',
      file_size: 0.5,
      is_free: false,
      price: 169,
      image: '',
      features: ['Dynamic EQ', 'Spectrum analyzer', 'Mid/Side processing', 'Natural Phase mode'],
      system_requirements: 'Windows 7+, macOS 10.11+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_14',
      category_id: 'cat_3',
      name: 'Valhalla VintageVerb',
      description: 'Beautiful reverb plugin with vintage character and modern control.',
      file_size: 0.2,
      is_free: false,
      price: 50,
      image: '',
      features: ['20+ reverb modes', 'Vintage color', 'Modern clarity', 'CPU efficient'],
      system_requirements: 'Windows 7+, macOS 10.8+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_15',
      category_id: 'cat_3',
      name: 'TDR Nova (Free)',
      description: 'Free dynamic equalizer with professional features.',
      file_size: 0.1,
      is_free: true,
      price: 0,
      image: '',
      features: ['4-band dynamic EQ', 'Parallel compression', 'Linear phase', 'Spectrum analyzer'],
      system_requirements: 'Windows 7+, macOS 10.9+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_16',
      category_id: 'cat_3',
      name: 'Soundtoys 5 Bundle',
      description: 'Creative effects bundle with 21 professional plugins.',
      file_size: 1.5,
      is_free: false,
      price: 499,
      image: '',
      features: ['21 plugins', 'Vintage modeled effects', 'Creative delays', 'Distortion & saturation'],
      system_requirements: 'Windows 10+, macOS 10.13+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_17',
      category_id: 'cat_3',
      name: 'iZotope Ozone 10',
      description: 'Complete mastering suite with AI-powered assistance.',
      file_size: 2.0,
      is_free: false,
      price: 299,
      image: '',
      features: ['AI Master Assistant', 'Tonal Balance Control', 'Vintage modules', 'Stem separation'],
      system_requirements: 'Windows 10+, macOS 10.14.6+',
      created_at: new Date().toISOString(),
    },

    // ============== Samples & Tools ==============
    {
      id: 'prod_18',
      category_id: 'cat_4',
      name: 'Splice Sounds (Monthly)',
      description: 'Subscription service with millions of royalty-free samples.',
      file_size: 10,
      is_free: false,
      price: 9.99,
      image: '',
      features: ['5 million+ samples', 'Download credits', 'Rent-to-own plugins', 'Cloud backup'],
      system_requirements: 'Windows 8+, macOS 10.11+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_19',
      category_id: 'cat_4',
      name: 'Loopcloud',
      description: 'AI-powered sample browser and manager with cloud storage.',
      file_size: 5,
      is_free: false,
      price: 7.99,
      image: '',
      features: ['4 million+ samples', 'AI search', 'Auto-sync tempo', 'Cloud storage'],
      system_requirements: 'Windows 10+, macOS 10.13+',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_20',
      category_id: 'cat_4',
      name: 'Native Instruments Komplete 14',
      description: 'Massive bundle of instruments, effects, and samples.',
      file_size: 145,
      is_free: false,
      price: 599,
      image: '',
      features: ['140+ products', '90000+ sounds', 'Kontakt included', 'Regular updates'],
      system_requirements: 'Windows 10+, macOS 10.14+',
      created_at: new Date().toISOString(),
    },
  ];

  let prodCount = 0;
  for (const product of products) {
    await kv.set(`product:${product.id}`, product);
    console.log(`  ✅ ${product.name} (${product.file_size} GB, $${product.price})`);
    prodCount++;
  }
  
  console.log(`\n  📊 Total products: ${prodCount}\n`);

  // ============================================
  // 5. LIBRARY PACKS
  // ============================================
  console.log('📚 Creating library packs...');

  const libraryPacks = [
    {
      id: 'pack_1',
      product_id: 'prod_8',
      name: 'Vital Presets Vol.1',
      description: '100+ professional presets for EDM, Hip-Hop, and Pop',
      file_size: 0.5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_2',
      product_id: 'prod_9',
      name: 'Serum Preset Bank',
      description: '500+ EDM presets from top sound designers',
      file_size: 1.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_3',
      product_id: 'prod_10',
      name: 'Kontakt Factory Library',
      description: 'Included orchestral and band instruments (55GB)',
      file_size: 25,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_4',
      product_id: 'prod_11',
      name: 'LABS Soft Piano',
      description: 'Beautiful grand piano with soft, intimate character',
      file_size: 0.8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_5',
      product_id: 'prod_11',
      name: 'LABS Strings',
      description: 'Cinematic string ensemble perfect for film scores',
      file_size: 1.2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_6',
      product_id: 'prod_12',
      name: 'Omnisphere Signature Sounds',
      description: 'Celebrity sound designer presets collection',
      file_size: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_7',
      product_id: 'prod_20',
      name: 'Komplete 14 Expansion: Vintage',
      description: 'Classic analog synthesizer recreations',
      file_size: 12,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_8',
      product_id: 'prod_20',
      name: 'Komplete 14 Expansion: Cinematic',
      description: 'Orchestral and cinematic tools for film scoring',
      file_size: 18,
      created_at: new Date().toISOString(),
    },
  ];

  for (const pack of libraryPacks) {
    await kv.set(`library_pack:${pack.id}`, pack);
    console.log(`  ✅ ${pack.name} (${pack.file_size} GB)`);
  }
  
  console.log(`\n  📊 Total library packs: ${libraryPacks.length}\n`);

  // ============================================
  // 6. STORAGE DEVICES
  // ============================================
  console.log('💾 Creating storage devices...');

  const storageDevices = [
    {
      id: 'usb_32gb',
      name: '32GB USB Flash Drive',
      type: 'usb',
      capacity_gb: 32,
      price_usd: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usb_64gb',
      name: '64GB USB Flash Drive',
      type: 'usb',
      capacity_gb: 64,
      price_usd: 12,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usb_128gb',
      name: '128GB USB Flash Drive',
      type: 'usb',
      capacity_gb: 128,
      price_usd: 20,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ssd_250gb',
      name: '250GB External SSD',
      type: 'ssd',
      capacity_gb: 250,
      price_usd: 45,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ssd_500gb',
      name: '500GB External SSD',
      type: 'ssd',
      capacity_gb: 500,
      price_usd: 75,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ssd_1tb',
      name: '1TB External SSD',
      type: 'ssd',
      capacity_gb: 1000,
      price_usd: 120,
      created_at: new Date().toISOString(),
    },
    {
      id: 'ssd_2tb',
      name: '2TB External SSD',
      type: 'ssd',
      capacity_gb: 2000,
      price_usd: 220,
      created_at: new Date().toISOString(),
    },
  ];

  for (const device of storageDevices) {
    await kv.set(`storage_device:${device.id}`, device);
    console.log(`  ✅ ${device.name} ($${device.price_usd})`);
  }
  
  console.log(`\n  📊 Total storage devices: ${storageDevices.length}\n`);

  // ============================================
  // 7. DEMO ORDERS
  // ============================================
  console.log('🛒 Creating demo orders...');

  const orders = [
    {
      id: 'order_1',
      customer_name: 'John Doe',
      customer_email: 'customer1@example.com',
      customer_phone: '+255 123 456 789',
      shipping_country: 'Tanzania',
      shipping_city: 'Dar es Salaam',
      shipping_address: '123 Main Street, Kinondoni District',
      products: ['prod_2', 'prod_9', 'prod_13'],
      product_details: [
        { id: 'prod_2', name: 'FL Studio', price: 199, size: 4.5 },
        { id: 'prod_9', name: 'Serum', price: 189, size: 1.2 },
        { id: 'prod_13', name: 'FabFilter Pro-Q 3', price: 169, size: 0.5 },
      ],
      storage_device: 'ssd_1tb',
      total_storage_gb: 6.2,
      subtotal_usd: 557,
      shipping_cost_usd: 5,
      total_usd: 562,
      currency: 'USD',
      status: 'completed',
      notes: 'Standard delivery',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order_2',
      customer_name: 'Jane Smith',
      customer_email: 'customer2@example.com',
      customer_phone: '+254 700 123 456',
      shipping_country: 'Kenya',
      shipping_city: 'Nairobi',
      shipping_address: '456 Kenyatta Avenue, Westlands',
      products: ['prod_3', 'prod_10', 'prod_14'],
      product_details: [
        { id: 'prod_3', name: 'Ableton Live Standard', price: 449, size: 3.2 },
        { id: 'prod_10', name: 'Kontakt 7', price: 399, size: 50 },
        { id: 'prod_14', name: 'Valhalla VintageVerb', price: 50, size: 0.2 },
      ],
      storage_device: 'ssd_500gb',
      total_storage_gb: 53.4,
      subtotal_usd: 898,
      shipping_cost_usd: 15,
      total_usd: 913,
      currency: 'USD',
      status: 'processing',
      notes: 'Express delivery requested',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order_3',
      customer_name: 'Michael Producer',
      customer_email: 'producer@example.com',
      customer_phone: '+256 700 987 654',
      shipping_country: 'Uganda',
      shipping_city: 'Kampala',
      shipping_address: '789 Buganda Road, Central Division',
      products: ['prod_1', 'prod_8', 'prod_15'],
      product_details: [
        { id: 'prod_1', name: 'Reaper', price: 60, size: 0.3 },
        { id: 'prod_8', name: 'Vital', price: 0, size: 0.4 },
        { id: 'prod_15', name: 'TDR Nova (Free)', price: 0, size: 0.1 },
      ],
      storage_device: 'usb_64gb',
      total_storage_gb: 0.8,
      subtotal_usd: 60,
      shipping_cost_usd: 20,
      total_usd: 80,
      currency: 'USD',
      status: 'pending',
      notes: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'order_4',
      customer_name: 'Sarah Williams',
      customer_email: 'sarah@example.com',
      customer_phone: '+255 789 456 123',
      shipping_country: 'Tanzania',
      shipping_city: 'Arusha',
      shipping_address: 'Sokoine Road, Arusha City Center',
      products: ['prod_7', 'prod_12', 'prod_17', 'prod_20'],
      product_details: [
        { id: 'prod_7', name: 'Studio One Professional', price: 399, size: 5.5 },
        { id: 'prod_12', name: 'Omnisphere 2', price: 499, size: 64 },
        { id: 'prod_17', name: 'iZotope Ozone 10', price: 299, size: 2.0 },
        { id: 'prod_20', name: 'Komplete 14', price: 599, size: 145 },
      ],
      storage_device: 'ssd_2tb',
      total_storage_gb: 216.5,
      subtotal_usd: 1796,
      shipping_cost_usd: 10,
      total_usd: 1806,
      currency: 'USD',
      status: 'completed',
      notes: 'Professional studio setup - priority shipping',
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order_5',
      customer_name: 'Ahmed Hassan',
      customer_email: 'ahmed@example.com',
      customer_phone: '+255 678 234 567',
      shipping_country: 'Tanzania',
      shipping_city: 'Zanzibar',
      shipping_address: 'Stone Town, Malindi Road',
      products: ['prod_5', 'prod_11'],
      product_details: [
        { id: 'prod_5', name: 'GarageBand', price: 0, size: 2.1 },
        { id: 'prod_11', name: 'Spitfire LABS', price: 0, size: 2.5 },
      ],
      storage_device: 'usb_32gb',
      total_storage_gb: 4.6,
      subtotal_usd: 0,
      shipping_cost_usd: 15,
      total_usd: 15,
      currency: 'USD',
      status: 'cancelled',
      notes: 'Customer requested cancellation',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      cancelled_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const order of orders) {
    await kv.set(`order:${order.id}`, order);
    console.log(`  ✅ ${order.id}: ${order.customer_name} - $${order.total_usd} (${order.status})`);
  }
  
  console.log(`\n  📊 Total orders: ${orders.length}\n`);

  // ============================================
  // 8. ANALYTICS DATA
  // ============================================
  console.log('📊 Creating analytics data...');

  const analytics = {
    total_revenue: orders.reduce((sum, order) => {
      return order.status === 'completed' ? sum + order.total_usd : sum;
    }, 0),
    total_orders: orders.length,
    completed_orders: orders.filter(o => o.status === 'completed').length,
    pending_orders: orders.filter(o => o.status === 'pending').length,
    processing_orders: orders.filter(o => o.status === 'processing').length,
    cancelled_orders: orders.filter(o => o.status === 'cancelled').length,
    most_popular_products: ['prod_2', 'prod_9', 'prod_10'],
    average_order_value: 0,
    updated_at: new Date().toISOString(),
  };

  analytics.average_order_value = analytics.total_revenue / analytics.completed_orders;

  await kv.set('analytics:overview', analytics);
  console.log(`  ✅ Analytics overview created`);
  console.log(`  💰 Total revenue: $${analytics.total_revenue.toFixed(2)}`);
  console.log(`  📦 Average order value: $${analytics.average_order_value.toFixed(2)}\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ DATABASE INITIALIZATION COMPLETE!');
  console.log('═══════════════════════════════════════════════\n');
  console.log('📊 Database Statistics:');
  console.log(`  👥 Users: ${userCount}`);
  console.log(`  📁 Categories: ${categories.length}`);
  console.log(`  📦 Products: ${prodCount}`);
  console.log(`  📚 Library Packs: ${libraryPacks.length}`);
  console.log(`  💾 Storage Devices: ${storageDevices.length}`);
  console.log(`  🛒 Orders: ${orders.length}`);
  console.log(`  ⚙️  Settings: 3 (shipping, currency, tax)`);
  console.log(`  📊 Analytics: 1 overview`);
  console.log('\n📧 Demo User Credentials:');
  console.log('  Admin: admin@gmail.com / pass@123');
  console.log('  Customer 1: customer1@example.com / demo123');
  console.log('  Customer 2: customer2@example.com / demo123');
  console.log('  Producer: producer@example.com / demo123');
  console.log('\n✨ All data has been successfully populated!');
  console.log('   You can now use the admin dashboard to manage everything.\n');
}

// Run the initialization
initializeCompleteDatabase();
