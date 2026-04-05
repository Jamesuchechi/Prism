-- 1. Enable RLS on the prisms table
ALTER TABLE prisms ENABLE ROW LEVEL SECURITY;

-- 2. Create policies
-- SELECT: Users can see their own prisms
CREATE POLICY "Users can view own prisms" ON prisms
  FOR SELECT USING (auth.uid() = user_id);

-- SELECT: Anyone can view shared prisms via token
CREATE POLICY "Anyone can view shared prisms" ON prisms
  FOR SELECT USING (share_token IS NOT NULL);

-- INSERT: Users can only insert their own prisms
CREATE POLICY "Users can insert own prisms" ON prisms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own prisms (renaming/sharing)
CREATE POLICY "Users can update own prisms" ON prisms
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: Users can only delete their own prisms
CREATE POLICY "Users can delete own prisms" ON prisms
  FOR DELETE USING (auth.uid() = user_id);

-- Optional: If you want to allow anonymous saving later,
-- you'd add a policy for authenticated users only, 
-- but our use-case is already handled by INSERT policy.
