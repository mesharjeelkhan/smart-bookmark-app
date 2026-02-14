-- ============================================================
-- Smart Bookmarks - Supabase Database Setup
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create an index for faster user-specific queries
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Users can only SELECT their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. RLS Policy: Users can only INSERT their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. RLS Policy: Users can only DELETE their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Enable Realtime for the bookmarks table
-- (Run this separately if needed - it enables realtime for the table)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- ============================================================
-- Verification: Run these to confirm setup is correct
-- ============================================================
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookmarks';
-- SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
