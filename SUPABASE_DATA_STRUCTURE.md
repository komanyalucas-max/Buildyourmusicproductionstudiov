# 📊 Your Data in Supabase - Complete Visual Guide

## 🗄️ Database Location

**Your Supabase Project**: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow

**Database Table**: `kv_store_bbbda4f3`

---

## 🔍 What the Table Looks Like

The `kv_store_bbbda4f3` table has **2 columns**:

| Column | Type | Description |
|--------|------|-------------|
| `key` | TEXT | Unique identifier (Primary Key) |
| `value` | JSONB | JSON data for the record |

---

## 📁 Data Organization

After seeding, you'll have approximately **55+ rows** organized like this:

### 1. System Settings (3 rows)

```sql
-- Row 1
key:   "settings:shipping_rates"
value: {
  "Tanzania": {
    "Dar es Salaam": 5,
    "Dodoma": 8,
    "Arusha": 10,
    "Mwanza": 12,
    "Zanzibar": 15,
    "Other": 10
  },
  "Kenya": {"Nairobi": 15, "Mombasa": 18, "Other": 20},
  "Uganda": {"Kampala": 20, "Other": 25},
  "Rwanda": {"Kigali": 25, "Other": 30},
  "Burundi": {"Bujumbura": 30, "Other": 35}
}

-- Row 2
key:   "settings:currency_rate"
value: {"usd_to_tzs": 2500}

-- Row 3
key:   "settings:tax_rate"
value: {"rate": 0.18, "name": "VAT"}
```

---

### 2. Categories (4 rows)

```sql
-- Row 1
key:   "category:cat_1"
value: {
  "id": "cat_1",
  "name": "DAW (Where You Make Music)",
  "name_sw": "DAW (Programu Kuu ya Kutengeneza Muziki)",
  "description": "Your main workspace for creating, recording, and arranging music",
  "description_sw": "Programu kuu ya kurekodi na kuandaa muziki",
  "icon": "Music",
  "helper_text": "You usually only need one",
  "helper_text_sw": "Kwa kawaida unahitaji moja tu",
  "order": 1,
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Row 2
key:   "category:cat_2"
value: {
  "id": "cat_2",
  "name": "Instruments (Sound Makers)",
  "name_sw": "Vyombo vya Muziki (Vya Dijitali)",
  ...
}

-- Rows 3-4: cat_3, cat_4
```

---

### 3. Products (20 rows)

```sql
-- Row 1
key:   "product:prod_1"
value: {
  "id": "prod_1",
  "category_id": "cat_1",
  "name": "Reaper",
  "description": "Lightweight, affordable, and powerful for beginners",
  "file_size": 0.3,
  "is_free": false,
  "price": 60,
  "features": ["Multi-track recording", "VST support", "64-bit mixing"],
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Row 2
key:   "product:prod_2"
value: {
  "id": "prod_2",
  "category_id": "cat_1",
  "name": "FL Studio",
  "description": "Popular for electronic music and beats",
  "file_size": 4.5,
  "is_free": false,
  "price": 199,
  "features": ["Step sequencer", "Piano roll", "Lifetime updates"],
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Rows 3-20: prod_3 through prod_20
```

**Product List (IDs prod_1 to prod_20):**
1. Reaper
2. FL Studio
3. Ableton Live Standard
4. Logic Pro (Mac only)
5. GarageBand (Mac/iOS)
6. Cakewalk by BandLab
7. Studio One Professional
8. Vital
9. Serum
10. Kontakt 7
11. Spitfire LABS
12. Omnisphere 2
13. FabFilter Pro-Q 3
14. Valhalla VintageVerb
15. TDR Nova (Free)
16. Soundtoys 5 Bundle
17. iZotope Ozone 10
18. Splice Sounds (Monthly)
19. Loopcloud
20. Native Instruments Komplete 14

---

### 4. Library Packs (8 rows)

```sql
-- Row 1
key:   "library_pack:pack_1"
value: {
  "id": "pack_1",
  "product_id": "prod_8",
  "name": "Vital Presets Vol.1",
  "description": "100+ professional presets",
  "file_size": 0.5,
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Rows 2-8: pack_2 through pack_8
```

---

### 5. Storage Devices (7 rows)

```sql
-- Row 1
key:   "storage_device:usb_32gb"
value: {
  "id": "usb_32gb",
  "name": "32GB USB Flash Drive",
  "type": "usb",
  "capacity_gb": 32,
  "price_usd": 8,
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Row 2
key:   "storage_device:usb_64gb"
value: {
  "id": "usb_64gb",
  "name": "64GB USB Flash Drive",
  "type": "usb",
  "capacity_gb": 64,
  "price_usd": 12,
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Rows 3-7: usb_128gb, ssd_250gb, ssd_500gb, ssd_1tb, ssd_2tb
```

---

### 6. Demo Orders (5 rows)

