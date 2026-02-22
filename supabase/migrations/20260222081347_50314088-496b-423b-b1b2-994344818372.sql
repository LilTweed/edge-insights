
-- Add subscription tier to profiles
ALTER TABLE public.profiles
ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free',
ADD COLUMN subscription_expires_at timestamp with time zone;

-- Create a validation trigger for tier values
CREATE OR REPLACE FUNCTION public.validate_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subscription_tier NOT IN ('free', 'basic', 'advanced') THEN
    RAISE EXCEPTION 'Invalid subscription tier: %', NEW.subscription_tier;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_subscription_tier_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_subscription_tier();
