import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { seedDemoDataHandler } from './seed-endpoint.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Seed demo data endpoint
app.post('/make-server-bbbda4f3/seed-demo-data', seedDemoDataHandler);

// Initialize default admin user (run once)
app.post('/make-server-bbbda4f3/auth/init-admin', async (c) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'pass@123',
      user_metadata: { name: 'Super Admin', role: 'admin' },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      // User might already exist
      if (error.message.includes('already been registered')) {
        return c.json({ 
          success: false, 
          message: 'Admin user already exists',
          credentials: {
            email: 'admin@gmail.com',
            password: 'pass@123'
          }
        }, 200);
      }
      console.error('Init admin error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'Super admin created successfully',
      credentials: {
        email: 'admin@gmail.com',
        password: 'pass@123'
      },
      warning: 'Change the default password after first login!'
    }, 201);
  } catch (error) {
    console.error('Init admin server error:', error);
    return c.json({ error: 'Failed to initialize admin user' }, 500);
  }
});

// Admin Sign Up (for initial setup)
app.post('/make-server-bbbda4f3/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Admin signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user }, 201);
  } catch (error) {
    console.error('Admin signup server error:', error);
    return c.json({ error: 'Failed to create admin user' }, 500);
  }
});

// Verify admin access token
app.get('/make-server-bbbda4f3/auth/verify', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Invalid access token' }, 401);
    }

    // Check if user has admin role
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.error('Auth verification error:', error);
    return c.json({ error: 'Failed to verify authentication' }, 500);
  }
});

// Helper function to verify admin
async function verifyAdmin(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return { error: 'No access token provided', status: 401 };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return { error: 'Invalid access token', status: 401 };
  }

  if (user.user_metadata?.role !== 'admin') {
    return { error: 'Unauthorized - Admin access required', status: 403 };
  }

  return { user };
}

// ============================================
// CATEGORY ENDPOINTS
// ============================================

