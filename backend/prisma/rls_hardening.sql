-- ====================================================================
-- SUPABASE POSTGRESQL RLS & POSTGREST HARDENING MIGRATION
-- Conveyra Security Architecture: Server-side only (Option 3 + Strict Policies)
-- ====================================================================

-- 1. Enable Row Level Security on all public tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Revoke all direct PostgREST Data API access from anonymous public clients
REVOKE ALL ON TABLE public.users FROM anon;
REVOKE ALL ON TABLE public.messages FROM anon;

-- 3. Revoke direct modifications from 'authenticated' clients (all access is managed via trusted server routes)
REVOKE ALL ON TABLE public.users FROM authenticated;
REVOKE ALL ON TABLE public.messages FROM authenticated;

-- 4. Re-grant only to database service roles (postgres, service_role)
GRANT ALL ON TABLE public.users TO postgres, service_role;
GRANT ALL ON TABLE public.messages TO postgres, service_role;

-- 5. Add restrictive RLS policies as a defense-in-depth guarantee
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Deny direct client access to users'
    ) THEN
        CREATE POLICY "Deny direct client access to users"
        ON public.users
        FOR ALL
        TO anon, authenticated
        USING (false);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Deny direct client access to messages'
    ) THEN
        CREATE POLICY "Deny direct client access to messages"
        ON public.messages
        FOR ALL
        TO anon, authenticated
        USING (false);
    END IF;
END $$;
