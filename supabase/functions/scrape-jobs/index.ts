
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
  'jobboom.com': {
    name: 'Jobboom Job',
    baseSelector: '.job-posting',
    fields: [
      { name: 'title', selector: '.job-title, h1', type: 'text' },
      { name: 'company', selector: '.company-name, .employer-name', type: 'text' },
      { name: 'location', selector: '.location', type: 'text' },
      { name: 'description', selector: '.job-description', type: 'text' },
      { name: 'salary', selector: '.salary', type: 'text' },
      { name: 'type', selector: '.job-type', type: 'text' },
      { name: 'applyLink', selector: 'a.apply-button', type: 'attribute', attribute: 'href' }
    ]
  },
  'jobillico.com': {
    name: 'Jobillico Job',
    baseSelector: '.job-offer',
    fields: [
      { name: 'title', selector: '.offer-title, h1', type: 'text' },
      { name: 'company', selector: '.company-name', type: 'text' },
      { name: 'location', selector: '.location', type: 'text' },
      { name: 'description', selector: '#description', type: 'text' },
      { name: 'salary', selector: '.salary-range', type: 'text' },
      { name: 'type', selector: '.employment-type', type: 'text' },
      { name: 'applyLink', selector: '.apply-now', type: 'attribute', attribute: 'href' }
    ]
  },
  'guichetemplois.gc.ca': {
    name: 'Guichet Emplois Job',
    baseSelector: '.job-posting',
    fields: [
      { name: 'title', selector: '.title, h1', type: 'text' },
      { name: 'company', selector: '.business-name', type: 'text' },
      { name: 'location', selector: '.location', type: 'text' },
      { name: 'description', selector: '#job-description', type: 'text' },
      { name: 'salary', selector: '.salary', type: 'text' },
      { name: 'type', selector: '.work-type', type: 'text' },
      { name: 'applyLink', selector: '.apply-button', type: 'attribute', attribute: 'href' }
    ]
  },
  'quebecemploi.gouv.qc.ca': {
    name: 'Quebec Emploi Job',
    baseSelector: '.job-details',
    fields: [
      { name: 'title', selector: '.job-title, h1', type: 'text' },
      { name: 'company', selector: '.employer-name', type: 'text' },
      { name: 'location', selector: '.location', type: 'text' },
      { name: 'description', selector: '.description', type: 'text' },
      { name: 'salary', selector: '.salary-info', type: 'text' },
      { name: 'type', selector: '.job-type', type: 'text' },
      { name: 'applyLink', selector: '.apply-link', type: 'attribute', attribute: 'href' }
    ]
  }
};

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
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const schema = getSiteSchema(url);
    if (!schema) {
      return new Response(
        JSON.stringify({ error: 'Unsupported job site' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Starting job search process...');
    const response = await fetch(url);
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
      job_type: extractedData.type || '',
      apply_url: extractedData.applyLink || url,
      source: new URL(url).hostname,
      raw_data: {
        fullHtml: html,
        timestamp: new Date().toISOString(),
        extracted: extractedData
      }
    };

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('crawled_jobs')
      .insert(scrapedJob);

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, data: scrapedJob }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in scrape-jobs function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
