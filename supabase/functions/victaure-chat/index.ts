
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context, useWebSearch } = await req.json();

    // Initialiser Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let searchResults = [];
    if (useWebSearch) {
      try {
        const searchResponse = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${Deno.env.get('GOOGLE_SEARCH_API_KEY')}&cx=${Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')}&q=${encodeURIComponent(messages[messages.length - 1].content)}`
        );
        const searchData = await searchResponse.json();
        if (searchData.items) {
          searchResults = searchData.items.map((item: any) => ({
            title: item.title,
            snippet: item.snippet,
            url: item.link
          }));
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }

    // Construire le prompt avec le contexte et les résultats de recherche
    let prompt = context + "\n\n";
    
    // Ajouter l'historique des messages
    messages.forEach((msg: any) => {
      prompt += `${msg.isUser ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n`;
    });

    // Ajouter les résultats de recherche si disponibles
    if (searchResults.length > 0) {
      prompt += "\nRésultats de recherche pertinents:\n";
      searchResults.forEach((result: any) => {
        prompt += `- ${result.title}: ${result.snippet}\n`;
      });
    }

    // Générer la réponse avec Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Gemini response data:', response);

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: text
          }
        }],
        searchResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
