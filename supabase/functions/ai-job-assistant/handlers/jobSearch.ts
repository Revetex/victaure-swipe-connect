import { SupabaseClient } from "@supabase/supabase-js";

export async function handleJobSearch(message: string, profile: any, supabase: SupabaseClient) {
  const location = extractLocation(message);
  const query = buildJobQuery(message);

  // Search for jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .ilike('location', `%${location}%`)
    .order('created_at', { ascending: false });

  if (jobsError) throw jobsError;

  // Search scraped jobs
  const { data: scrapedJobs, error: scrapedError } = await supabase
    .from('scraped_jobs')
    .select('*')
    .ilike('location', `%${location}%`)
    .order('posted_at', { ascending: false });

  if (scrapedError) throw scrapedError;

  const allJobs = [...(jobs || []), ...(scrapedJobs || [])];

  if (allJobs.length === 0) {
    return {
      message: `Je n'ai pas trouvé d'offres d'emploi à ${location}. Voulez-vous voir toutes les offres disponibles ?`,
      suggestedActions: [
        {
          type: 'navigate_to_jobs',
          label: 'Voir toutes les offres',
          icon: 'briefcase'
        }
      ]
    };
  }

  return {
    message: `J'ai trouvé ${allJobs.length} offres d'emploi à ${location}. Voici les plus récentes :`,
    jobs: allJobs.slice(0, 5),
    suggestedActions: [
      {
        type: 'navigate_to_jobs',
        label: 'Voir toutes les offres',
        icon: 'briefcase'
      }
    ]
  };
}

function extractLocation(message: string): string {
  const cities = ['trois-rivieres', 'trois rivieres', 'trois-rivières', 'trois rivières'];
  const defaultLocation = 'Trois-Rivieres';
  
  const messageWords = message.toLowerCase().split(' ');
  for (const city of cities) {
    if (message.toLowerCase().includes(city)) {
      return defaultLocation;
    }
  }
  
  return defaultLocation;
}

function buildJobQuery(message: string): string {
  const keywords = message.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(word => word.length > 2);
  
  return keywords.join(' & ');
}