import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.6.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting smart job scraping process...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const hfApiKey = Deno.env.get('HUGGING_FACE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const hf = new HfInference(hfApiKey);

    // Sources d'emplois à scraper
    const jobSources = [
      'https://ca.indeed.com/jobs?l=Trois-Rivieres%2C+QC&radius=50',
      'https://www.linkedin.com/jobs/search?keywords=&location=Trois-Rivieres%2C%20Quebec%2C%20Canada',
      'https://www.jobillico.com/search?skwd=&wloc=Trois-Rivi%C3%A8res'
    ];

    const scrapedJobs: JobData[] = [];

    for (const sourceUrl of jobSources) {
      console.log(`Scraping jobs from: ${sourceUrl}`);
      
      try {
        const response = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // Utiliser le modèle LayoutLM pour extraire les informations structurées
        const extractedData = await hf.textExtraction({
          model: 'microsoft/layoutlm-base-uncased',
          inputs: html,
        });

        // Utiliser le modèle BERT pour classifier la pertinence
        const relevanceCheck = await hf.textClassification({
          model: 'bert-base-multilingual-uncased',
          inputs: extractedData.text,
        });

        if (relevanceCheck.label === 'RELEVANT') {
          // Utiliser le modèle T5 pour extraire les informations spécifiques
          const jobInfo = await hf.summarization({
            model: 't5-base',
            inputs: extractedData.text,
            parameters: {
              max_length: 500,
              min_length: 100,
            }
          });

          // Analyser le texte pour extraire les informations structurées
          const jobData = parseJobInfo(jobInfo.summary);
          if (jobData) {
            scrapedJobs.push(jobData);
          }
        }
      } catch (error) {
        console.error(`Error scraping ${sourceUrl}:`, error);
      }
    }

    // Filtrer les emplois plus vieux que 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJobs = scrapedJobs.filter(job => 
      new Date(job.posted_at) >= thirtyDaysAgo
    );

    // Sauvegarder dans Supabase
    if (recentJobs.length > 0) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert(
          recentJobs.map(job => ({
            ...job,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'url' }
        );

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and saved ${recentJobs.length} recent jobs`,
        jobCount: recentJobs.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in smart-job-scraper function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function parseJobInfo(text: string): JobData | null {
  try {
    // Utiliser des expressions régulières pour extraire les informations
    const titleMatch = text.match(/Title:\s*(.*?)(?=\n|Company:)/i);
    const companyMatch = text.match(/Company:\s*(.*?)(?=\n|Location:)/i);
    const locationMatch = text.match(/Location:\s*(.*?)(?=\n|Description:)/i);
    const descriptionMatch = text.match(/Description:\s*(.*?)(?=\n|$)/i);
    const urlMatch = text.match(/URL:\s*(.*?)(?=\n|$)/i);
    const dateMatch = text.match(/Posted:\s*(.*?)(?=\n|$)/i);

    if (!titleMatch || !companyMatch || !locationMatch) {
      return null;
    }

    return {
      title: titleMatch[1].trim(),
      company: companyMatch[1].trim(),
      location: locationMatch[1].trim(),
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      url: urlMatch ? urlMatch[1].trim() : '',
      posted_at: dateMatch ? new Date(dateMatch[1].trim()).toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing job info:', error);
    return null;
  }
}