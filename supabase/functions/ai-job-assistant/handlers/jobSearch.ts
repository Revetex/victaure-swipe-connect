import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handleJobSearch(message: string, profile: any, supabase: SupabaseClient) {
  console.log('Searching jobs with message:', message);
  
  try {
    // Extraire les informations pertinentes du message
    const keywords = extractKeywords(message);
    const location = extractLocation(message);
    const jobType = extractJobType(message);
    
    console.log('Search parameters:', { keywords, location, jobType });

    // Recherche des emplois réguliers
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open');

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (jobType) {
      query = query.eq('contract_type', jobType);
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      console.error('Error fetching regular jobs:', jobsError);
      throw jobsError;
    }

    // Recherche des emplois scrapés
    let scrapedQuery = supabase
      .from('scraped_jobs')
      .select('*');

    if (location) {
      scrapedQuery = scrapedQuery.ilike('location', `%${location}%`);
    }

    const { data: scrapedJobs, error: scrapedError } = await scrapedQuery;

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

    // Filtrer par mots-clés si présents
    const filteredJobs = keywords.length > 0 
      ? formattedJobs.filter(job => 
          keywords.some(keyword => 
            job.title?.toLowerCase().includes(keyword) || 
            job.description?.toLowerCase().includes(keyword)
          )
        )
      : formattedJobs;

    // Trier par pertinence et date
    const sortedJobs = filteredJobs.sort((a, b) => {
      const dateA = new Date(a.created_at || a.posted_at);
      const dateB = new Date(b.created_at || b.posted_at);
      return dateB.getTime() - dateA.getTime();
    });

    if (sortedJobs.length === 0) {
      return {
        message: `Je n'ai pas trouvé d'offres d'emploi correspondant exactement à vos critères. Voici quelques suggestions :`,
        suggestedActions: [
          {
            type: 'navigate_to_jobs',
            label: 'Voir toutes les offres',
            icon: 'briefcase'
          },
          {
            type: 'create_job',
            label: 'Publier une offre',
            icon: 'plus'
          }
        ]
      };
    }

    const responseMessage = generateResponseMessage(sortedJobs.length, location, jobType);

    return {
      message: responseMessage,
      jobs: sortedJobs.slice(0, 5)
    };

  } catch (error) {
    console.error('Error in handleJobSearch:', error);
    return {
      message: "Je m'excuse, j'ai rencontré une erreur lors de la recherche. Pouvez-vous réessayer?",
      error: error.message
    };
  }
}

function extractKeywords(message: string): string[] {
  const text = message.toLowerCase();
  const keywords = [];
  
  // Mots-clés liés à la construction
  const constructionKeywords = [
    'construction', 'chantier', 'bâtiment', 'maçon', 'charpentier',
    'plombier', 'électricien', 'peintre', 'menuisier', 'gestion'
  ];

  for (const keyword of constructionKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  return keywords;
}

function extractLocation(message: string): string {
  const cities = [
    'trois-rivieres', 'trois rivieres', 'trois-rivières', 'trois rivières',
    'montreal', 'montréal', 'quebec', 'québec', 'laval', 'gatineau',
    'sherbrooke', 'saguenay', 'levis', 'lévis'
  ];
  
  const text = message.toLowerCase();
  for (const city of cities) {
    if (text.includes(city)) {
      return city.includes('trois') ? 'Trois-Rivieres' : 
             city.startsWith('montreal') ? 'Montreal' :
             city.startsWith('quebec') ? 'Quebec' : 
             city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  
  return '';
}

function extractJobType(message: string): string | null {
  const text = message.toLowerCase();
  
  if (text.includes('temps plein') || text.includes('permanent')) {
    return 'full-time';
  }
  if (text.includes('temps partiel')) {
    return 'part-time';
  }
  if (text.includes('contractuel') || text.includes('contrat')) {
    return 'contract';
  }
  if (text.includes('temporaire')) {
    return 'temporary';
  }
  
  return null;
}

function generateResponseMessage(count: number, location?: string, jobType?: string): string {
  let message = `J'ai trouvé ${count} offre${count > 1 ? 's' : ''} d'emploi`;
  
  if (location) {
    message += ` à ${location}`;
  }
  
  if (jobType) {
    const types: Record<string, string> = {
      'full-time': 'à temps plein',
      'part-time': 'à temps partiel',
      'contract': 'en contrat',
      'temporary': 'temporaire'
    };
    message += ` ${types[jobType] || ''}`;
  }
  
  message += `. Voici les plus récentes :`;
  
  return message;
}