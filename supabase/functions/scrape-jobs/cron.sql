
-- Activer l'extension pg_cron si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Programmer l'exécution du scraper toutes les 6 heures
SELECT cron.schedule(
  'scrape-jobs-every-6-hours',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mfjllillnpleasclqabb.supabase.co/functions/v1/scrape-jobs',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mamxsaWxsbnBsZWFzY2xxYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjI0NjAsImV4cCI6MjA1MDU5ODQ2MH0.N6tcfkT23zJcZm-kcP2_KYfN1G8e_cuaLf_vd20Vu7E"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Nettoyer les emplois expirés tous les jours à minuit
SELECT cron.schedule(
  'clean-expired-jobs-daily',
  '0 0 * * *',
  $$
  DELETE FROM scraped_jobs
  WHERE posted_at < NOW() - INTERVAL '30 days';
  $$
);
