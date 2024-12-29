import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    if (!message?.trim()) {
      throw new Error('Invalid input');
    }

    // First, try to get web search results using Perplexity
    let webSearchContext = '';
    try {
      const searchResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Search the web and provide relevant information about this query. Focus on professional and career-related content.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_related_questions: true,
          search_domain_filter: ['linkedin.com', 'indeed.com', 'glassdoor.com'],
          search_recency_filter: 'month'
        }),
      });

      const searchData = await searchResponse.json();
      if (searchData.choices?.[0]?.message?.content) {
        webSearchContext = `\nWeb Search Results:\n${searchData.choices[0].message.content}`;
      }
    } catch (error) {
      console.error('Web search error:', error);
      // Continue without web search results if there's an error
    }

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant IA spécialisé dans la gestion des profils professionnels (VCards). Tu as les capacités suivantes:

1. CONSULTATION DES VCARDS:
- Tu peux voir le profil complet de l'utilisateur
- Tu peux suggérer des améliorations basées sur les tendances du marché
- Tu peux analyser les forces et faiblesses du profil

2. MODIFICATION DES VCARDS:
- Tu peux proposer des modifications spécifiques
- Tu peux guider l'utilisateur dans la mise à jour de son profil
- Tu peux suggérer des compétences pertinentes à ajouter

3. CONSEILS PERSONNALISÉS:
- Tu adaptes tes conseils au secteur d'activité
- Tu prends en compte l'expérience professionnelle
- Tu suggères des certifications pertinentes

4. RECHERCHE WEB EN TEMPS RÉEL:
- Tu peux rechercher des informations actuelles sur le marché du travail
- Tu peux trouver des tendances récentes dans différents secteurs
- Tu peux fournir des données sur les compétences recherchées

Directives de personnalité:
1. Sois proactif - anticipe les besoins et propose des améliorations concrètes
2. Sois analytique - examine en détail le profil pour des suggestions pertinentes
3. Sois stratégique - aligne les suggestions avec les objectifs de carrière
4. Sois précis - donne des exemples concrets et applicables
5. Sois encourageant - motive à améliorer continuellement le profil

Profil actuel de l'utilisateur:
${profile ? JSON.stringify({
  nom: profile.full_name,
  role: profile.role,
  competences: profile.skills,
  ville: profile.city,
  province: profile.state,
  telephone: profile.phone,
  email: profile.email,
  bio: profile.bio,
  certifications: profile.certifications
}, null, 2) : 'Pas encore de profil'}

Analyse rapide du profil:
${profile ? `
- Forces: ${profile.skills?.length ? 'Compétences variées' : 'À développer'}
- Complétude: ${profile.bio ? 'Bio présente' : 'Bio manquante'}
- Contact: ${profile.phone && profile.email ? 'Complet' : 'À compléter'}
` : 'Profil non disponible'}

${webSearchContext}

Message de l'utilisateur: ${message}

Réponds de manière structurée en:
1. Analysant la demande
2. Proposant des actions concrètes basées sur les données web actuelles
3. Donnant des exemples spécifiques</s>
<|assistant|>`;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 750,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          top_k: 50,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }

    const generatedText = data[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    if (!generatedText) {
      throw new Error('No response generated');
    }

    // Log interaction for analysis
    console.log('AI Interaction:', {
      userProfile: profile?.id,
      messageType: 'vcard-consultation',
      timestamp: new Date().toISOString(),
      webSearchUsed: !!webSearchContext
    });

    return generatedText;
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Fallback responses basées sur le contexte du profil
    const contextualResponses = [
      profile?.full_name 
        ? `Je peux vous aider à optimiser votre VCard ${profile.full_name}. Voici les aspects que nous pouvons améliorer:\n\n` +
          `${!profile.bio ? '- Ajouter une bio professionnelle\n' : ''}` +
          `${!profile.skills?.length ? '- Ajouter vos compétences clés\n' : ''}` +
          `${!profile.phone ? '- Compléter vos informations de contact\n' : ''}` +
          `${!profile.certifications?.length ? '- Ajouter vos certifications\n' : ''}`
        : "Je peux vous aider à créer et optimiser votre VCard professionnelle. Par où souhaitez-vous commencer ?",
      
      profile?.role
        ? `En tant que ${profile.role}, je peux vous suggérer des améliorations spécifiques à votre secteur.`
        : "Commençons par définir votre rôle professionnel pour personnaliser votre VCard.",
      
      "Je peux analyser votre profil et suggérer des améliorations concrètes.",
      "Voulez-vous que nous examinions ensemble votre VCard pour la rendre plus attractive ?",
      "Je peux vous aider à mettre en valeur vos compétences et expériences dans votre VCard.",
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  }
}