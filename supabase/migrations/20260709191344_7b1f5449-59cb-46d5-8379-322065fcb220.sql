
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS confirmed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS confirm_token text,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirm_token_expires_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_confirm_token_key
  ON public.newsletter_subscribers (confirm_token)
  WHERE confirm_token IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key
  ON public.newsletter_subscribers (lower(email));
