# 🚀 Database Deployment & Import Guide

## 📋 Current Status

### ✅ What's Already Deployed:
1. **Backend Server**: Running at `https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3`
2. **KV Store Table**: `kv_store_bbbda4f3` (pre-existing in Supabase)
3. **Authentication**: Supabase Auth system
4. **API Endpoints**: All routes configured

### 🎯 What We Need to Do:
**Populate the KV store with demo data** - That's it! No migrations needed.

---

## 🗄️ Understanding the Database Architecture

### The KV Store Table (Already Exists in Supabase)

```sql
-- This table ALREADY EXISTS - you don't need to create it
CREATE TABLE kv_store_bbbda4f3 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### How We Store Data

Instead of separate tables, we use **structured keys**:

```
Key Pattern                  → Value (JSON)
─────────────────────────────────────────────────
category:cat_1              → {id, name, description, ...}
category:cat_2              → {id, name, description, ...}
product:prod_1              → {id, name, price, file_size, ...}
product:prod_2              → {id, name, price, file_size, ...}
order:order_1               → {id, customer_name, products, ...}
settings:shipping_rates     → {Tanzania: {...}, Kenya: {...}, ...}
```

**This is the ONLY way to use databases in Figma Make!**

---

## 🚀 Step-by-Step Deployment

### Step 1: Verify Server is Running

Your server should already be deployed. Test it:

```bash
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/health
```

✅ **Expected Response**: `{"status":"ok"}`

---

### Step 2: Seed the Database (Method 1 - Admin Dashboard)

**This is the EASIEST method!**

1. **Open your application** in the browser
2. **Click "Admin"** in the top navigation
3. **Login** with:
   - Email: `admin@gmail.com`
   - Password: `pass@123`
4. **Click the big button**: "🚀 Seed Complete Demo Data"
5. **Wait for success message**

✅ **Result**: All data imported into `kv_store_bbbda4f3` table!

---

### Step 3: Seed the Database (Method 2 - API Call)

If you prefer API calls:

```bash
curl -X POST \
  https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data \
  -H "Content-Type: application/json"
```

✅ **Expected Response**:
```json
{
  "success": true,
  "message": "✅ Complete database seeded successfully!",
  "stats": {
    "users": 4,
    "categories": 4,
    "products": 20,
    "library_packs": 8,
    "storage_devices": 7,
    "orders": 5,
    "settings": 3
  }
}
```

---

### Step 4: Verify Data Import

#### Option A: Check via Admin Dashboard
- Navigate to Overview tab
- Stats should show: 20 products, 4 categories, 5 orders

#### Option B: Check via API
```bash
# Get all categories
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/categories

# Get all products
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/products

