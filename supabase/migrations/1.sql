
-- D'abord, ajoutons la fonction get_auth_user
CREATE OR REPLACE FUNCTION get_auth_user() RETURNS uuid AS $$
  SELECT auth.uid()
$$ LANGUAGE sql STABLE;

-- Ensuite, mettons à jour le search_path des fonctions
ALTER FUNCTION public.verify_message_integrity() SET search_path = 'public';
ALTER FUNCTION public.set_trial_end_date() SET search_path = 'public';
