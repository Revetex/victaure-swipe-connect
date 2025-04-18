
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

console.log("Starting victaure-chat function with Google Gemini API");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer le contexte utilisateur depuis Supabase
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select(`
        role,
        full_name,
        skills,
        location,
        experiences (
          position,
          company,
          start_date,
          end_date
        )
      `)
      .eq('id', userId)
      .single();

    // Formater le contexte
    const userContext = {
      role: userProfile?.role || 'visitor',
      full_name: userProfile?.full_name,
      skills: userProfile?.skills,
      location: userProfile?.location,
      experience: userProfile?.experiences?.map(exp => ({
        position: exp.position,
        company: exp.company,
        duration: `${new Date(exp.start_date).getFullYear()} - ${
          exp.end_date ? new Date(exp.end_date).getFullYear() : 'présent'
        }`
      })) || []
    };

    // Initialiser le modèle
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    });

    const context = `Tu es Mr Victaure, un assistant professionnel et bienveillant spécialisé dans l'emploi et le développement de carrière.
    Tu parles en français de manière naturelle et engageante.

    Contexte de l'utilisateur :
    - Rôle : ${userContext.role}
    - Nom : ${userContext.full_name || 'Non spécifié'}
    - Compétences : ${userContext.skills?.join(', ') || 'Non spécifiées'}
    - Localisation : ${userContext.location || 'Non spécifiée'}
    - Expérience : ${userContext.experience?.map(exp => 
      `${exp.position} chez ${exp.company} (${exp.duration})`
    ).join(', ') || 'Non spécifiée'}`;

    // Créer le chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Initialise le contexte" }]
        },
        {
          role: "model",
          parts: [{ text: context }]
        },
        ...messages.map((msg: any) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.content }]
        }))
      ],
    });

    // Générer la réponse
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = result.response;

    // Sauvegarder l'interaction pour l'apprentissage
    await supabaseAdmin
      .from('ai_learning_data')
      .insert({
        question: messages[messages.length - 1].content,
        response: response.text(),
        user_id: userId,
        context: userContext
      });

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: response.text()
          }
        }]
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in victaure-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