# Get all orders
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/orders
```

#### Option C: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/database/tables
2. Click on `kv_store_bbbda4f3` table
3. You should see rows with keys like:
   - `category:cat_1`
   - `product:prod_1`
   - `order:order_1`
   - etc.

---

## 📊 What Gets Imported

When you seed the database, the following data is inserted into `kv_store_bbbda4f3`:

### 1. System Settings (3 records)
```
settings:shipping_rates    → Shipping costs for 5 countries
settings:currency_rate     → USD to TZS conversion (2500)
settings:tax_rate          → VAT 18%
```

### 2. Categories (4 records)
```
category:cat_1  → DAW (Where You Make Music)
category:cat_2  → Instruments (Sound Makers)
category:cat_3  → Effects & Audio Tools
category:cat_4  → Samples & Creative Tools
```

### 3. Products (20 records)
```
product:prod_1   → Reaper ($60, 0.3 GB)
product:prod_2   → FL Studio ($199, 4.5 GB)
product:prod_3   → Ableton Live Standard ($449, 3.2 GB)
... (17 more products)
product:prod_20  → Native Instruments Komplete 14 ($599, 145 GB)
```

### 4. Library Packs (8 records)
```
library_pack:pack_1  → Vital Presets Vol.1
library_pack:pack_2  → Serum Preset Bank
... (6 more packs)
```

### 5. Storage Devices (7 records)
```
storage_device:usb_32gb   → 32GB USB Flash Drive ($8)
storage_device:usb_64gb   → 64GB USB Flash Drive ($12)
storage_device:usb_128gb  → 128GB USB Flash Drive ($20)
storage_device:ssd_250gb  → 250GB External SSD ($45)
storage_device:ssd_500gb  → 500GB External SSD ($75)
storage_device:ssd_1tb    → 1TB External SSD ($120)
storage_device:ssd_2tb    → 2TB External SSD ($220)
```

### 6. Demo Orders (5 records)
```
order:order_1  → John Doe - $562 (completed)
order:order_2  → Jane Smith - $913 (processing)
order:order_3  → Michael Producer - $80 (pending)
order:order_4  → Sarah Williams - $1,806 (completed)
order:order_5  → Ahmed Hassan - $15 (cancelled)
```

### 7. Users (4 records via Supabase Auth)
```
admin@gmail.com         → Super Admin (Tanzania)
customer1@example.com   → John Doe (Tanzania)
customer2@example.com   → Jane Smith (Kenya)
producer@example.com    → Michael Producer (Uganda)
```

### 8. Analytics (1 record)
```
analytics:overview  → Revenue tracking, order statistics
```

---

## 🔍 Viewing Your Data in Supabase

### Access the Supabase Dashboard:

1. **Go to**: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow
2. **Navigate to**: Database → Tables
3. **Click**: `kv_store_bbbda4f3`

### You'll see data like this:

| key | value |
|-----|-------|
| `category:cat_1` | `{"id":"cat_1","name":"DAW (Where You Make Music)",...}` |
| `product:prod_1` | `{"id":"prod_1","name":"Reaper","price":60,...}` |
| `order:order_1` | `{"id":"order_1","customer_name":"John Doe",...}` |
| `settings:shipping_rates` | `{"Tanzania":{"Dar es Salaam":5,...},...}` |

---

## ✅ Success Checklist

After seeding, verify these items:

- [ ] KV store has ~55 records (4 categories + 20 products + 8 packs + 7 devices + 5 orders + 3 settings + etc.)
- [ ] Admin dashboard shows correct stats
- [ ] Can view products on home page
- [ ] Can view categories
- [ ] Users can login (try customer1@example.com / demo123)
- [ ] Orders are visible in admin panel

---

## 🛠️ Troubleshooting

### Problem: "Failed to seed demo data"
**Solution**: 
1. Check server logs
2. Verify environment variables are set
3. Try calling the endpoint again

### Problem: "No data showing in admin dashboard"
**Solution**:
1. Click "Seed Demo Data" button again
2. Refresh the page
3. Check browser console for errors

### Problem: "Can't login as admin"
**Solution**:
1. Click "Initialize Admin" button on login page
2. Wait for success message
3. Try logging in again

### Problem: "Want to reset all data"
**Solution**:
1. In Supabase dashboard, delete all rows from `kv_store_bbbda4f3`
2. Click "Seed Demo Data" again

---

## 🎯 Next Steps After Import

1. **Test the Application**:
   - Browse products on home page
   - Add products to cart
   - Test order creation

2. **Customize Data**:
   - Add your own products
   - Modify categories
   - Update pricing

3. **Configure Settings**:
   - Adjust shipping rates
   - Change currency conversion
   - Update tax rates

---

## 📝 Important Notes

### Why No SQL Migrations?

Figma Make **does not support**:
- ❌ Creating new tables
- ❌ Running DDL scripts
- ❌ ALTER TABLE statements
- ❌ Custom SQL migrations

Figma Make **only provides**:
- ✅ One KV store table
- ✅ Supabase Auth
- ✅ Key-value operations

### This is Actually Great For:

- ✅ **Rapid prototyping** - No schema changes needed
- ✅ **Flexibility** - Add fields anytime
- ✅ **Simplicity** - No complex joins
- ✅ **MVP development** - Perfect for demos

---

## 🎉 You're Ready!

Your database is now deployed and ready to be populated. Just click the "Seed Demo Data" button and everything will be imported into Supabase!

**Remember**: The data IS in Supabase (in the `kv_store_bbbda4f3` table), just stored as key-value pairs instead of traditional SQL tables. This is the standard architecture for Figma Make applications.
