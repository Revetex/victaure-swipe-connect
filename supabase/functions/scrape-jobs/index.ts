
import { createClient } from '@supabase/supabase-js'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs(url?: string) {
  console.log('Démarrage de la recherche d\'emplois...');
  
  try {
    // URL de base pour Emploi-Québec avec les paramètres de recherche
    const searchUrl = url || 'https://placement.emploiquebec.gouv.qc.ca/mbe/ut/rechroffr/listoffr.asp?date=3&CL=french';
    console.log('URL de recherche:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-CA,fr;q=0.9,en-CA;q=0.8,en;q=0.7'
      },
      timeout: 30000 // Augmentation du timeout à 30 secondes
    });

    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status}`);
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Longueur de la réponse HTML:', html.length);
    
    const $ = cheerio.load(html);
    const jobs: any[] = [];
    
    // Sélecteur spécifique pour Emploi-Québec
    $('.tableauOffres tr:not(:first-child)').each((_, element) => {
      try {
        const $row = $(element);
        const title = $row.find('td:nth-child(2)').text().trim();
        const company = $row.find('td:nth-child(3)').text().trim();
        const location = $row.find('td:nth-child(4)').text().trim();
        const url = $row.find('a').attr('href');
        
        // Ne traiter que les lignes avec un titre et une entreprise
        if (title && company) {
          const job = {
            title,
            company,
            location,
            description: '', // Sera rempli lors d'une future amélioration
            created_at: new Date().toISOString(),
            url: url ? `https://placement.emploiquebec.gouv.qc.ca${url}` : null,
            salary_min: null,
            salary_max: null,
            contract_type: 'Non spécifié',
            source: 'emploi-quebec.gouv.qc.ca',
            remote_type: 'not_specified',
            experience_level: 'not_specified',
            posted_at: new Date().toISOString()
          };
          
          console.log('Emploi trouvé:', job.title);
          jobs.push(job);
        }
      } catch (err) {
        console.error('Erreur lors du parsing d\'une offre:', err);
      }
    });
    
    console.log(`Nombre total d'emplois trouvés: ${jobs.length}`);
    return jobs;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'emplois:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  console.log('Requête reçue:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Analyse du corps de la requête...');
    const { url } = await req.json().catch(() => ({}));
    console.log('URL demandée:', url);

    const startTime = Date.now();
    const jobs = await searchJobs(url);
    const duration = Date.now() - startTime;
    console.log(`Scraping terminé en ${duration}ms`);

    if (jobs.length === 0) {
      console.warn('Aucun emploi trouvé dans les résultats de recherche');
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: [], 
          message: 'Aucun emploi trouvé' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Connexion à Supabase
    console.log('Connexion à Supabase...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Identifiants Supabase manquants');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Stockage des emplois dans la base de données
    console.log('Enregistrement des emplois dans la base de données...');
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
      console.error('Erreur lors de l\'insertion dans la base de données:', insertError);
      throw insertError;
    }
    
    console.log('Emplois enregistrés avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: jobs,
        message: `${jobs.length} emplois ont été scrapés et enregistrés avec succès`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur de la fonction:', error);
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
