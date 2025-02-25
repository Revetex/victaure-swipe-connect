
import { createClient } from '@supabase/supabase-js'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExtractionSchema {
  name: string;
  baseSelector: string;
  fields: {
    name: string;
    selector: string;
    type: 'text' | 'attribute';
    attribute?: string;
  }[];
}

const SITE_SCHEMAS: Record<string, ExtractionSchema> = {
  'jobillico.com': {
    name: 'Jobillico Job',
    baseSelector: '.search-results .job-item',
    fields: [
      { name: 'title', selector: '.job-title', type: 'text' },
      { name: 'company', selector: '.company-name', type: 'text' },
      { name: 'location', selector: '.city', type: 'text' },
      { name: 'description', selector: '.description', type: 'text' },
      { name: 'salary', selector: '.salary', type: 'text' },
      { name: 'type', selector: '.job-type', type: 'text' },
      { name: 'url', selector: 'a.main-link', type: 'attribute', attribute: 'href' }
    ]
  }
};

async function searchJobs(searchQuery: string) {
  console.log('Searching with query:', searchQuery);
  
  try {
    const baseUrl = 'https://www.jobillico.com/search-jobs';
    const searchUrl = `${baseUrl}?skwd=${encodeURIComponent(searchQuery)}`;
    
    console.log('Fetching URL:', searchUrl);
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const jobs: any[] = [];
    
    $('.search-results .job-item').each((_, element) => {
      try {
        const job = {
          title: $(element).find('.job-title').text().trim(),
          company: $(element).find('.company-name').text().trim(),
          location: $(element).find('.city').text().trim(),
          description: $(element).find('.description').text().trim(),
          posted_at: $(element).find('.date').text().trim(),
          url: 'https://www.jobillico.com' + ($(element).find('a.main-link').attr('href') || ''),
          salary_range: $(element).find('.salary').text().trim(),
          employment_type: $(element).find('.job-type').text().trim()
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

    // If no URL is provided, perform a general job search
    if (!url) {
      console.log('No URL provided, performing general search');
      const jobs = await searchJobs('site:jobillico.com/fr/emploi');
      return new Response(
        JSON.stringify({ success: true, data: jobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If URL is provided, validate it
    try {
      console.log('Validating URL:', url);
      new URL(url); // This will throw if URL is invalid
    } catch (err) {
      console.error('Invalid URL:', err);
      throw new Error('Invalid URL provided');
    }

    console.log('Fetching URL:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML length:', html.length);

    const $ = cheerio.load(html);
    console.log('Cheerio loaded');

    // Extract job details
    const job = {
      url,
      title: $('.job-title, h1').first().text().trim() || 'Unknown Title',
      company: $('.company-name, .employer-name').first().text().trim() || 'Unknown Company',
      location: $('.city, .location').first().text().trim() || '',
      description: $('.description, .job-description').first().text().trim() || '',
      salary_range: $('.salary').first().text().trim() || '',
      employment_type: $('.job-type').first().text().trim() || '',
      posted_at: new Date().toISOString(),
      source: new URL(url).hostname
    };

    console.log('Extracted job:', job);

    // Connect to Supabase
    console.log('Connecting to Supabase...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Store in database
    console.log('Storing job in database...');
    const { error: insertError } = await supabaseClient
      .from('scraped_jobs')
      .insert([job]);

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Job stored successfully');

    return new Response(
      JSON.stringify({ success: true, data: job }),
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
