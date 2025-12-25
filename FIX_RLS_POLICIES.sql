-- ==============================================================================
-- 🚨 CRITICAL FIX: Run this SQL in your Supabase Dashboard SQL Editor
-- This fixes the "403 Forbidden" errors when saving/viewing data
-- ==============================================================================

-- 1. Enable RLS on the KV store table (if not already enabled)
ALTER TABLE kv_store_bbbda4f3 ENABLE ROW LEVEL SECURITY;

-- 2. Allow PUBLIC (everyone) to READ data (needed for the store front)
CREATE POLICY "Public Read Access"
ON kv_store_bbbda4f3
FOR SELECT
TO public
USING (true);

-- 3. Allow AUTHENTICATED users (Admins) to ALL operations (Create, Update, Delete)
CREATE POLICY "Admin Full Access"
ON kv_store_bbbda4f3
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow SERVICE ROLE (Edge Functions/Seed Scripts) to ALL operations
-- Note: Service role bypasses RLS by default, but this ensures explicit access
CREATE POLICY "Service Role Full Access"
ON kv_store_bbbda4f3
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- ✅ HOW TO RUN:
-- 1. Go to https://supabase.com/dashboard/project/hetkbfmltdayxjcjlcow/sql/new
-- 2. Paste this entire file content
-- 3. Click "Run"
-- ==============================================================================
