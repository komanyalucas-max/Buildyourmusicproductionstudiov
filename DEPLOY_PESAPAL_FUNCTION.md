# Deploying Pesapal Proxy to Supabase

## Prerequisites
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref ${projectId}
   ```

## Deploy the Function

```bash
supabase functions deploy pesapal-proxy
```

## Alternative: Manual Deployment via Supabase Dashboard

If CLI doesn't work, you can deploy manually:

1. Go to https://supabase.com/dashboard/project/${projectId}/functions
2. Click "Create a new function"
3. Name it: `pesapal-proxy`
4. Copy the contents of `supabase/functions/pesapal-proxy/index.ts`
5. Paste into the editor
6. Click "Deploy"

## Verify Deployment

Test the function:
```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/pesapal-proxy \
  -H "Content-Type: application/json" \
  -d '{"action":"auth"}'
```

You should get a response with a token.

## Environment Variables (Optional)

If you want to move credentials to environment variables:

1. Go to Project Settings > Edge Functions
2. Add secrets:
   - `PESAPAL_CONSUMER_KEY`
   - `PESAPAL_CONSUMER_SECRET`
   - `PESAPAL_IPN_ID`

3. Update the function to use `Deno.env.get('PESAPAL_CONSUMER_KEY')`

## Troubleshooting

### Function not found
- Ensure you're deploying to the correct project
- Check the function name matches exactly

### CORS errors
- The `cors.ts` file should be in `supabase/functions/_shared/`
- Ensure CORS headers are returned in all responses

### Authentication errors
- Verify credentials are correct
- Check Pesapal sandbox vs production URL
