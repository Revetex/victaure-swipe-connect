import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface SearchContext {
  profile: any;
  previousSearches?: string[];
  jobPreferences?: {
    salary?: { min?: number; max?: number };
    location?: string;
    remote?: boolean;
    industries?: string[];
  };
}

export async function handleJobSearch(message: string, profile: any, supabase: SupabaseClient) {
  console.log('Starting enhanced job search with message:', message);
  
  try {
    // Enhanced context-aware search
    const searchContext: SearchContext = {
      profile,
      previousSearches: await getPreviousSearches(supabase, profile.id),
      jobPreferences: await getJobPreferences(supabase, profile.id)
    };

    console.log('Search context:', searchContext);

    // Enhanced keyword extraction with context
    const keywords = extractKeywords(message, searchContext);
    const location = extractLocation(message, searchContext);
    const jobType = extractJobType(message);
    const experienceLevel = extractExperienceLevel(message, profile);
    const salary = extractSalaryRange(message, searchContext);
    
    console.log('Search parameters:', { 
      keywords, 
      location, 
      jobType,
      experienceLevel,
      salary 
    });

    // Build advanced query with intelligent filtering
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!jobs_employer_id_fkey (
          full_name,
          avatar_url,
          company_name,
          industry
        )
      `)
      .eq('status', 'open');

    // Apply intelligent filters
    if (location) {
      query = query.or(`location.ilike.%${location}%,location.ilike.%${profile.city}%`);
    }

    if (jobType) {
      query = query.eq('contract_type', jobType);
    }

    if (experienceLevel) {
      query = query.eq('experience_level', experienceLevel);
    }

    if (salary?.min) {
      query = query.gte('salary_min', salary.min);
    }

    if (salary?.max) {
      query = query.lte('salary_max', salary.max);
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      console.error('Error fetching regular jobs:', jobsError);
      throw jobsError;
    }

    // Enhanced scraped jobs query with similar filters
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

    // Enhanced job formatting with AI-powered relevance scoring
    const formattedJobs = [
      ...(jobs || []).map(job => ({
        ...job,
        source: 'Victaure',
        employer_details: job.employer,
        matched_keywords: findMatchingKeywords(job, keywords),
        relevance_score: calculateRelevanceScore(job, keywords, profile, searchContext),
        skill_match_percentage: calculateSkillMatchPercentage(job, profile)
      })),
      ...(scrapedJobs || []).map(job => ({
        ...job,
        source: 'Externe',
        matched_keywords: findMatchingKeywords(job, keywords),
        relevance_score: calculateRelevanceScore(job, keywords, profile, searchContext),
        skill_match_percentage: 0 // Default for scraped jobs
      }))
    ];

    // Enhanced filtering with AI-powered relevance
    const filteredJobs = keywords.length > 0 
      ? formattedJobs.filter(job => 
          job.matched_keywords.length > 0 ||
          keywords.some(keyword => 
            job.title?.toLowerCase().includes(keyword) || 
            job.description?.toLowerCase().includes(keyword)
          )
        )
      : formattedJobs;

    // Sort by relevance score and recency
    const sortedJobs = filteredJobs.sort((a, b) => {
      if (a.relevance_score !== b.relevance_score) {
        return b.relevance_score - a.relevance_score;
      }
      return new Date(b.created_at || b.posted_at).getTime() - 
             new Date(a.created_at || a.posted_at).getTime();
    });

    // Save search for future context
    await saveSearchHistory(supabase, profile.id, {
      query: message,
      filters: { keywords, location, jobType, experienceLevel, salary },
      results_count: sortedJobs.length
    });

    if (sortedJobs.length === 0) {
      return {
        message: generateNoResultsMessage(searchContext),
        suggestedActions: generateSuggestedActions(searchContext)
      };
    }

    return {
      message: generateEnhancedResponseMessage(
        sortedJobs.length,
        location,
        jobType,
        experienceLevel,
        keywords,
        searchContext
      ),
      jobs: sortedJobs.slice(0, 5),
      totalResults: sortedJobs.length,
      filters: {
        location,
        jobType,
        experienceLevel,
        salary
      },
      analytics: {
        skill_match_average: calculateAverageSkillMatch(sortedJobs),
        top_matched_keywords: getTopMatchedKeywords(sortedJobs),
        location_distribution: getLocationDistribution(sortedJobs)
      }
    };

  } catch (error) {
    console.error('Error in handleJobSearch:', error);
    return {
      message: "Je m'excuse, j'ai rencontré une erreur lors de la recherche. Pouvez-vous réessayer?",
      error: error.message
    };
  }
}

// Helper functions
async function getPreviousSearches(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('ai_learning_data')
    .select('question')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  return data?.map(d => d.question) || [];
}

async function getJobPreferences(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    location: profile?.city,
    industries: profile?.industry ? [profile.industry] : undefined
  };
}

async function saveSearchHistory(
  supabase: SupabaseClient, 
  userId: string, 
  searchData: any
) {
  await supabase
    .from('ai_learning_data')
    .insert({
      user_id: userId,
      question: searchData.query,
      context: searchData
    });
}

function calculateSkillMatchPercentage(job: any, profile: any): number {
  if (!job.required_skills || !profile.skills) return 0;
  
  const matchingSkills = job.required_skills.filter((skill: string) => 
    profile.skills.includes(skill)
  );
  
  return (matchingSkills.length / job.required_skills.length) * 100;
}

function calculateAverageSkillMatch(jobs: any[]): number {
  const matches = jobs.map(j => j.skill_match_percentage);
  return matches.reduce((a, b) => a + b, 0) / matches.length;
}

function getTopMatchedKeywords(jobs: any[]): string[] {
  const keywordCounts = new Map<string, number>();
  
  jobs.forEach(job => {
    job.matched_keywords.forEach((keyword: string) => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });
  
  return Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword);
}

function getLocationDistribution(jobs: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  jobs.forEach(job => {
    const location = job.location || 'Unknown';
    distribution[location] = (distribution[location] || 0) + 1;
  });
  
  return distribution;
}

function generateNoResultsMessage(context: SearchContext): string {
  return `Je n'ai pas trouvé d'offres d'emploi correspondant exactement à vos critères. Voici quelques suggestions pour élargir votre recherche :
  - Essayez d'utiliser des mots-clés plus généraux
  - Élargissez la zone géographique
  - Modifiez les critères de salaire ou d'expérience`;
}

function generateSuggestedActions(context: SearchContext): any[] {
  return [
    {
      type: 'modify_search',
      label: 'Élargir la zone géographique',
      icon: 'map'
    },
    {
      type: 'modify_filters',
      label: 'Modifier les filtres',
      icon: 'filter'
    },
    {
      type: 'navigate_to_jobs',
      label: 'Voir toutes les offres',
      icon: 'briefcase'
    }
  ];
}

function extractKeywords(message: string): string[] {
  const text = message.toLowerCase();
  const keywords = [];
  
  const constructionKeywords = [
    'construction', 'chantier', 'bâtiment', 'maçon', 'charpentier',
    'plombier', 'électricien', 'peintre', 'menuisier', 'gestion',
    'projet', 'équipe', 'sécurité', 'qualité', 'maintenance',
    'rénovation', 'installation', 'supervision', 'coordination'
  ];

  for (const keyword of constructionKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  // Extract additional keywords based on common job-related terms
  const words = text.split(/\s+/);
  const jobRelatedTerms = ['expérience', 'compétences', 'diplôme', 'certification', 'permis'];
  
  words.forEach(word => {
    if (jobRelatedTerms.includes(word)) {
      keywords.push(word);
    }
  });

  return keywords;
}

function extractLocation(message: string): string {
  const cities = [
    'trois-rivieres', 'trois rivieres', 'trois-rivières', 'trois rivières',
    'montreal', 'montréal', 'quebec', 'québec', 'laval', 'gatineau',
    'sherbrooke', 'saguenay', 'levis', 'lévis', 'longueuil', 'saint-jean',
    'repentigny', 'saint-jérôme', 'drummondville', 'granby', 'shawinigan'
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
  if (text.includes('stage')) {
    return 'internship';
  }
  
  return null;
}

function extractExperienceLevel(message: string): string | null {
  const text = message.toLowerCase();
  
  if (text.includes('junior') || text.includes('débutant')) {
    return 'entry-level';
  }
  if (text.includes('senior') || text.includes('expérimenté')) {
    return 'senior';
  }
  if (text.includes('intermédiaire')) {
    return 'mid-level';
  }
  
  return null;
}

function extractSalaryRange(message: string): { min?: number; max?: number } | null {
  const text = message.toLowerCase();
  
  // Look for salary patterns like "50000" or "50k" or "50 000"
  const salaryPattern = /(\d{2,3}(?:[\s,.]?\d{3})*(?:\s?k)?)/g;
  const matches = text.match(salaryPattern);
  
  if (!matches) return null;
  
  const numbers = matches.map(match => {
    // Remove spaces and 'k', then convert to number
    const num = parseInt(match.replace(/[\s,k]/g, ''));
    // If the number is less than 1000 (likely written as 50k instead of 50000)
    return num < 1000 ? num * 1000 : num;
  }).sort((a, b) => a - b);
  
  if (numbers.length === 1) {
    return { min: numbers[0] };
  }
  
  return {
    min: numbers[0],
    max: numbers[numbers.length - 1]
  };
}

function findMatchingKeywords(job: any, keywords: string[]): string[] {
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  return keywords.filter(keyword => jobText.includes(keyword.toLowerCase()));
}

function calculateRelevanceScore(job: any, keywords: string[], profile: any): number {
  let score = 0;
  
  // Keyword matching
  const matchedKeywords = findMatchingKeywords(job, keywords);
  score += matchedKeywords.length * 2;
  
  // Skills matching
  if (job.required_skills && profile?.skills) {
    const matchingSkills = job.required_skills.filter((skill: string) => 
      profile.skills.includes(skill)
    );
    score += matchingSkills.length;
  }
  
  // Experience level matching
  if (job.experience_level === profile?.experience_level) {
    score += 2;
  }
  
  // Location matching
  if (profile?.city && job.location?.toLowerCase().includes(profile.city.toLowerCase())) {
    score += 3;
  }
  
  return score;
}

function generateEnhancedResponseMessage(
  count: number,
  location?: string,
  jobType?: string | null,
  experienceLevel?: string | null,
  keywords: string[] = []
): string {
  let message = `J'ai trouvé ${count} offre${count > 1 ? 's' : ''} d'emploi`;
  
  const filters = [];
  
  if (location) {
    filters.push(`à ${location}`);
  }
  
  if (jobType) {
    const types: Record<string, string> = {
      'full-time': 'à temps plein',
      'part-time': 'à temps partiel',
      'contract': 'en contrat',
      'temporary': 'temporaire',
      'internship': 'en stage'
    };
    filters.push(types[jobType] || jobType);
  }
  
  if (experienceLevel) {
    const levels: Record<string, string> = {
      'entry-level': 'pour débutant',
      'mid-level': 'niveau intermédiaire',
      'senior': 'niveau senior'
    };
    filters.push(levels[experienceLevel] || experienceLevel);
  }
  
  if (keywords.length > 0) {
    filters.push(`correspondant à "${keywords.join(', ')}"`);
  }
  
  if (filters.length > 0) {
    message += ` ${filters.join(' ')}`;
  }
  
  message += `. Voici les plus pertinentes :`;
  
  return message;
}
