# 🌱 Seed Your Database - Step by Step

## 🎯 Two Ways to Seed Your Database

---

## ✨ Method 1: Using the Admin Dashboard (Easiest!)

### **Step 1: Open Your App**
Your application should be running in the preview/browser.

### **Step 2: Click Admin Dashboard**
In the top navigation bar, click the purple button that says **"Admin Dashboard"**

### **Step 3: Click Seed Button**
On the dashboard Overview page, you'll see a big green button:
```
🚀 Seed Complete Demo Data
```
**Click this button once!**

### **Step 4: Wait for Success**
You'll see:
- Loading state: "🌱 Seeding Database..."
- Success message: "✅ Demo data seeded successfully! 4 users, 4 categories, 20 products..."
- Updated stats showing your data counts

### **Step 5: Verify**
Check the stat cards - you should see:
- Total Products: **20**
- Categories: **4**
- Total Orders: **5**

---

## 🔧 Method 2: Using API Call Directly

### **Option A: Using cURL (Terminal)**

```bash
curl -X POST \
  https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data \
  -H "Content-Type: application/json"
```

### **Option B: Using the Shell Script**

```bash
# Make the script executable
chmod +x seed-now.sh

# Run it
./seed-now.sh
```

### **Expected Response:**

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
  },
  "analytics": {
    "total_revenue": 2368,
    "total_orders": 5,
    "completed_orders": 2,
    ...
  }
}
```

---

## ✅ What Gets Created

When you seed the database, the following records are created in your Supabase `kv_store_bbbda4f3` table:

### **1. System Settings (3 records)**
- `settings:shipping_rates` - Shipping costs for 5 East African countries
- `settings:currency_rate` - USD to TZS conversion (2500)
- `settings:tax_rate` - VAT 18%

### **2. Categories (4 records)**
- `category:cat_1` - DAW (Where You Make Music)
- `category:cat_2` - Instruments (Sound Makers)
- `category:cat_3` - Effects & Audio Tools
- `category:cat_4` - Samples & Creative Tools

### **3. Products (20 records)**

#### DAWs (7 products)
- Reaper - $60
- FL Studio - $199
- Ableton Live Standard - $449
- Logic Pro (Mac only) - $199
- GarageBand (Free)
- Cakewalk by BandLab (Free)
- Studio One Professional - $399

#### Instruments (5 products)
- Vital (Free)
- Serum - $189
- Kontakt 7 - $399
- Spitfire LABS (Free)
- Omnisphere 2 - $499

#### Effects (5 products)
- FabFilter Pro-Q 3 - $169
- Valhalla VintageVerb - $50
- TDR Nova (Free)
- Soundtoys 5 Bundle - $499
- iZotope Ozone 10 - $299

#### Samples & Tools (3 products)
- Splice Sounds - $9.99/mo
- Loopcloud - $7.99/mo
- Native Instruments Komplete 14 - $599

### **4. Library Packs (8 records)**
- Vital Presets Vol.1
- Serum Preset Bank
- Kontakt Factory Library
- LABS Soft Piano
- LABS Strings
- Omnisphere Signature Sounds
- Komplete 14 Expansion: Vintage
- Komplete 14 Expansion: Cinematic

### **5. Storage Devices (7 records)**
- 32GB USB Flash Drive - $8
- 64GB USB Flash Drive - $12
- 128GB USB Flash Drive - $20
- 250GB External SSD - $45
- 500GB External SSD - $75
- 1TB External SSD - $120
- 2TB External SSD - $220

### **6. Demo Orders (5 records)**
- Order 1: John Doe - $562 (completed)
- Order 2: Jane Smith - $913 (processing)
- Order 3: Michael Producer - $80 (pending)
- Order 4: Sarah Williams - $1,806 (completed)
- Order 5: Ahmed Hassan - $15 (cancelled)

### **7. Demo Users (4 users via Supabase Auth)**
- admin@gmail.com - Super Admin
- customer1@example.com - John Doe
- customer2@example.com - Jane Smith
- producer@example.com - Michael Producer

### **8. Analytics (1 record)**
- Total revenue: $2,368
- Total orders: 5
- Completed orders: 2
- Pending orders: 1
- Processing orders: 1
- Cancelled orders: 1

---

## 🔍 How to Verify the Data

### **Check in Admin Dashboard:**
1. Open Admin Dashboard
2. Look at the stat cards
3. Should show: 20 products, 4 categories, 5 orders

### **Check in Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/database/tables
2. Click table: `kv_store_bbbda4f3`
3. You should see ~52+ rows
4. Keys will be like: `category:cat_1`, `product:prod_1`, `order:order_1`

### **Check via API:**
```bash
# Get all categories
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/categories

# Get all products
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/products

# Get all orders
curl https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/orders
```

---

## 🚨 Troubleshooting

### **Problem: Button not responding**
- Check browser console for errors
- Refresh the page
- Try the API method directly

### **Problem: "Failed to seed demo data"**
- Check that your server is running
- Verify environment variables are set
- Check server logs in Supabase dashboard

### **Problem: Data already exists**
- That's OK! The seed operation uses upsert
- It will update existing records
- Safe to run multiple times

### **Problem: Want to reset everything**
- Go to Supabase dashboard
- Delete all rows from `kv_store_bbbda4f3` table
- Run seed again

---

## 🎉 Success!

Once seeding is complete:

✅ Your database has **52+ records**
✅ All organized with proper key patterns
✅ Ready to browse and test
✅ Admin dashboard shows live stats
✅ Home page displays all products

---

## 📞 Next Steps

After successful seeding:

1. **Browse Products**: Go to home page and see all categories
2. **View Orders**: Check the Orders tab in admin
3. **Test Features**: Add products to cart, create orders
4. **Customize**: Start adding your own products!

---

**Ready to seed?** Just click that green button! 🚀
