import { Context } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

/**
 * Comprehensive Seed Demo Data Endpoint Handler
 * This file contains the complete database seeding logic
 */

export async function seedDemoDataHandler(c: Context) {
  console.log('🌱 Starting comprehensive database seeding...');

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    let stats = {
      users: 0,
      categories: 0,
      products: 0,
      library_packs: 0,
      storage_devices: 0,
      orders: 0,
      settings: 0,
    };

    // ============================================
    // 1. SYSTEM SETTINGS
    // ============================================
    const shippingRates = {
      Tanzania: {
        'Dar es Salaam': 5,
        'Dodoma': 8,
        'Arusha': 10,
        'Mwanza': 12,
        'Zanzibar': 15,
        'Other': 10,
      },
      Kenya: { 'Nairobi': 15, 'Mombasa': 18, 'Other': 20 },
      Uganda: { 'Kampala': 20, 'Other': 25 },
      Rwanda: { 'Kigali': 25, 'Other': 30 },
      Burundi: { 'Bujumbura': 30, 'Other': 35 },
    };

    await kv.set('settings:shipping_rates', shippingRates);
    await kv.set('settings:currency_rate', { usd_to_tzs: 2500 });
    await kv.set('settings:tax_rate', { rate: 0.18, name: 'VAT' });
    stats.settings = 3;

    // ============================================
    // 2. DEMO USERS
    // ============================================
    const demoUsers = [
      { email: 'admin@gmail.com', password: 'pass@123', metadata: { name: 'Super Admin', role: 'admin', phone: '+255 700 000 001', country: 'Tanzania' } },
      { email: 'customer1@example.com', password: 'demo123', metadata: { name: 'John Doe', role: 'customer', phone: '+255 123 456 789', country: 'Tanzania', city: 'Dar es Salaam' } },
      { email: 'customer2@example.com', password: 'demo123', metadata: { name: 'Jane Smith', role: 'customer', phone: '+254 700 123 456', country: 'Kenya', city: 'Nairobi' } },
      { email: 'producer@example.com', password: 'demo123', metadata: { name: 'Michael Producer', role: 'customer', phone: '+256 700 123 456', country: 'Uganda', city: 'Kampala' } },
    ];

    for (const user of demoUsers) {
      try {
        const { data } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: user.metadata,
        });
        if (data.user) {
          await kv.set(`user:${data.user.id}`, {
            id: data.user.id,
            email: user.email,
            ...user.metadata,
            created_at: new Date().toISOString(),
          });
        }
        stats.users++;
      } catch (err) {
        stats.users++;
      }
    }

    // ============================================
    // 3. CATEGORIES
    // ============================================
    const categories = [
      { id: 'cat_1', name: 'DAW (Where You Make Music)', name_sw: 'DAW (Programu Kuu ya Kutengeneza Muziki)', description: 'Your main workspace for creating, recording, and arranging music', description_sw: 'Programu kuu ya kurekodi na kuandaa muziki', icon: 'Music', helper_text: 'You usually only need one', helper_text_sw: 'Kwa kawaida unahitaji moja tu', order: 1, created_at: new Date().toISOString() },
      { id: 'cat_2', name: 'Instruments (Sound Makers)', name_sw: 'Vyombo vya Muziki (Vya Dijitali)', description: 'Virtual instruments to create melodies, beats, and bass lines', description_sw: 'Vyombo vya dijitali vya kutengeneza sauti na midundo', icon: 'Wand2', helper_text: '', helper_text_sw: '', order: 2, created_at: new Date().toISOString() },
      { id: 'cat_3', name: 'Effects & Audio Tools', name_sw: 'Zana za Kuboresha Sauti', description: 'Polish your sound with effects and mixing tools', description_sw: 'Kuboresha na kuchanganya sauti kwa ubora', icon: 'Sliders', helper_text: '', helper_text_sw: '', order: 3, created_at: new Date().toISOString() },
      { id: 'cat_4', name: 'Samples & Creative Tools', name_sw: 'Sampuli na Zana za Ubunifu', description: 'Ready-made sounds and creative utilities', description_sw: 'Sauti tayari na zana za ubunifu', icon: 'Library', helper_text: '', helper_text_sw: '', order: 4, created_at: new Date().toISOString() },
    ];

    for (const category of categories) {
      await kv.set(`category:${category.id}`, category);
      stats.categories++;
    }

    // ============================================
    // 4. PRODUCTS (20 products)
    // ============================================
    const products = [
      // DAWs
      { id: 'prod_1', category_id: 'cat_1', name: 'Reaper', description: 'Lightweight, affordable, and powerful for beginners', file_size: 0.3, is_free: false, price: 60, features: ['Multi-track recording', 'VST support', '64-bit mixing'], created_at: new Date().toISOString() },
      { id: 'prod_2', category_id: 'cat_1', name: 'FL Studio', description: 'Popular for electronic music and beats', file_size: 4.5, is_free: false, price: 199, features: ['Step sequencer', 'Piano roll', 'Lifetime updates'], created_at: new Date().toISOString() },
      { id: 'prod_3', category_id: 'cat_1', name: 'Ableton Live Standard', description: 'Great for live performance and electronic music', file_size: 3.2, is_free: false, price: 449, features: ['Session view', 'Audio warping', 'MIDI effects'], created_at: new Date().toISOString() },
      { id: 'prod_4', category_id: 'cat_1', name: 'Logic Pro (Mac only)', description: 'Professional DAW with tons of built-in sounds', file_size: 6.8, is_free: false, price: 199, features: ['90GB library', 'Dolby Atmos', 'Smart Tempo'], created_at: new Date().toISOString() },
      { id: 'prod_5', category_id: 'cat_1', name: 'GarageBand (Mac/iOS)', description: 'Simple and free, perfect for starting out', file_size: 2.1, is_free: true, price: 0, features: ['Touch instruments', 'Live Loops', 'Easy to use'], created_at: new Date().toISOString() },
      { id: 'prod_6', category_id: 'cat_1', name: 'Cakewalk by BandLab', description: 'Full-featured free DAW for Windows', file_size: 1.8, is_free: true, price: 0, features: ['Unlimited tracks', 'VST3 support', 'ProChannel'], created_at: new Date().toISOString() },
      { id: 'prod_7', category_id: 'cat_1', name: 'Studio One Professional', description: 'Modern DAW with powerful mixing console', file_size: 5.5, is_free: false, price: 399, features: ['Drag & drop', 'Chord track', 'Mastering suite'], created_at: new Date().toISOString() },
      // Instruments
      { id: 'prod_8', category_id: 'cat_2', name: 'Vital', description: 'Modern wavetable synth with beautiful interface', file_size: 0.4, is_free: true, price: 0, features: ['Wavetable synthesis', 'Visual feedback', '170+ presets'], created_at: new Date().toISOString() },
      { id: 'prod_9', category_id: 'cat_2', name: 'Serum', description: 'Industry-standard wavetable synth', file_size: 1.2, is_free: false, price: 189, features: ['Visual wavetables', 'Ultra-clean sound', '450+ presets'], created_at: new Date().toISOString() },
      { id: 'prod_10', category_id: 'cat_2', name: 'Kontakt 7', description: 'Sample library player with huge collection', file_size: 50, is_free: false, price: 399, features: ['55GB library', 'Advanced scripting', '1000+ instruments'], created_at: new Date().toISOString() },
      { id: 'prod_11', category_id: 'cat_2', name: 'Spitfire LABS', description: 'Free collection of unique sounds', file_size: 2.5, is_free: true, price: 0, features: ['50+ free instruments', 'Cinematic sounds', 'Easy interface'], created_at: new Date().toISOString() },
      { id: 'prod_12', category_id: 'cat_2', name: 'Omnisphere 2', description: 'Flagship synthesizer with 14,000+ sounds', file_size: 64, is_free: false, price: 499, features: ['14000+ sounds', 'Hardware integration', 'Granular synthesis'], created_at: new Date().toISOString() },
      // Effects
      { id: 'prod_13', category_id: 'cat_3', name: 'FabFilter Pro-Q 3', description: 'Professional equalizer plugin', file_size: 0.5, is_free: false, price: 169, features: ['Dynamic EQ', 'Spectrum analyzer', 'Natural Phase'], created_at: new Date().toISOString() },
      { id: 'prod_14', category_id: 'cat_3', name: 'Valhalla VintageVerb', description: 'Beautiful reverb plugin', file_size: 0.2, is_free: false, price: 50, features: ['20+ reverb modes', 'Vintage color', 'CPU efficient'], created_at: new Date().toISOString() },
      { id: 'prod_15', category_id: 'cat_3', name: 'TDR Nova (Free)', description: 'Free dynamic equalizer', file_size: 0.1, is_free: true, price: 0, features: ['4-band dynamic EQ', 'Linear phase', 'Spectrum analyzer'], created_at: new Date().toISOString() },
      { id: 'prod_16', category_id: 'cat_3', name: 'Soundtoys 5 Bundle', description: 'Creative effects bundle with 21 plugins', file_size: 1.5, is_free: false, price: 499, features: ['21 plugins', 'Vintage effects', 'Creative delays'], created_at: new Date().toISOString() },
      { id: 'prod_17', category_id: 'cat_3', name: 'iZotope Ozone 10', description: 'Complete mastering suite', file_size: 2.0, is_free: false, price: 299, features: ['AI Master Assistant', 'Tonal Balance', 'Stem separation'], created_at: new Date().toISOString() },
      // Samples & Tools
      { id: 'prod_18', category_id: 'cat_4', name: 'Splice Sounds (Monthly)', description: 'Subscription with millions of samples', file_size: 10, is_free: false, price: 9.99, features: ['5M+ samples', 'Download credits', 'Cloud backup'], created_at: new Date().toISOString() },
      { id: 'prod_19', category_id: 'cat_4', name: 'Loopcloud', description: 'AI-powered sample browser', file_size: 5, is_free: false, price: 7.99, features: ['4M+ samples', 'AI search', 'Auto-sync tempo'], created_at: new Date().toISOString() },
      { id: 'prod_20', category_id: 'cat_4', name: 'Native Instruments Komplete 14', description: 'Massive bundle of instruments and effects', file_size: 145, is_free: false, price: 599, features: ['140+ products', '90000+ sounds', 'Regular updates'], created_at: new Date().toISOString() },
    ];

    for (const product of products) {
      await kv.set(`product:${product.id}`, product);
      stats.products++;
    }

    // ============================================
    // 5. LIBRARY PACKS
    // ============================================
    const libraryPacks = [
      { id: 'pack_1', product_id: 'prod_8', name: 'Vital Presets Vol.1', description: '100+ professional presets', file_size: 0.5, created_at: new Date().toISOString() },
      { id: 'pack_2', product_id: 'prod_9', name: 'Serum Preset Bank', description: '500+ EDM presets', file_size: 1.0, created_at: new Date().toISOString() },
      { id: 'pack_3', product_id: 'prod_10', name: 'Kontakt Factory Library', description: 'Orchestral instruments (55GB)', file_size: 25, created_at: new Date().toISOString() },
      { id: 'pack_4', product_id: 'prod_11', name: 'LABS Soft Piano', description: 'Beautiful grand piano', file_size: 0.8, created_at: new Date().toISOString() },
      { id: 'pack_5', product_id: 'prod_11', name: 'LABS Strings', description: 'Cinematic string ensemble', file_size: 1.2, created_at: new Date().toISOString() },
      { id: 'pack_6', product_id: 'prod_12', name: 'Omnisphere Signature Sounds', description: 'Celebrity sound designer presets', file_size: 5, created_at: new Date().toISOString() },
      { id: 'pack_7', product_id: 'prod_20', name: 'Komplete 14 Expansion: Vintage', description: 'Classic analog synthesizers', file_size: 12, created_at: new Date().toISOString() },
      { id: 'pack_8', product_id: 'prod_20', name: 'Komplete 14 Expansion: Cinematic', description: 'Orchestral and cinematic tools', file_size: 18, created_at: new Date().toISOString() },
    ];

    for (const pack of libraryPacks) {
      await kv.set(`library_pack:${pack.id}`, pack);
      stats.library_packs++;
    }

    // ============================================
    // 6. STORAGE DEVICES
    // ============================================
    const storageDevices = [
      { id: 'usb_32gb', name: '32GB USB Flash Drive', type: 'usb', capacity_gb: 32, price_usd: 8, created_at: new Date().toISOString() },
      { id: 'usb_64gb', name: '64GB USB Flash Drive', type: 'usb', capacity_gb: 64, price_usd: 12, created_at: new Date().toISOString() },
      { id: 'usb_128gb', name: '128GB USB Flash Drive', type: 'usb', capacity_gb: 128, price_usd: 20, created_at: new Date().toISOString() },
      { id: 'ssd_250gb', name: '250GB External SSD', type: 'ssd', capacity_gb: 250, price_usd: 45, created_at: new Date().toISOString() },
      { id: 'ssd_500gb', name: '500GB External SSD', type: 'ssd', capacity_gb: 500, price_usd: 75, created_at: new Date().toISOString() },
      { id: 'ssd_1tb', name: '1TB External SSD', type: 'ssd', capacity_gb: 1000, price_usd: 120, created_at: new Date().toISOString() },
      { id: 'ssd_2tb', name: '2TB External SSD', type: 'ssd', capacity_gb: 2000, price_usd: 220, created_at: new Date().toISOString() },
    ];

    for (const device of storageDevices) {
      await kv.set(`storage_device:${device.id}`, device);
      stats.storage_devices++;
    }

    // ============================================
    // 7. DEMO ORDERS
    // ============================================
    const orders = [
      {
        id: 'order_1',
        customer_name: 'John Doe',
        customer_email: 'customer1@example.com',
        customer_phone: '+255 123 456 789',
        shipping_country: 'Tanzania',
        shipping_city: 'Dar es Salaam',
        shipping_address: '123 Main Street, Kinondoni',
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
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'order_2',
        customer_name: 'Jane Smith',
        customer_email: 'customer2@example.com',
        customer_phone: '+254 700 123 456',
        shipping_country: 'Kenya',
        shipping_city: 'Nairobi',
        shipping_address: '456 Kenyatta Avenue',
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
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'order_3',
        customer_name: 'Michael Producer',
        customer_email: 'producer@example.com',
        customer_phone: '+256 700 987 654',
        shipping_country: 'Uganda',
        shipping_city: 'Kampala',
        shipping_address: '789 Buganda Road',
        products: ['prod_1', 'prod_8', 'prod_15'],
        product_details: [
          { id: 'prod_1', name: 'Reaper', price: 60, size: 0.3 },
          { id: 'prod_8', name: 'Vital', price: 0, size: 0.4 },
          { id: 'prod_15', name: 'TDR Nova', price: 0, size: 0.1 },
        ],
        storage_device: 'usb_64gb',
        total_storage_gb: 0.8,
        subtotal_usd: 60,
        shipping_cost_usd: 20,
        total_usd: 80,
        currency: 'USD',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        id: 'order_4',
        customer_name: 'Sarah Williams',
        customer_email: 'sarah@example.com',
        customer_phone: '+255 789 456 123',
        shipping_country: 'Tanzania',
        shipping_city: 'Arusha',
        shipping_address: 'Sokoine Road',
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
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const order of orders) {
      await kv.set(`order:${order.id}`, order);
      stats.orders++;
    }

    // ============================================
    // 8. ANALYTICS
    // ============================================
    const analytics = {
      total_revenue: orders.reduce((sum, o) => o.status === 'completed' ? sum + o.total_usd : sum, 0),
      total_orders: orders.length,
      completed_orders: orders.filter(o => o.status === 'completed').length,
      pending_orders: orders.filter(o => o.status === 'pending').length,
      processing_orders: orders.filter(o => o.status === 'processing').length,
      cancelled_orders: orders.filter(o => o.status === 'cancelled').length,
      updated_at: new Date().toISOString(),
    };
    await kv.set('analytics:overview', analytics);

    return c.json({
      success: true,
      message: '✅ Complete database seeded successfully!',
      stats,
      analytics,
    });

  } catch (error) {
    console.error('Seed error:', error);
    return c.json({ success: false, error: 'Failed to seed database' }, 500);
  }
}
