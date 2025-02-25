
import { createClient } from '@supabase/supabase-js'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs(url?: string) {
  console.log('Searching jobs with URL:', url);
  
  try {
    // Use provided URL or default search URL with a reasonable limit
    const searchUrl = url || 'https://www.jobillico.com/recherche-emploi?limit=25';
    console.log('Fetching URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Got HTML response length:', html.length);
    
    if (html.length < 1000) {
      console.warn('Suspiciously small HTML response, might be blocked or invalid');
      return [];
    }
    
    const $ = cheerio.load(html);
    const jobs: any[] = [];
    let processedCount = 0;
    
    $('.search-results .job-item').each((_, element) => {
      try {
        // Limit processing to 25 jobs per run to avoid timeouts
        if (processedCount >= 25) return false;
        
        const salary = $(element).find('.salary').text().trim();
        const salaryRange = parseSalaryRange(salary);
        
        const job = {
          title: $(element).find('.job-title').text().trim(),
          company: $(element).find('.company-name').text().trim(),
          location: $(element).find('.city').text().trim(),
          description: $(element).find('.description').text().trim(),
          created_at: new Date().toISOString(),
          url: 'https://www.jobillico.com' + ($(element).find('a.main-link').attr('href') || ''),
          salary_min: salaryRange.min,
          salary_max: salaryRange.max,
          contract_type: $(element).find('.job-type').text().trim() || 'Full Time',
          source: 'jobillico.com',
          remote_type: detectRemoteType($(element).find('.description').text()),
          experience_level: detectExperienceLevel($(element).find('.description').text())
        };
        
        if (job.title && job.company) {
          console.log('Found job:', job.title);
          jobs.push(job);
          processedCount++;
        }
      } catch (err) {
        console.error('Error parsing job item:', err);
      }
    });
    
    console.log(`Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
}

function parseSalaryRange(salaryText: string) {
  try {
    const numbers = salaryText.match(/\d+(?:[,.]\d+)?/g);
    if (!numbers) return { min: null, max: null };
    
    const values = numbers.map(n => parseFloat(n.replace(',', '')));
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  } catch {
    return { min: null, max: null };
  }
}

function detectRemoteType(description: string): string {
  const text = description.toLowerCase();
  if (text.includes('100% remote') || text.includes('fully remote')) return 'full';
  if (text.includes('hybrid') || text.includes('flexible')) return 'hybrid';
  return 'office';
}

function detectExperienceLevel(description: string): string {
  const text = description.toLowerCase();
  if (text.includes('senior') || text.includes('lead')) return 'senior';
  if (text.includes('junior') || text.includes('entry')) return 'junior';
  if (text.includes('intermediate')) return 'intermediate';
  return 'not_specified';
}

Deno.serve(async (req) => {
  console.log('Received request:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const { url } = await req.json().catch(() => ({}));
    console.log('Request URL:', url);

    const startTime = Date.now();
    const jobs = await searchJobs(url);
    const duration = Date.now() - startTime;
    console.log(`Scraping completed in ${duration}ms`);

    if (jobs.length === 0) {
      console.warn('No jobs found in search results');
      return new Response(
        JSON.stringify({ success: true, data: [], message: 'No jobs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Connect to Supabase
    console.log('Connecting to Supabase...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Store jobs in database with upsert to avoid duplicates
    console.log('Storing jobs in database...');
    const { error: insertError } = await supabaseClient
      .from('scraped_jobs')
      .upsert(
        jobs,
        { 
          onConflict: 'url',
          ignoreDuplicates: true 
        }
      );

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }
    
    console.log('Jobs stored successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: jobs,
        message: `Successfully scraped and stored ${jobs.length} jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
