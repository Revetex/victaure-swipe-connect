CREATE OR REPLACE FUNCTION get_secret(secret_name TEXT)
RETURNS TABLE (secret TEXT)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(current_setting('app.settings.' || secret_name, true), '')::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_secret(TEXT) TO authenticated;