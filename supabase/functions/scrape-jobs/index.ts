
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
    baseSelector: '.job-posting',
    fields: [
      { name: 'title', selector: '.offer-title, h1.job-title', type: 'text' },
      { name: 'company', selector: '.employer-name, .company-name', type: 'text' },
      { name: 'location', selector: '.location, .city', type: 'text' },
      { name: 'description', selector: '.description, .job-description', type: 'text' },
      { name: 'salary', selector: '.salary', type: 'text' },
      { name: 'type', selector: '.job-type, .contract-type', type: 'text' }
    ]
  }
};

async function searchJobs(searchQuery: string) {
  console.log('Searching with query:', searchQuery);
  
  try {
    const baseUrl = 'https://www.jobillico.com/search-jobs';
    const searchUrl = `${baseUrl}?skwd=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const jobs: any[] = [];
    
    $('.search-results .job-item').each((_, element) => {
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
        jobs.push(job);
      }
    });
    
    return jobs;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
}

function extractWithSchema($: cheerio.CheerioAPI, schema: ExtractionSchema) {
  const result: Record<string, string> = {};
  
  schema.fields.forEach(field => {
    if (field.type === 'text') {
      result[field.name] = $(field.selector).first().text().trim();
    } else if (field.type === 'attribute' && field.attribute) {
      result[field.name] = $(field.selector).first().attr(field.attribute) || '';
    }
  });
  
  return result;
}

function getSiteSchema(url: string): ExtractionSchema | undefined {
  const hostname = new URL(url).hostname;
  return Object.entries(SITE_SCHEMAS).find(([domain]) => hostname.includes(domain))?.[1];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    // If no URL is provided, perform a general job search
    if (!url) {
      const jobs = await searchJobs('site:jobillico.com/fr/emploi');
      return new Response(
        JSON.stringify({ success: true, data: jobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If URL is provided, scrape the specific job
    const schema = getSiteSchema(url);
    if (!schema) {
      throw new Error('Unsupported job site');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const extractedData = extractWithSchema($, schema);
    
    const scrapedJob = {
      url,
      title: extractedData.title || 'Unknown Title',
      company: extractedData.company || 'Unknown Company',
      location: extractedData.location || '',
      description: extractedData.description || '',
      salary_range: extractedData.salary || '',
      employment_type: extractedData.type || '',
      posted_at: new Date().toISOString(),
      source: new URL(url).hostname
    };

    // Store in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('scraped_jobs')
      .insert(scrapedJob);

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, data: scrapedJob }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-jobs function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
