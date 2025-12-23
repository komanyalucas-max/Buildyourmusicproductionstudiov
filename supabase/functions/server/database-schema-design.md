# Music Studio Builder - Database Schema Design

## Conceptual SQL Schema (For Reference Only)

This document shows what the database WOULD look like if we were using traditional SQL tables.
In practice, we use the KV store with structured keys to achieve the same result.

---

## 📊 Traditional SQL Schema (Conceptual)

### Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'admin' or 'customer'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: categories
```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Lucide icon name
  helper_text TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: products
```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_size DECIMAL(10, 2) NOT NULL, -- in GB
  is_free BOOLEAN DEFAULT FALSE,
  price DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: library_packs
```sql
CREATE TABLE library_packs (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_size DECIMAL(10, 2) NOT NULL, -- in GB
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: storage_devices
```sql
CREATE TABLE storage_devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'usb' or 'ssd'
  capacity_gb INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: orders
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_country VARCHAR(100) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_address TEXT NOT NULL,
  storage_device_id VARCHAR(50) REFERENCES storage_devices(id),
  total_storage_gb DECIMAL(10, 2),
  subtotal_usd DECIMAL(10, 2) NOT NULL,
  shipping_cost_usd DECIMAL(10, 2) NOT NULL,
  total_usd DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: order_items
```sql
CREATE TABLE order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 KV Store Implementation (Actual Implementation)

Since we can only use the `kv_store_bbbda4f3` table, we structure our data with organized keys:

### Key Patterns:

```
category:{id}           → Category object
product:{id}            → Product object
library_pack:{id}       → Library pack object
storage_device:{id}     → Storage device object
order:{id}              → Order object
user:{id}               → User metadata object
settings:shipping_rates → Shipping configuration
settings:currency_rate  → USD to TZS conversion rate
```

### Example KV Store Records:

```
key: "category:cat_1"
value: {
  "id": "cat_1",
  "name": "DAW (Where You Make Music)",
  "description": "Your main workspace...",
  "icon": "Music",
  "helper_text": "You usually only need one",
  "order": 1,
  "created_at": "2025-12-23T14:00:00.000Z"
}

key: "product:prod_1"
value: {
  "id": "prod_1",
  "category_id": "cat_1",
  "name": "Reaper",
  "description": "Lightweight, affordable...",
  "file_size": 0.3,
  "is_free": false,
  "price": 60,
  "created_at": "2025-12-23T14:00:00.000Z"
}

key: "order:order_1"
value: {
  "id": "order_1",
  "customer_name": "John Doe",
  "customer_email": "customer1@example.com",
  "products": ["prod_2", "prod_8", "prod_11"],
  "total_usd": 567,
  "status": "completed",
  "created_at": "2025-12-16T14:00:00.000Z"
}
```

---

## 📈 Data Relationships

### Category → Products (One-to-Many)
- Query: `getByPrefix('product:')` then filter by `category_id`

### Product → Library Packs (One-to-Many)
- Query: `getByPrefix('library_pack:')` then filter by `product_id`

### Order → Products (Many-to-Many)
- Store product IDs array in order object: `products: ['prod_1', 'prod_2']`

---

## 🔍 Query Patterns

### Get all categories:
```typescript
const categories = await kv.getByPrefix('category:');
```

### Get products by category:
```typescript
const allProducts = await kv.getByPrefix('product:');
const categoryProducts = allProducts.filter(p => p.category_id === 'cat_1');
```

### Get order with product details:
```typescript
const order = await kv.get('order:order_1');
const products = await kv.mget(order.products.map(id => `product:${id}`));
```

### Get library packs for a product:
```typescript
const allPacks = await kv.getByPrefix('library_pack:');
const productPacks = allPacks.filter(pack => pack.product_id === 'prod_7');
```

---

## ✅ Advantages of KV Store Approach

1. **No Schema Migrations** - Add new fields anytime
2. **Flexible Structure** - JSON values can have any structure
3. **Fast Reads** - Direct key lookups are very fast
4. **Easy Prototyping** - Perfect for MVP and demos
5. **No Join Complexity** - Simple key-based queries

---

## 📝 Notes

- All timestamps in ISO 8601 format
- Prices in USD (with TZS conversion in frontend)
- File sizes in GB (gigabytes)
- IDs use prefixes: cat_, prod_, pack_, order_
- User authentication handled by Supabase Auth (separate from KV store)
