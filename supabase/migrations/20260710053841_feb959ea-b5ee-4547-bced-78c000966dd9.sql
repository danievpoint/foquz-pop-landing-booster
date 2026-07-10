-- Lock down SECURITY DEFINER helper functions and set an immutable search_path.
-- These helpers wrap pgmq operations and are only meant to be called by the
-- service_role from edge functions / cron; anon and authenticated must not
-- be able to execute them.

-- enqueue_email
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;

-- read_email_batch
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;

-- delete_email
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;

-- move_to_dlq
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pg_temp;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- email_queue_dispatch (cron-only)
REVOKE ALL ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;
