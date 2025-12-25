# Getting Your Real Supabase API Keys

## The Problem

The keys you provided (`sb_publishable_...` and `sb_secret_...`) are **NOT** standard Supabase API keys. 

Supabase uses **JWT (JSON Web Token)** format for API keys, which look like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldGtiZm1sdGRheXhqY2psY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc...
```

## How to Get the Correct Keys

### Step 1: Go to Your Supabase Project Settings

Open this URL in your browser:
```
https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/settings/api
```

### Step 2: Find the Project API Keys Section

Scroll down to the **"Project API keys"** section. You should see:

1. **Project URL**: `https://hetkbfmltdayxjcjlcow.supabase.co`
2. **anon public**: A very long string starting with `eyJ...` (this is what you need!)
3. **service_role**: Another long string starting with `eyJ...` (keep this secret!)

### Step 3: Copy the Correct Keys

- The **anon public** key is what should go in `publicAnonKey`
- It should be **at least 200+ characters long**
- It should start with `eyJ`

## Alternative: Check if Your Project Uses a Different Authentication Method

If your Supabase project is configured differently (e.g., using custom authentication), you might need to:

1. **Disable authentication on the Edge Function** (not recommended for production)
2. **Use a different authentication method**

## Quick Test

Open your browser's developer console and run this:

```javascript
fetch('https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'YOUR_REAL_ANON_KEY_HERE',
    'Authorization': 'Bearer YOUR_REAL_ANON_KEY_HERE'
  },
  body: JSON.stringify({ action: 'auth' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Replace `YOUR_REAL_ANON_KEY_HERE` with the actual anon key from your dashboard.

## What If I Can't Find the Keys?

If you don't see the standard Supabase API keys in your dashboard, your project might be using:
- A custom authentication setup
- A different Supabase plan
- A third-party integration

In that case, please check:
1. Your Supabase project settings
2. Any environment variables or config files
3. Contact Supabase support if needed
