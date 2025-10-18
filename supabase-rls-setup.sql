-- ==========================================
-- Supabase Row Level Security (RLS) Setup
-- for Codev Media CMS
-- ==========================================

-- Step 1: Enable Row Level Security on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policy if it exists (for re-running this script)
DROP POLICY IF EXISTS "Users can manage their own posts" ON posts;

-- Step 3: Create policy allowing users to manage their own posts
-- This policy applies to all operations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can manage their own posts"
ON posts FOR ALL
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Step 4: Add foreign key constraint linking author_id to auth.users
-- This ensures data integrity and allows ON DELETE SET NULL behavior
ALTER TABLE posts
ADD CONSTRAINT fk_posts_author
FOREIGN KEY (author_id)
REFERENCES auth.users (id)
ON DELETE SET NULL;

-- Optional: Create policy for public read access to published posts
-- Uncomment if you want unauthenticated users to read published posts
-- DROP POLICY IF EXISTS "Public can view published posts" ON posts;
-- CREATE POLICY "Public can view published posts"
-- ON posts FOR SELECT
-- USING (status = 'published');

-- Optional: Create policy for admins to manage all posts
-- Uncomment and modify if you have admin users
-- DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;
-- CREATE POLICY "Admins can manage all posts"
-- ON posts FOR ALL
-- USING (
--   auth.uid() IN (
--     SELECT id FROM auth.users WHERE email IN ('admin@example.com')
--   )
-- );

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'posts';

