import { SupabaseClient } from "@supabase/supabase-js";

export async function handleJobSearch(message: string, profile: any, supabase: SupabaseClient) {
  console.log('Searching jobs with message:', message);
  const location = extractLocation(message);
  
  try {
    // Recherche des emplois réguliers
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .ilike('location', `%${location}%`);

    if (jobsError) {
      console.error('Error fetching regular jobs:', jobsError);
      throw jobsError;
    }

    // Recherche des emplois scrapés
    const { data: scrapedJobs, error: scrapedError } = await supabase
      .from('scraped_jobs')
      .select('*')
      .ilike('location', `%${location}%`);

    if (scrapedError) {
      console.error('Error fetching scraped jobs:', scrapedError);
      throw scrapedError;
    }

    console.log(`Found ${jobs?.length || 0} regular jobs and ${scrapedJobs?.length || 0} scraped jobs`);

    // Combine et formate les résultats
    const formattedJobs = [
      ...(jobs || []).map(job => ({
        ...job,
        source: 'Victaure'
      })),
      ...(scrapedJobs || []).map(job => ({
        ...job,
        source: 'Externe'
      }))
    ];

    // Trie par date de création/publication
    const sortedJobs = formattedJobs.sort((a, b) => {
      const dateA = new Date(a.created_at || a.posted_at);
      const dateB = new Date(b.created_at || b.posted_at);
      return dateB.getTime() - dateA.getTime();
    });

    if (sortedJobs.length === 0) {
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
      message: `J'ai trouvé ${sortedJobs.length} offres d'emploi à ${location}. Voici les plus récentes :`,
      jobs: sortedJobs.slice(0, 5)
    };

  } catch (error) {
    console.error('Error in handleJobSearch:', error);
    return {
      message: "Désolé, j'ai rencontré une erreur lors de la recherche d'emplois. Pouvez-vous réessayer ?",
      error: error.message
    };
  }
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