```sql
-- Row 1
key:   "order:order_1"
value: {
  "id": "order_1",
  "customer_name": "John Doe",
  "customer_email": "customer1@example.com",
  "customer_phone": "+255 123 456 789",
  "shipping_country": "Tanzania",
  "shipping_city": "Dar es Salaam",
  "shipping_address": "123 Main Street, Kinondoni",
  "products": ["prod_2", "prod_9", "prod_13"],
  "product_details": [
    {"id": "prod_2", "name": "FL Studio", "price": 199, "size": 4.5},
    {"id": "prod_9", "name": "Serum", "price": 189, "size": 1.2},
    {"id": "prod_13", "name": "FabFilter Pro-Q 3", "price": 169, "size": 0.5}
  ],
  "storage_device": "ssd_1tb",
  "total_storage_gb": 6.2,
  "subtotal_usd": 557,
  "shipping_cost_usd": 5,
  "total_usd": 562,
  "currency": "USD",
  "status": "completed",
  "created_at": "2025-12-16T14:00:00.000Z"
}

-- Rows 2-5: order_2 through order_5
```

---

### 7. Analytics (1 row)

```sql
key:   "analytics:overview"
value: {
  "total_revenue": 2368,
  "total_orders": 5,
  "completed_orders": 2,
  "pending_orders": 1,
  "processing_orders": 1,
  "cancelled_orders": 1,
  "updated_at": "2025-12-23T14:00:00.000Z"
}
```

---

### 8. User Metadata (4 rows)

```sql
-- Row 1
key:   "user:{uuid}"
value: {
  "id": "{uuid}",
  "email": "customer1@example.com",
  "name": "John Doe",
  "role": "customer",
  "phone": "+255 123 456 789",
  "country": "Tanzania",
  "city": "Dar es Salaam",
  "created_at": "2025-12-23T14:00:00.000Z"
}

-- Rows 2-4: Other user metadata
```

**Note**: User authentication is handled separately by Supabase Auth, but we store additional metadata in the KV store.

---

## 🔎 How to Query This Data

### From Frontend (TypeScript/JavaScript):

```typescript
// Get all products
const products = await kv.getByPrefix('product:');

// Get single category
const category = await kv.get('category:cat_1');

// Get products by category
const allProducts = await kv.getByPrefix('product:');
const dawProducts = allProducts.filter(p => p.category_id === 'cat_1');

// Get order with details
const order = await kv.get('order:order_1');
```

### From Supabase Dashboard (SQL):

```sql
-- Get all categories
SELECT * FROM kv_store_bbbda4f3 
WHERE key LIKE 'category:%';

-- Get all products
SELECT * FROM kv_store_bbbda4f3 
WHERE key LIKE 'product:%';

-- Get specific product
SELECT * FROM kv_store_bbbda4f3 
WHERE key = 'product:prod_1';

-- Get all orders
SELECT * FROM kv_store_bbbda4f3 
WHERE key LIKE 'order:%';

-- Get settings
SELECT * FROM kv_store_bbbda4f3 
WHERE key LIKE 'settings:%';
```

---

## 📊 Total Row Count After Seeding

| Key Pattern | Count | Examples |
|-------------|-------|----------|
| `settings:*` | 3 | shipping_rates, currency_rate, tax_rate |
| `category:*` | 4 | cat_1, cat_2, cat_3, cat_4 |
| `product:*` | 20 | prod_1 to prod_20 |
| `library_pack:*` | 8 | pack_1 to pack_8 |
| `storage_device:*` | 7 | usb_32gb, usb_64gb, ssd_1tb, etc. |
| `order:*` | 5 | order_1 to order_5 |
| `analytics:*` | 1 | overview |
| `user:*` | ~4 | User metadata (UUIDs) |
| **TOTAL** | **~52+** | Approximate total rows |

---

## 🎯 Viewing Your Data

### Method 1: Supabase Web Dashboard

1. Visit: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/database/tables
2. Click: `kv_store_bbbda4f3`
3. Browse all rows

### Method 2: SQL Editor

1. Visit: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/sql/new
2. Run queries:

```sql
-- Count all records
SELECT COUNT(*) FROM kv_store_bbbda4f3;

-- View all keys
SELECT key FROM kv_store_bbbda4f3 ORDER BY key;

-- Search by pattern
SELECT * FROM kv_store_bbbda4f3 WHERE key LIKE 'product:%';
```

### Method 3: API Endpoints

```bash
# Get categories
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/categories

# Get products
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/products

# Get orders
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/orders
```

---

## 🔄 Data Relationships

Even though we're using a key-value store, we maintain relationships through IDs:

### Category → Products
```
category:cat_1 
  ↓ (category_id)
product:prod_1 {category_id: "cat_1"}
product:prod_2 {category_id: "cat_1"}
product:prod_3 {category_id: "cat_1"}
```

### Product → Library Packs
```
product:prod_8
  ↓ (product_id)
library_pack:pack_1 {product_id: "prod_8"}
library_pack:pack_2 {product_id: "prod_8"}
```

### Order → Products
```
order:order_1 
  ↓ (products array)
["prod_2", "prod_9", "prod_13"]
  ↓ (lookup)
product:prod_2
product:prod_9
product:prod_13
```

---

## ✅ Verification Checklist

After seeding, verify your data:

- [ ] Navigate to Supabase dashboard
- [ ] Open `kv_store_bbbda4f3` table
- [ ] See ~52+ rows
- [ ] Keys start with: category:, product:, order:, etc.
- [ ] Values are JSON objects
- [ ] Admin dashboard shows correct stats

---

## 🎉 Your Database is Live!

All your data is now safely stored in Supabase's `kv_store_bbbda4f3` table, structured and ready to use!

**The data IS in Supabase** - just organized differently than traditional SQL tables. This is the standard architecture for Figma Make applications.
