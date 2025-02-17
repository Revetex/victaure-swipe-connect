
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { kijiji } from 'npm:kijiji-scraper';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Partie 1: Google Custom Search
    const searchEngineId = "1262c5460a0314a80";
    const apiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY');

    if (!apiKey) {
      throw new Error('Google Search API key not configured');
    }

    // Configuration sites de recherche
    const sites = [
      "jobbank.gc.ca",
      "lespac.com",
      "kijiji.ca",
      "jobs-bear.com",
      "jobrapido.com",
      "jooble.org",
      "randstad.ca",
      "jobboom.com",
      "jobillico.com",
      "joblist.com",
      "guichetemplois.gc.ca",
      "freecash.com"
    ];

    // Recherche Google Custom Search
    const siteQuery = sites.map(site => `site:${site}`).join(" OR ");
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=jobs ${siteQuery}`;
    
    console.log('Searching jobs with Google CSE...');
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Traiter les résultats de Google
    if (data.items) {
      console.log(`Found ${data.items.length} job listings from Google CSE`);
      
      for (const item of data.items) {
        const source = sites.find(site => item.link.includes(site)) || 'unknown';
        
        const jobData = {
          title: item.title,
          description: item.snippet,
          url: item.link,
          source: source,
          posted_at: new Date().toISOString(),
          raw_data: item,
        };

        await supabaseClient
          .from('scraped_jobs')
          .upsert(jobData, { onConflict: 'url' });
      }
    }

    // Partie 2: Kijiji Scraping Direct
    console.log('Starting Kijiji specific scraping...');
    const searchOptions = {
      locationId: 9001, // Code pour Canada
      categoryId: 777, // Pour la section "acheter et vendre"
      sortByName: "date"
    };

    try {
      const ads = await kijiji.search(searchOptions);
      console.log(`Found ${ads.length} listings from Kijiji direct scraping`);

      for (const ad of ads) {
        const jobData = {
          title: ad.title,
          description: ad.description,
          url: ad.url,
          source: 'kijiji',
          posted_at: new Date().toISOString(),
          raw_data: {
            attributes: ad.attributes,
            image: ad.image,
            date: ad.date,
            location: ad.location,
            images: ad.images
          }
        };

        await supabaseClient
          .from('scraped_jobs')
          .upsert(jobData, { onConflict: 'url' });
      }
    } catch (kijijiError) {
      console.error('Error in Kijiji scraping:', kijijiError);
      // Continue execution even if Kijiji scraping fails
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Jobs scraped successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
