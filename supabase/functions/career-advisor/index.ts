import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Récupérer le profil complet de l'utilisateur
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

    // Vérifier si le message contient une confirmation
    const isConfirmation = message.toLowerCase().includes('oui') || 
                          message.toLowerCase().includes('confirme') || 
                          message.toLowerCase().includes("d'accord");
    
    // Vérifier si nous avons une modification en attente
    const { data: pendingChanges } = await supabase
      .from('ai_chat_messages')
      .select('content')
      .eq('user_id', userId)
      .eq('sender', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1);

    const hasPendingChanges = pendingChanges?.[0]?.content.includes('Voulez-vous que je modifie');

    const systemPrompt = `Tu es Mr Victaure, un conseiller en orientation professionnel québécois.

Instructions importantes:
1. Réponds UNIQUEMENT en français québécois, de manière concise (2-3 phrases maximum)
2. Pour TOUTE modification du profil:
   - Explique d'abord clairement les changements que tu suggères
   - Demande TOUJOURS "Voulez-vous que je modifie votre profil avec ces changements? Répondez par Oui pour confirmer."
   - Attends la confirmation de l'utilisateur avant de faire les changements
3. Sois chaleureux mais direct dans tes réponses
4. Utilise des expressions québécoises comme:
   - "Pas de trouble!" pour dire d'accord
   - "C'est correct" pour approuver
   - "Ben oui!" pour confirmer

Profil actuel:
- Nom: ${profile.full_name || 'Non spécifié'}
- Rôle: ${profile.role || 'Non spécifié'}
- Compétences: ${profile.skills ? profile.skills.join(', ') : 'Non spécifiées'}
- Localisation: ${profile.city || 'Non spécifiée'}, ${profile.state || 'Non spécifié'}
- Expérience: ${profile.experiences ? profile.experiences.length : 0} expérience(s)
- Formation: ${profile.education ? profile.education.length : 0} formation(s)
- Certifications: ${profile.certifications ? profile.certifications.length : 0} certification(s)

Si l'utilisateur confirme une modification, applique-la et confirme que c'est fait.`;

    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('Clé API HuggingFace non trouvée');
    }

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
          inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 150,
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

    // Si l'utilisateur confirme et qu'il y a des modifications en attente
    if (isConfirmation && hasPendingChanges) {
      const previousMessage = pendingChanges[0].content;
      
      // Analyser le message précédent pour les modifications
      if (previousMessage.includes('compétences')) {
        const skillsMatch = previousMessage.match(/ajouter les compétences suivantes : (.*?)(?=\.|$)/i);
        if (skillsMatch) {
          const newSkills = skillsMatch[1].split(',').map(s => s.trim());
          const updatedSkills = [...new Set([...(profile.skills || []), ...newSkills])];
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ skills: updatedSkills })
            .eq('id', userId);

          if (updateError) {
            throw new Error(`Erreur lors de la mise à jour des compétences: ${updateError.message}`);
          }
          
          console.log('Compétences mises à jour:', updatedSkills);
        }
      }
      
      // Gérer les modifications d'expérience
      if (previousMessage.includes('expérience')) {
        const experienceMatch = previousMessage.match(/ajouter l'expérience : (.*?) chez (.*?) de (.*?) à (.*?)(?=\.|$)/i);
        if (experienceMatch) {
          const [_, position, company, startDate, endDate] = experienceMatch;
          
          const { error: expError } = await supabase
            .from('experiences')
            .insert({
              profile_id: userId,
              position: position.trim(),
              company: company.trim(),
              start_date: startDate.trim(),
              end_date: endDate.trim() === 'présent' ? null : endDate.trim()
            });

          if (expError) {
            throw new Error(`Erreur lors de l'ajout de l'expérience: ${expError.message}`);
          }
          
          console.log('Nouvelle expérience ajoutée');
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