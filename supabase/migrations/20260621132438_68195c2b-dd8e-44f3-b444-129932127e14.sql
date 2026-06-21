CREATE TABLE public.withdrawal_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_address text NOT NULL,
  order_number text,
  order_date date NOT NULL,
  withdrawal_body text NOT NULL,
  ip_address text,
  user_agent text,
  confirmation_sent_at timestamptz,
  notification_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.withdrawal_requests TO service_role;

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: only the edge function (service role) may access this table.
-- This is intentional for legal/PII protection (Widerrufserklärungen contain personal data).