# 📋 Manual Deployment Guide - Pesapal Proxy

## ✅ Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Click this link: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/functions
2. Log in if needed

### Step 2: Create New Function
1. Click the green **"Create a new function"** button
2. In the "Function name" field, type: `pesapal-proxy`
3. Leave other settings as default

### Step 3: Copy the Code
1. Open the file: `PESAPAL_PROXY_STANDALONE.ts` (in your project root)
2. Select ALL the code (Ctrl+A)
3. Copy it (Ctrl+C)

### Step 4: Paste and Deploy
1. In the Supabase editor, paste the code (Ctrl+V)
2. Click the **"Deploy function"** button
3. Wait for deployment to complete (usually 10-30 seconds)

### Step 5: Verify Deployment
You should see:
- ✅ Function status: "Active"
- ✅ Function URL: `https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy`

---

## 🧪 Test the Function

After deployment, test it:

1. Open your browser console (F12)
2. Run this code:

```javascript
fetch('https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'auth' })
})
.then(r => r.json())
.then(console.log)
```

You should see a response with `{ token: "...", success: true }`

---

## 🎉 Done!

Once deployed:
1. Go to your app checkout page
2. Click "Pay with Pesapal"
3. Payment modal should open without CORS errors!

---

## 🆘 Troubleshooting

### "Function not found" error
- Double-check the function name is exactly: `pesapal-proxy`
- Ensure deployment completed successfully

### Still getting CORS errors
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh the page (Ctrl+F5)
- Check function logs in Supabase dashboard

### Payment not working
1. Go to Supabase dashboard > Edge Functions > pesapal-proxy
2. Click "Logs" tab
3. Look for error messages
4. Share the error here for help

---

## 📁 Files Reference

- **Code to deploy**: `PESAPAL_PROXY_STANDALONE.ts`
- **Full documentation**: `CORS_FIX_README.md`
- **This guide**: `MANUAL_DEPLOYMENT_GUIDE.md`
