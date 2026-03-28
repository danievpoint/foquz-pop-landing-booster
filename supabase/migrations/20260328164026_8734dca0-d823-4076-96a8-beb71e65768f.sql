-- 1. Check constraint for valid email format (NOT VALID to skip existing rows)
ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') NOT VALID;

-- 2. Drop old permissive INSERT policy and replace with stricter one
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL
  AND length(trim(email)) > 0
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);