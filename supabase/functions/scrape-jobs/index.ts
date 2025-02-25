
import { createClient } from '@supabase/supabase-js'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs(url?: string) {
  console.log('Searching jobs with URL:', url);
  
  try {
    // Use provided URL or default search URL
    const searchUrl = url || 'https://www.jobillico.com/recherche-emploi';
    console.log('Fetching URL:', searchUrl);
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Got HTML response length:', html.length);
    
    const $ = cheerio.load(html);
    const jobs: any[] = [];
    
    $('.search-results .job-item').each((_, element) => {
      try {
        const job = {
          title: $(element).find('.job-title').text().trim(),
          company: $(element).find('.company-name').text().trim(),
          location: $(element).find('.city').text().trim(),
          description: $(element).find('.description').text().trim(),
          posted_at: $(element).find('.date').text().trim() || new Date().toISOString(),
          url: 'https://www.jobillico.com' + ($(element).find('a.main-link').attr('href') || ''),
          salary_range: $(element).find('.salary').text().trim(),
          employment_type: $(element).find('.job-type').text().trim(),
          source: 'jobillico.com'
        };
        
        if (job.title && job.company) {
          console.log('Found job:', job.title);
          jobs.push(job);
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

Deno.serve(async (req) => {
  console.log('Received request:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const { url } = await req.json();
    console.log('Request URL:', url);

    const jobs = await searchJobs(url);
    console.log('Total jobs found:', jobs.length);

    if (jobs.length === 0) {
      console.warn('No jobs found in search results');
    }

    // Connect to Supabase
    console.log('Connecting to Supabase...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Store jobs in database
    if (jobs.length > 0) {
      console.log('Storing jobs in database...');
      const { error: insertError } = await supabaseClient
        .from('scraped_jobs')
        .insert(jobs);

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }
      console.log('Jobs stored successfully');
    }

    return new Response(
      JSON.stringify({ success: true, data: jobs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
