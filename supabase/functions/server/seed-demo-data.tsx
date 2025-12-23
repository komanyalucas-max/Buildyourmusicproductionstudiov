import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

/**
 * Demo Data Seeding Script
 * Creates demo users, categories, products, and orders
 */

async function seedDemoData() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    Deno.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🌱 Starting demo data seeding...\n');

  // ============================================
  // 1. CREATE DEMO USERS
  // ============================================
  console.log('👥 Creating demo users...');

  const demoUsers = [
    {
      email: 'admin@gmail.com',
      password: 'pass@123',
      metadata: { name: 'Super Admin', role: 'admin' },
    },
    {
      email: 'customer1@example.com',
      password: 'demo123',
      metadata: { name: 'John Doe', role: 'customer' },
    },
    {
      email: 'customer2@example.com',
      password: 'demo123',
      metadata: { name: 'Jane Smith', role: 'customer' },
    },
  ];

  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.metadata,
      });

      if (error && !error.message.includes('already been registered')) {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      } else if (error) {
        console.log(`ℹ️  ${user.email} already exists`);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    } catch (err) {
      console.error(`❌ Error with ${user.email}:`, err);
    }
  }

  // ============================================
  // 2. CREATE CATEGORIES
  // ============================================
  console.log('\n📁 Creating categories...');

  const categories = [
    {
      id: 'cat_1',
      name: 'DAW (Where You Make Music)',
      description: 'Your main workspace for creating, recording, and arranging music',
      icon: 'Music',
      helper_text: 'You usually only need one',
      order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_2',
      name: 'Instruments (Sound Makers)',
      description: 'Virtual instruments to create melodies, beats, and bass lines',
      icon: 'Wand2',
      helper_text: '',
      order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_3',
      name: 'Effects & Audio Tools',
      description: 'Polish your sound with effects and mixing tools',
      icon: 'Sliders',
      helper_text: '',
      order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cat_4',
      name: 'Samples & Creative Tools',
      description: 'Ready-made sounds and creative utilities',
      icon: 'Library',
      helper_text: '',
      order: 4,
      created_at: new Date().toISOString(),
    },
  ];

  for (const category of categories) {
    await kv.set(`category:${category.id}`, category);
    console.log(`✅ Created category: ${category.name}`);
  }

  // ============================================
  // 3. CREATE PRODUCTS
  // ============================================
  console.log('\n📦 Creating products...');

  const products = [
    // DAW Products
    {
      id: 'prod_1',
      category_id: 'cat_1',
      name: 'Reaper',
      description: 'Lightweight, affordable, and powerful for beginners',
      file_size: 0.3,
      is_free: false,
      price: 60,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_2',
      category_id: 'cat_1',
      name: 'FL Studio',
      description: 'Popular for electronic music and beats',
      file_size: 4.5,
      is_free: false,
      price: 199,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_3',
      category_id: 'cat_1',
      name: 'Ableton Live Standard',
      description: 'Great for live performance and electronic music',
      file_size: 3.2,
      is_free: false,
      price: 449,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_4',
      category_id: 'cat_1',
      name: 'Logic Pro (Mac only)',
      description: 'Professional DAW with tons of built-in sounds',
      file_size: 6.8,
      is_free: false,
      price: 199,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_5',
      category_id: 'cat_1',
      name: 'GarageBand (Mac/iOS)',
      description: 'Simple and free, perfect for starting out',
      file_size: 2.1,
      is_free: true,
      price: 0,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_6',
      category_id: 'cat_1',
      name: 'Cakewalk by BandLab',
      description: 'Full-featured free DAW for Windows',
      file_size: 1.8,
      is_free: true,
      price: 0,
      image: '',
      created_at: new Date().toISOString(),
    },
    // Instrument Products
    {
      id: 'prod_7',
      category_id: 'cat_2',
      name: 'Vital',
      description: 'Modern synth with beautiful interface, free version available',
      file_size: 0.4,
      is_free: true,
      price: 0,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_8',
      category_id: 'cat_2',
      name: 'Serum',
      description: 'Industry-standard wavetable synth',
      file_size: 1.2,
      is_free: false,
      price: 189,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_9',
      category_id: 'cat_2',
      name: 'Kontakt 7',
      description: 'Sample library player with huge sound collection',
      file_size: 50,
      is_free: false,
      price: 399,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_10',
      category_id: 'cat_2',
      name: 'Spitfire LABS',
      description: 'Free collection of unique sounds',
      file_size: 2.5,
      is_free: true,
      price: 0,
      image: '',
      created_at: new Date().toISOString(),
    },
    // Effects Products
    {
      id: 'prod_11',
      category_id: 'cat_3',
      name: 'FabFilter Pro-Q 3',
      description: 'Professional EQ plugin',
      file_size: 0.5,
      is_free: false,
      price: 169,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_12',
      category_id: 'cat_3',
      name: 'Valhalla VintageVerb',
      description: 'Beautiful reverb plugin',
      file_size: 0.2,
      is_free: false,
      price: 50,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_13',
      category_id: 'cat_3',
      name: 'TDR Nova (Free)',
      description: 'Free dynamic equalizer',
      file_size: 0.1,
      is_free: true,
      price: 0,
      image: '',
      created_at: new Date().toISOString(),
    },
    // Samples & Tools
    {
      id: 'prod_14',
      category_id: 'cat_4',
      name: 'Splice Sounds',
      description: 'Subscription service with millions of samples',
      file_size: 10,
      is_free: false,
      price: 9.99,
      image: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'prod_15',
      category_id: 'cat_4',
      name: 'Loopcloud',
      description: 'Sample browser and manager',
      file_size: 5,
      is_free: false,
      price: 7.99,
      image: '',
      created_at: new Date().toISOString(),
    },
  ];

  for (const product of products) {
    await kv.set(`product:${product.id}`, product);
    console.log(`✅ Created product: ${product.name}`);
  }

  // ============================================
  // 4. CREATE LIBRARY PACKS
  // ============================================
  console.log('\n📚 Creating library packs...');

  const libraryPacks = [
    {
      id: 'pack_1',
      product_id: 'prod_7',
      name: 'Vital Presets Vol.1',
      description: '100+ professional presets',
      file_size: 0.5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_2',
      product_id: 'prod_8',
      name: 'Serum Preset Bank',
      description: '500+ EDM presets',
      file_size: 1.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_3',
      product_id: 'prod_9',
      name: 'Kontakt Factory Library',
      description: 'Included orchestral and band instruments',
      file_size: 25,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_4',
      product_id: 'prod_10',
      name: 'LABS Soft Piano',
      description: 'Beautiful grand piano',
      file_size: 0.8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pack_5',
      product_id: 'prod_10',
      name: 'LABS Strings',
      description: 'Cinematic string ensemble',
      file_size: 1.2,
      created_at: new Date().toISOString(),
    },
  ];

  for (const pack of libraryPacks) {
    await kv.set(`library_pack:${pack.id}`, pack);
    console.log(`✅ Created library pack: ${pack.name}`);
  }

  // ============================================
  // 5. CREATE DEMO ORDERS
  // ============================================
  console.log('\n🛒 Creating demo orders...');

  const orders = [
    {
      id: 'order_1',
      customer_name: 'John Doe',
      customer_email: 'customer1@example.com',
      customer_phone: '+255 123 456 789',
      shipping_country: 'Tanzania',
      shipping_city: 'Dar es Salaam',
      shipping_address: '123 Main Street, Kinondoni',
      products: ['prod_2', 'prod_8', 'prod_11'],
      storage_device: 'ssd_1tb',
      total_storage_gb: 5.9,
      subtotal_usd: 557,
      shipping_cost_usd: 10,
      total_usd: 567,
      currency: 'USD',
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      id: 'order_2',
      customer_name: 'Jane Smith',
      customer_email: 'customer2@example.com',
      customer_phone: '+255 987 654 321',
      shipping_country: 'Kenya',
      shipping_city: 'Nairobi',
      shipping_address: '456 Kenyatta Avenue',
      products: ['prod_3', 'prod_9', 'prod_12'],
      storage_device: 'ssd_500gb',
      total_storage_gb: 53.7,
      subtotal_usd: 898,
      shipping_cost_usd: 15,
      total_usd: 913,
      currency: 'USD',
      status: 'processing',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: 'order_3',
      customer_name: 'Alex Johnson',
      customer_email: 'alex@example.com',
      customer_phone: '+255 555 123 456',
      shipping_country: 'Tanzania',
      shipping_city: 'Arusha',
      shipping_address: '789 Sokoine Road',
      products: ['prod_1', 'prod_7', 'prod_13'],
      storage_device: 'usb_64gb',
      total_storage_gb: 0.8,
      subtotal_usd: 60,
      shipping_cost_usd: 5,
      total_usd: 65,
      currency: 'USD',
      status: 'pending',
      created_at: new Date().toISOString(), // Today
    },
  ];

  for (const order of orders) {
    await kv.set(`order:${order.id}`, order);
    console.log(`✅ Created order: ${order.id} - ${order.customer_name}`);
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n\n✅ ====================================');
  console.log('✅ DEMO DATA SEEDING COMPLETED!');
  console.log('✅ ====================================\n');
  console.log(`👥 Users created: ${demoUsers.length}`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`📦 Products: ${products.length}`);
  console.log(`📚 Library Packs: ${libraryPacks.length}`);
  console.log(`🛒 Orders: ${orders.length}`);
  console.log('\n📧 Demo User Credentials:');
  console.log('   Admin: admin@gmail.com / pass@123');
  console.log('   Customer 1: customer1@example.com / demo123');
  console.log('   Customer 2: customer2@example.com / demo123');
  console.log('\n');
}

// Run the seeding
seedDemoData();
