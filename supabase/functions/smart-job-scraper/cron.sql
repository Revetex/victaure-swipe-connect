
-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Programmer l'exécution du scraper toutes les 4 heures
SELECT cron.schedule(
  'scrape-jobs-every-4-hours',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mfjllillnpleasclqabb.supabase.co/functions/v1/smart-job-scraper',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
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
  WHERE posted_at < NOW() - INTERVAL '30 days'
  OR relevance_score < 5;
  $$
);
