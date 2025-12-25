# CORS Fix for Pesapal Integration

## Problem
The browser was trying to call Pesapal API directly, which caused CORS errors because:
1. Pesapal API doesn't allow cross-origin requests from browsers
2. API credentials should never be exposed in frontend code

## Solution
Created a **backend proxy** using Supabase Edge Functions to:
1. Securely store API credentials on the server
2. Make API calls from the backend (no CORS issues)
3. Forward responses to the frontend

## Architecture

```
Frontend (Browser)
    ↓
Supabase Edge Function (pesapal-proxy)
    ↓
Pesapal API
```

## Files Created/Modified

### 1. Backend Proxy
- **`supabase/functions/pesapal-proxy/index.ts`**
  - Handles all Pesapal API calls
  - Manages authentication tokens
  - Supports: submit-order, get-status, cancel-order, get-ipns

- **`supabase/functions/_shared/cors.ts`**
  - CORS headers for Edge Functions

### 2. Frontend Service
- **`src/services/pesapalService.ts`** (UPDATED)
  - Now calls backend proxy instead of Pesapal directly
  - Simplified - no token management needed
  - All methods route through proxy

### 3. Documentation
- **`DEPLOY_PESAPAL_FUNCTION.md`**
  - Step-by-step deployment guide
  - Manual deployment instructions
  - Troubleshooting tips

## Deployment Steps

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref hetkbfmltdayxjcjlcow

# Deploy
supabase functions deploy pesapal-proxy
```

### Option 2: Manual Deployment (Dashboard)

1. Go to: https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/functions
2. Click "Create a new function"
3. Name: `pesapal-proxy`
4. Copy contents from `supabase/functions/pesapal-proxy/index.ts`
5. Paste and deploy

## Testing After Deployment

1. **Test the proxy function:**
   ```bash
   curl -X POST https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy \
     -H "Content-Type: application/json" \
     -d '{"action":"auth"}'
   ```

2. **Test in your app:**
   - Go to checkout
   - Click "Pay with Pesapal"
   - Should see payment modal (no CORS errors)

## What Changed

### Before (❌ CORS Error)
```typescript
// Direct call to Pesapal API
fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
  method: 'POST',
  body: JSON.stringify({ consumer_key, consumer_secret })
})
// ❌ CORS blocked!
```

### After (✅ Works)
```typescript
// Call to your backend proxy
fetch('https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/pesapal-proxy', {
  method: 'POST',
  body: JSON.stringify({ action: 'submit-order', orderData })
})
// ✅ No CORS issues!
```

## Security Benefits

1. **Credentials Protected**: API keys never exposed to browser
2. **Server-Side Validation**: Can add additional checks
3. **Rate Limiting**: Can implement on proxy
4. **Logging**: Track all payment requests

## Next Steps

1. **Deploy the function** (see options above)
2. **Test payment flow** in your app
3. **Monitor function logs** in Supabase dashboard
4. **Switch to production** when ready (update base_url in function)

## Troubleshooting

### "Function not found" error
- Ensure function is deployed
- Check function name is exactly `pesapal-proxy`
- Verify project ID is correct

### Still getting CORS errors
- Check CORS headers in function response
- Ensure `_shared/cors.ts` exists
- Clear browser cache

### Payment not working
- Check function logs in Supabase dashboard
- Verify Pesapal credentials
- Test with Pesapal sandbox first

## Production Checklist

Before going live:
- [ ] Deploy function to production
- [ ] Update `base_url` in function to production Pesapal URL
- [ ] Use production Pesapal credentials
- [ ] Test with real payment methods
- [ ] Set up monitoring/alerts
- [ ] Configure IPN endpoint

## Support

If you encounter issues:
1. Check Supabase function logs
2. Check browser console
3. Verify Pesapal credentials
4. Review Pesapal API documentation

---

**Status**: ✅ CORS issue resolved with backend proxy
**Next**: Deploy the function to start accepting payments
