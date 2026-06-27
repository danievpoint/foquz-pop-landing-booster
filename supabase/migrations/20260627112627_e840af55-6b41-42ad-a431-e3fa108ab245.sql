
-- 1. Prevent authenticated users from changing their promo_code (fix promo_code_escalation)
CREATE OR REPLACE FUNCTION public.prevent_promo_code_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow only when there is no authenticated end-user context (i.e. service_role / trigger / admin)
  IF auth.uid() IS NOT NULL AND NEW.promo_code IS DISTINCT FROM OLD.promo_code THEN
    RAISE EXCEPTION 'promo_code cannot be modified by users';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_promo_code_change ON public.profiles;
CREATE TRIGGER profiles_prevent_promo_code_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_promo_code_change();

-- 2. Explicit deny-by-default for profiles INSERT from clients (handle_new_user trigger uses SECURITY DEFINER so it bypasses RLS)
DROP POLICY IF EXISTS "No client inserts on profiles" ON public.profiles;
CREATE POLICY "No client inserts on profiles"
ON public.profiles
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- 3. Harden withdrawal_requests: ensure no client can read/write directly (Edge Function uses service_role which bypasses RLS)
REVOKE ALL ON public.withdrawal_requests FROM anon, authenticated;
GRANT ALL ON public.withdrawal_requests TO service_role;
