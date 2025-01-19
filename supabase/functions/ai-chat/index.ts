import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Question reçue:', message);
    console.log('Contexte:', context);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      console.error('Clé API Hugging Face manquante');
      throw new Error('Configuration incorrecte: Clé API manquante');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Configuration Supabase manquante');
      throw new Error('Configuration incorrecte: Paramètres Supabase manquants');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
      throw new Error('Erreur lors de la récupération du profil utilisateur');
    }

    // Récupérer les données d'apprentissage pertinentes
    const { data: learningData, error: learningError } = await supabase
      .from('ai_learning_data')
      .select('question, response')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (learningError) {
      console.error('Erreur lors de la récupération des données d\'apprentissage:', learningError);
    }

    const relevantLearning = learningData?.map(data => 
      `Q: ${data.question}\nR: ${data.response}`
    ).join('\n') || '';

    const userContext = profile ? `
Informations sur l'utilisateur:
- Nom: ${profile.full_name || 'Non spécifié'}
- Rôle: ${profile.role || 'Non spécifié'}
- Compétences: ${profile.skills?.join(', ') || 'Non spécifiées'}
- Ville: ${profile.city || 'Non spécifiée'}
- Secteur: ${profile.industry || 'Non spécifié'}` : '';

    const systemPrompt = `Tu es M. Victaure, un assistant professionnel spécialisé en carrière.

Instructions strictes:
- Réponds de manière directe et concise (max 2-3 phrases)
- Adapte tes réponses au profil de l'utilisateur
- Reste professionnel et factuel
- Si une question est ambiguë, demande une clarification
- Utilise un français québécois naturel
- Ne donne JAMAIS d'exemples génériques
- Ne fais JAMAIS de listes à puces
- Évite tout formatage superflu

${userContext}

Apprentissage précédent:
${relevantLearning}

Conversation précédente:
${context?.previousMessages?.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n') || ''}

Question actuelle: ${message}`;

    console.log('Envoi de la requête à Hugging Face...');
    console.log('Prompt système:', systemPrompt);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Hugging Face:', response.status, errorText);
      throw new Error(`Erreur API Hugging Face: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse brute de Hugging Face:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Format de réponse invalide:', data);
      throw new Error('Format de réponse invalide de Hugging Face');
    }

    let aiResponse = data[0]?.generated_text
      ?.split('Assistant:').pop()
      ?.split('Human:')[0]
      ?.trim();

    if (!aiResponse) {
      console.warn('Réponse vide ou invalide, utilisation de la réponse par défaut');
      aiResponse = "Je n'ai pas bien compris votre question. Pourriez-vous la reformuler?";
    }

    // Nettoyer la réponse
    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/([0-9]+\.|•|-)\s/g, '')
      .replace(/(exemple|par exemple|voici|comme suit)/gi, '');

    console.log('Réponse nettoyée:', aiResponse);

    // Sauvegarder l'interaction pour l'apprentissage
    const { error: insertError } = await supabase
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: message,
        response: aiResponse,
        context: {
          profile: profile,
          previousMessages: context?.previousMessages
        }
      });

    if (insertError) {
      console.error('Erreur lors de la sauvegarde des données:', insertError);
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    
    let errorMessage = "Je suis désolé, j'ai rencontré une difficulté technique. ";
    
    if (error.message.includes('API Hugging Face')) {
      errorMessage += "Le service de traitement du langage est temporairement indisponible. ";
    } else if (error.message.includes('profil utilisateur')) {
      errorMessage += "Je n'arrive pas à accéder à votre profil. ";
    }
    
    errorMessage += "Pourriez-vous réessayer dans quelques instants?";

    return new Response(
      JSON.stringify({ 
        response: errorMessage,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});