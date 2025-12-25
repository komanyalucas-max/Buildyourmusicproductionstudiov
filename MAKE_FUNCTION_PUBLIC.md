# Making Pesapal Proxy Function Publicly Accessible

## The Issue

Your Supabase Edge Function is returning 401 errors because it requires authentication, but we don't have the correct Supabase JWT tokens.

## Solution: Make the Function Public

You need to configure the Edge Function to allow **anonymous access** (no authentication required).

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to your Edge Functions page:
   ```
   https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/functions
   ```

2. Click on the `pesapal-proxy` function

3. Click on **Settings** or **Configure**

4. Look for **"Verify JWT"** or **"Require Authentication"** setting

5. **Disable** or **Turn OFF** the JWT verification

6. Save the changes

### Option 2: Via Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref hetkbfmltdayxjcjlcow

# Deploy with --no-verify-jwt flag
supabase functions deploy pesapal-proxy --no-verify-jwt
```

### Option 3: Update Function Configuration File

Create a file at `supabase/functions/pesapal-proxy/config.toml`:

```toml
[function.pesapal-proxy]
verify_jwt = false
```

Then redeploy the function.

## After Making It Public

Once the function is public, you can test it without authentication:

```bash
curl -X POST https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy \
  -H "Content-Type: application/json" \
  -d '{"action":"auth"}'
```

You should get a response with a Pesapal token (not a 401 error).

## Security Note

⚠️ **Making the function public means anyone can call it!**

This is generally OK for a proxy function like this because:
- The Pesapal credentials are already in the function code (server-side)
- The function only proxies specific Pesapal API calls
- There's no sensitive user data being exposed

However, for production, consider:
- Adding rate limiting
- Adding request validation
- Using Supabase Auth to protect the function

## Alternative: Get the Real Supabase Keys

If you want to keep authentication enabled, you MUST get the real Supabase JWT tokens:

1. Go to: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/settings/api
2. Copy the **"anon public"** key (starts with `eyJ...`)
3. Update `utils/supabase/info.tsx` with the real key

The keys you provided (`sb_publishable_...` and `sb_secret_...`) are NOT Supabase keys and won't work.
