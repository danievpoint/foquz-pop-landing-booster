DROP TRIGGER IF EXISTS prevent_promo_code_change_trg ON public.profiles;
CREATE TRIGGER prevent_promo_code_change_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_promo_code_change();