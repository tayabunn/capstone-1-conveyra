-- =====================================================================
-- CONVEYRA SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY POLICIES
-- =====================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Input Context
    original_thought TEXT NOT NULL,
    recipient TEXT NOT NULL,
    communication_goal TEXT NOT NULL DEFAULT 'Request action',
    channel TEXT NOT NULL DEFAULT 'Email',
    tone TEXT NOT NULL,
    length TEXT NOT NULL,
    rough_draft TEXT,
    
    -- AI Generated Output
    generated_message TEXT NOT NULL,
    rationale TEXT NOT NULL,
    alternative TEXT NOT NULL,
    context_analysis JSONB,
    
    -- State & Metadata
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. High-Performance Composite Indexes for User Queries
CREATE INDEX IF NOT EXISTS idx_messages_user_created 
    ON public.messages (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_user_favorite 
    ON public.messages (user_id, is_favorite) 
    WHERE is_favorite = true;

-- 4. Enable Row Level Security (MANDATORY)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Strict RLS Policies Enforcing auth.uid() Ownership
-- Note: Using 'TO authenticated' and '(select auth.uid()) = user_id' per Supabase best practices

-- Policy 1: SELECT (Users can ONLY view their own records)
DROP POLICY IF EXISTS "Users can read own messages" ON public.messages;
CREATE POLICY "Users can read own messages"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- Policy 2: INSERT (Users can ONLY insert records matching their authenticated UID)
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
CREATE POLICY "Users can insert own messages"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policy 3: UPDATE (Users can ONLY update their own records and cannot reassign user_id)
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
CREATE POLICY "Users can update own messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policy 4: DELETE (Users can ONLY delete their own records)
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
CREATE POLICY "Users can delete own messages"
    ON public.messages
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- 6. Grant Necessary Privileges to Authenticated Role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