// Get all categories
app.get('/make-server-bbbda4f3/categories', async (c) => {
  try {
    const categories = await kv.getByPrefix('category:');
    return c.json({ categories: categories || [] });
  } catch (error) {
    console.error('Get categories error:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Get single category
app.get('/make-server-bbbda4f3/categories/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const category = await kv.get(`category:${id}`);
    
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    return c.json({ error: 'Failed to fetch category' }, 500);
  }
});

// Create category (Admin only)
app.post('/make-server-bbbda4f3/categories', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const { id, title, subtitle, icon, helperText } = await c.req.json();

    if (!id || !title || !subtitle) {
      return c.json({ error: 'ID, title, and subtitle are required' }, 400);
    }

    const category = {
      id,
      title,
      subtitle,
      icon: icon || 'Music',
      helperText: helperText || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`category:${id}`, category);

    return c.json({ category }, 201);
  } catch (error) {
    console.error('Create category error:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Update category (Admin only)
app.put('/make-server-bbbda4f3/categories/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();

    const existing = await kv.get(`category:${id}`);
    if (!existing) {
      return c.json({ error: 'Category not found' }, 404);
    }

    const category = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`category:${id}`, category);

    return c.json({ category });
  } catch (error) {
    console.error('Update category error:', error);
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

// Delete category (Admin only)
app.delete('/make-server-bbbda4f3/categories/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const id = c.req.param('id');
    
    const existing = await kv.get(`category:${id}`);
    if (!existing) {
      return c.json({ error: 'Category not found' }, 404);
    }

    await kv.del(`category:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// ============================================
// PRODUCT ENDPOINTS
// ============================================

// Get all products
app.get('/make-server-bbbda4f3/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products: products || [] });
  } catch (error) {
    console.error('Get products error:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get products by category
app.get('/make-server-bbbda4f3/products/category/:categoryId', async (c) => {
  try {
    const categoryId = c.req.param('categoryId');
    const allProducts = await kv.getByPrefix('product:');
    const products = allProducts.filter((p: any) => p.categoryId === categoryId);
    
    return c.json({ products });
  } catch (error) {
    console.error('Get products by category error:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
app.get('/make-server-bbbda4f3/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Create product (Admin only)
app.post('/make-server-bbbda4f3/products', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const { id, categoryId, name, description, fileSize, price, isFree, image } = await c.req.json();

    if (!id || !categoryId || !name || !description || fileSize === undefined) {
      return c.json({ error: 'Required fields missing' }, 400);
    }

    const product = {
      id,
      categoryId,
      name,
      description,
      fileSize: parseFloat(fileSize),
      price: price ? parseFloat(price) : 0,
      isFree: isFree || false,
      image: image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${id}`, product);

    return c.json({ product }, 201);
  } catch (error) {
    console.error('Create product error:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product (Admin only)
app.put('/make-server-bbbda4f3/products/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();

    const existing = await kv.get(`product:${id}`);
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const product = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${id}`, product);

    return c.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product (Admin only)
app.delete('/make-server-bbbda4f3/products/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const id = c.req.param('id');
    
    const existing = await kv.get(`product:${id}`);
    if (!existing) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Also delete associated library packs
    const packs = await kv.getByPrefix(`librarypack:${id}:`);
    for (const pack of packs) {
      await kv.del(`librarypack:${id}:${pack.id}`);
    }

    await kv.del(`product:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ============================================
// LIBRARY PACK ENDPOINTS
// ============================================

// Get library packs for a product
app.get('/make-server-bbbda4f3/library-packs/:productId', async (c) => {
  try {
    const productId = c.req.param('productId');
    const packs = await kv.getByPrefix(`librarypack:${productId}:`);
    
    return c.json({ packs: packs || [] });
  } catch (error) {
    console.error('Get library packs error:', error);
    return c.json({ error: 'Failed to fetch library packs' }, 500);
  }
});

// Create library pack (Admin only)
app.post('/make-server-bbbda4f3/library-packs', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const { id, productId, name, description, fileSize, price, image } = await c.req.json();

    if (!id || !productId || !name || !description || fileSize === undefined) {
      return c.json({ error: 'Required fields missing' }, 400);
    }

    const pack = {
      id,
      productId,
      name,
      description,
      fileSize: parseFloat(fileSize),
      price: price ? parseFloat(price) : 0,
      image: image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`librarypack:${productId}:${id}`, pack);

    return c.json({ pack }, 201);
  } catch (error) {
    console.error('Create library pack error:', error);
    return c.json({ error: 'Failed to create library pack' }, 500);
  }
});

// Update library pack (Admin only)
app.put('/make-server-bbbda4f3/library-packs/:productId/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const productId = c.req.param('productId');
    const id = c.req.param('id');
    const updates = await c.req.json();

    const existing = await kv.get(`librarypack:${productId}:${id}`);
    if (!existing) {
      return c.json({ error: 'Library pack not found' }, 404);
    }

    const pack = {
      ...existing,
      ...updates,
      id,
      productId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`librarypack:${productId}:${id}`, pack);

    return c.json({ pack });
  } catch (error) {
    console.error('Update library pack error:', error);
    return c.json({ error: 'Failed to update library pack' }, 500);
  }
});

// Delete library pack (Admin only)
app.delete('/make-server-bbbda4f3/library-packs/:productId/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const productId = c.req.param('productId');
    const id = c.req.param('id');
    
    const existing = await kv.get(`librarypack:${productId}:${id}`);
    if (!existing) {
      return c.json({ error: 'Library pack not found' }, 404);
    }

    await kv.del(`librarypack:${productId}:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete library pack error:', error);
    return c.json({ error: 'Failed to delete library pack' }, 500);
  }
});

// ============================================
// ORDER ENDPOINTS
// ============================================

// Create order
app.post('/make-server-bbbda4f3/orders', async (c) => {
  try {
    const { customerName, customerEmail, products, libraryPacks, storage, location, total } = await c.req.json();

    if (!customerName || !customerEmail || !products || !storage || !location) {
      return c.json({ error: 'Required fields missing' }, 400);
    }

    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      customerName,
      customerEmail,
      products,
      libraryPacks: libraryPacks || [],
      storage,
      location,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);

    return c.json({ order }, 201);
  } catch (error) {
    console.error('Create order error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get all orders (Admin only)
app.get('/make-server-bbbda4f3/orders', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const orders = await kv.getByPrefix('order:');
    
    // Sort by createdAt descending
    const sortedOrders = (orders || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ orders: sortedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status (Admin only)
app.put('/make-server-bbbda4f3/orders/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const id = c.req.param('id');
    const { status } = await c.req.json();

    const existing = await kv.get(`order:${id}`);
    if (!existing) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const order = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${id}`, order);

    return c.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    return c.json({ error: 'Failed to update order' }, 500);
  }
});

// ============================================
// STATISTICS ENDPOINTS
// ============================================

// Get dashboard statistics (Admin only)
app.get('/make-server-bbbda4f3/stats', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (auth.error) {
      return c.json({ error: auth.error }, auth.status);
    }

    const [products, categories, orders] = await Promise.all([
      kv.getByPrefix('product:'),
      kv.getByPrefix('category:'),
      kv.getByPrefix('order:'),
    ]);

    const totalRevenue = (orders || []).reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const pendingOrders = (orders || []).filter((order: any) => order.status === 'pending').length;

    return c.json({
      stats: {
        totalProducts: products?.length || 0,
        totalCategories: categories?.length || 0,
        totalOrders: orders?.length || 0,
        pendingOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Health check
app.get('/make-server-bbbda4f3/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);