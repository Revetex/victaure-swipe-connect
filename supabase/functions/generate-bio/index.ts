import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Starting Generate Bio function!");

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Verify request method
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Parse request body
    const { skills = [], experiences = [], education = [] } = await req.json();

    // Get API key with error handling
    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      console.error('Missing Hugging Face API key');
      throw new Error('Configuration error: Missing API key');
    }

    console.log('Starting bio generation with:', {
      skillsCount: skills?.length,
      experiencesCount: experiences?.length,
      educationCount: education?.length
    });

    const prompt = `En tant que professionnel québécois, générez une bio professionnelle concise et engageante en français québécois basée sur ces informations:

${experiences?.length ? `Expériences: ${experiences.map(e => `${e.position} chez ${e.company}`).join(', ')}` : ''}
${education?.length ? `Formation: ${education.map(e => `${e.degree} en ${e.field_of_study || ''} à ${e.school_name}`).join(', ')}` : ''}
${skills?.length ? `Compétences: ${skills.join(', ')}` : ''}

Instructions:
- Rester concise (maximum 3 phrases)
- Ne pas inclure de notes ou de remarques à la fin
- Utiliser un ton professionnel mais chaleureux`;

    console.log('Sending request to Hugging Face API');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      throw new Error(`Erreur API: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response:', data);

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid API response format:', data);
      throw new Error('Format de réponse invalide');
    }

    let bio = data[0].generated_text.trim();
    bio = bio.split(/Note:|Remarque:|N\.B\.:|\n\n/)[0].trim();

    console.log('Generated bio:', bio);

    return new Response(
      JSON.stringify({ bio }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Une erreur est survenue lors de la génération de la bio',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});