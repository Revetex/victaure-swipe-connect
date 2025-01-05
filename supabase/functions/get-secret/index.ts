import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Fonction get-secret appelée');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretName } = await req.json();
    console.log('Secret demandé:', secretName);
    
    if (!secretName) {
      console.error('Nom du secret non fourni');
      return new Response(
        JSON.stringify({ error: 'Le nom du secret est requis' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const secret = Deno.env.get(secretName);
    console.log(`Secret ${secretName} ${secret ? 'trouvé' : 'non trouvé'}`);
    
    if (!secret) {
      console.error(`Secret ${secretName} non trouvé`);
      return new Response(
        JSON.stringify({ error: `Secret ${secretName} non trouvé` }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ secret }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur dans la fonction get-secret:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});