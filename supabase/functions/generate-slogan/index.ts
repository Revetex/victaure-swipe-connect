import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json();

    const prompt = `
      Based on this professional profile, generate a short, impactful business slogan that highlights their expertise and value proposition. 
      The slogan should be concise (max 6-8 words) and memorable.
      
      Profile:
      Name: ${profile.full_name}
      Role: ${profile.role}
      Bio: ${profile.bio}
      Skills: ${profile.skills?.join(', ')}
      
      Generate only the slogan text, nothing else.
    `;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    });

    const result = await response.json();
    let slogan = result[0].generated_text.trim();
    
    // Clean up the response to get just the slogan
    slogan = slogan.split('\n')[0].replace(/["']/g, '').trim();

    return new Response(JSON.stringify({ slogan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-slogan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});