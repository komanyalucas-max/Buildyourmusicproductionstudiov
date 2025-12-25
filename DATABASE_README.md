# 🗄️ Music Studio Builder - Database Documentation

## 📖 Overview
This project uses Supabase as a backend, utilizing a specific Key-Value (KV) store architecture (`kv_store_bbbda4f3` table) to maintain compatibility with Figma Make environments. This document consolidates all database architecture, implementation details, and deployment guides.

## 🗄️ Database Architecture

### The Key-Value Store
Instead of traditional SQL tables, we use a single table with structured JSON data.

**Table Name**: `kv_store_bbbda4f3`

```sql
CREATE TABLE kv_store_bbbda4f3 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Data Schema & Key Patterns
Data is organized using namespaced keys.

| Entity | Key Pattern | Description |
|--------|-------------|-------------|
| **Categories** | `category:{id}` | e.g. `category:cat_1` |
| **Products** | `product:{id}` | e.g. `product:prod_1` |
| **Library Packs** | `library_pack:{id}` | e.g. `library_pack:pack_1` |
| **Storage Devices** | `storage_device:{id}` | e.g. `storage_device:usb_32gb` |
| **Orders** | `order:{id}` | e.g. `order:order_1` |
| **Settings** | `settings:{type}` | e.g. `settings:shipping_rates` |
| **Analytics** | `analytics:overview` | Global stats |
| **Users** | `user:{uuid}` | User metadata (linked to Supabase Auth) |

---

## 📁 Data Models

### 1. Categories
```typescript
{
  id: string,             // 'cat_1'
  name: string,           // 'DAW (Where You Make Music)'
  name_sw: string,        // Swahili translation
  description: string,    // Full description
  icon: string,           // Lucide icon name
  order: number           // Display order
}
```

### 2. Products
```typescript
{
  id: string,             // 'prod_1'
  category_id: string,    // 'cat_1'
  name: string,           // 'Reaper'
  description: string,
  file_size: number,      // Size in GB
  is_free: boolean,
  price: number,          // Price in USD
  features: string[],
  created_at: string
}
```

### 3. Settings (Shipping & Currency)
Stored in `settings:shipping_rates`, `settings:currency_rate`, `settings:tax_rate`.
```json
{
  "Tanzania": {
    "Dar es Salaam": 5,
    "Dodoma": 8,
    "Other": 10
  }
}
```

---

## 🚀 Deployment & Seeding

### 1. The Seed Endpoint
The seeding logic is located at `/supabase/functions/server/seed-endpoint.tsx`. It handles:
- Clearing existing demo data (optional flag)
- Inserting 20 products, 4 categories, 5 orders, etc.
- Setting up admin credentials

### 2. How to Seed
You have three methods to populate the database:

**Method A: Admin Dashboard (Recommended)**
1. Log in to the application as Admin (`admin@gmail.com` / `pass@123`).
2. Navigate to the Admin Dashboard.
3. Click the **"🚀 Seed Complete Demo Data"** button.

**Method B: API Endpoint**
```bash
curl -X POST \
  https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data \
  -H "Content-Type: application/json"
```

---

## 🔎 Querying Data

### Via API
The backend exposes RESTful endpoints for the frontend.
- `GET /categories`
- `GET /products`
- `GET /orders`

### Via SQL (Supabase Dashboard)
You can query the JSON data directly using Postgres JSONB operators.

```sql
-- Find all products in category 'cat_1'
SELECT * FROM kv_store_bbbda4f3 
WHERE key LIKE 'product:%' 
AND value->>'category_id' = 'cat_1';

-- Get total revenue from analytics
SELECT value->>'total_revenue' as revenue 
FROM kv_store_bbbda4f3 
WHERE key = 'analytics:overview';
```

## 🔐 Credentials
| User Role | Email | Password |
|-----------|-------|----------|
| **Admin** | `admin@gmail.com` | `pass@123` |
| **Customer** | `customer1@example.com` | `demo123` |

## 📝 Attribution
See `ATTRIBUTIONS.md` for license information regarding assets used in this project.
