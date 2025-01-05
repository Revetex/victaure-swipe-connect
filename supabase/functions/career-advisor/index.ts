import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSystemPrompt, getInitialQuestions } from './prompts.ts';
import { updateProfile, addExperience, addSkills } from './profileUpdates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error('Message et userId requis');
    }

    console.log('Requête reçue:', { message, userId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer le profil complet
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        experiences (*),
        education (*),
        certifications (*)
      `)
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Erreur lors de la récupération du profil: ${profileError.message}`);
    }

    if (!profile) {
      throw new Error('Profil non trouvé');
    }

    console.log('Profil trouvé:', profile);

    // Vérifier si c'est un nouveau utilisateur
    const isNewUser = !profile.full_name || profile.skills?.length === 0;
    
    // Vérifier si le message contient une confirmation
    const isConfirmation = message.toLowerCase().includes('oui') || 
                          message.toLowerCase().includes('confirme') || 
                          message.toLowerCase().includes("d'accord");

    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('Clé API HuggingFace non trouvée');
    }

    // Construire le prompt système
    const systemPrompt = getSystemPrompt(profile);

    // Si c'est un nouvel utilisateur, ajouter les questions initiales
    const initialQuestions = isNewUser ? getInitialQuestions().join('\n') : '';

    console.log('Envoi de la requête à HuggingFace');

    const huggingFaceResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\n${initialQuestions}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!huggingFaceResponse.ok) {
      const error = await huggingFaceResponse.text();
      console.error('Erreur HuggingFace:', error);
      throw new Error(`Erreur HuggingFace: ${error}`);
    }

    const aiResponseData = await huggingFaceResponse.json();
    if (!Array.isArray(aiResponseData) || aiResponseData.length === 0) {
      throw new Error('Réponse AI invalide');
    }

    const responseText = aiResponseData[0].generated_text;

    // Si l'utilisateur confirme et qu'il y a des modifications suggérées
    if (isConfirmation) {
      // Récupérer le dernier message de l'assistant
      const { data: lastMessage } = await supabase
        .from('ai_chat_messages')
        .select('content')
        .eq('user_id', userId)
        .eq('sender', 'assistant')
        .order('created_at', { ascending: false })
        .limit(1);

      if (lastMessage?.[0]) {
        const previousMessage = lastMessage[0].content;

        try {
          // Gérer les modifications de compétences
          if (previousMessage.includes('compétences')) {
            const skillsMatch = previousMessage.match(/ajouter les compétences suivantes : (.*?)(?=\.|$)/i);
            if (skillsMatch) {
              const newSkills = skillsMatch[1].split(',').map((s: string) => s.trim());
              await addSkills(supabase, userId, newSkills);
            }
          }

          // Gérer les modifications d'expérience
          if (previousMessage.includes('expérience')) {
            const expMatch = previousMessage.match(/ajouter l'expérience : (.*?) chez (.*?) de (.*?) à (.*?)(?=\.|$)/i);
            if (expMatch) {
              const [_, position, company, startDate, endDate] = expMatch;
              await addExperience(supabase, userId, {
                position: position.trim(),
                company: company.trim(),
                start_date: startDate.trim(),
                end_date: endDate.trim() === 'présent' ? null : endDate.trim()
              });
            }
          }

          // Gérer les modifications de profil général
          if (previousMessage.includes('profil')) {
            // Extraire et appliquer les modifications du profil
            const updates: any = {};
            if (previousMessage.includes('titre professionnel')) {
              const roleMatch = previousMessage.match(/titre professionnel[^\w]*: (.*?)(?=\.|$)/i);
              if (roleMatch) updates.role = roleMatch[1].trim();
            }
            if (previousMessage.includes('bio')) {
              const bioMatch = previousMessage.match(/bio[^\w]*: (.*?)(?=\.|$)/i);
              if (bioMatch) updates.bio = bioMatch[1].trim();
            }
            if (Object.keys(updates).length > 0) {
              await updateProfile(supabase, userId, updates);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour:', error);
          throw error;
        }
      }
    }

    // Sauvegarder la conversation
    const { error: chatError } = await supabase
      .from('ai_chat_messages')
      .insert([
        {
          user_id: userId,
          content: message,
          sender: 'user'
        },
        {
          user_id: userId,
          content: responseText,
          sender: 'assistant'
        }
      ]);

    if (chatError) {
      console.error('Erreur lors de l\'enregistrement des messages:', chatError);
    }

    return new Response(
      JSON.stringify({ response: responseText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});