ALTER TABLE public.withdrawal_requests ALTER COLUMN customer_address DROP NOT NULL;
ALTER TABLE public.withdrawal_requests ALTER COLUMN order_date DROP NOT NULL;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS contract_description text;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS received_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS confirmation_error text;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS notification_error text;
CREATE INDEX IF NOT EXISTS withdrawal_requests_ip_created_idx ON public.withdrawal_requests (ip_address, created_at);