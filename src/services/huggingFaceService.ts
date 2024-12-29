import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";

// Rate limiting implementation
const rateLimiter = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimiter.get(userId);

  if (!userRateLimit) {
    rateLimiter.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (now - userRateLimit.timestamp > RATE_WINDOW) {
    rateLimiter.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userRateLimit.count >= RATE_LIMIT) {
    return false;
  }

  userRateLimit.count += 1;
  return true;
}

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .trim()
    .slice(0, 1000); // Limit input length
}

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    // Input validation
    if (!message?.trim()) {
      throw new Error('Message invalide');
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      throw new Error('Limite de requêtes atteinte. Veuillez réessayer dans une minute.');
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);

    // Enhanced system prompt with more context and capabilities
    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant IA spécialisé dans la gestion des profils professionnels (VCards) avec une expertise approfondie en:

1. ANALYSE APPROFONDIE DES PROFILS:
- Analyse détaillée des compétences et de leur pertinence sur le marché
- Identification des points forts et des axes d'amélioration
- Évaluation de la cohérence globale du profil

2. RECOMMANDATIONS STRATÉGIQUES:
- Suggestions personnalisées basées sur les tendances du secteur
- Conseils pour optimiser la visibilité professionnelle
- Recommandations de formations et certifications pertinentes

3. EXPERTISE SECTORIELLE:
- Connaissance approfondie des différents secteurs d'activité
- Compréhension des exigences spécifiques par domaine
- Adaptation des conseils selon le niveau d'expérience

4. SÉCURITÉ ET CONFIDENTIALITÉ:
- Respect strict des informations personnelles
- Recommandations conformes aux bonnes pratiques
- Protection des données sensibles

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
}, null, 2) : 'Profil non disponible'}

Analyse du profil:
${profile ? `
Forces:
- ${profile.skills?.length ? 'Compétences diversifiées' : 'À développer'}
- ${profile.certifications?.length ? 'Certifications présentes' : 'Pas encore de certifications'}
- ${profile.bio ? 'Présentation professionnelle complète' : 'Bio à développer'}

Points d'amélioration:
- ${!profile.skills?.length ? 'Ajouter des compétences clés' : ''}
- ${!profile.bio ? 'Développer une bio professionnelle' : ''}
- ${!profile.certifications?.length ? 'Obtenir des certifications pertinentes' : ''}
- ${!profile.phone || !profile.email ? 'Compléter les informations de contact' : ''}

Recommandations personnalisées:
- ${profile.role ? `Basées sur votre rôle de ${profile.role}` : 'À définir selon votre objectif professionnel'}
` : 'Analyse non disponible - profil à créer'}

Message de l'utilisateur: ${sanitizedMessage}

Instructions de réponse:
1. Analyse approfondie de la demande
2. Propositions concrètes et réalisables
3. Exemples spécifiques et personnalisés
4. Suggestions d'actions immédiates</s>
<|assistant|>`;

    // Enhanced API call with better error handling
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
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    const generatedText = data[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    if (!generatedText) {
      throw new Error('Aucune réponse générée');
    }

    // Log interaction for analysis and security monitoring
    console.log('AI Interaction:', {
      userProfile: profile?.id,
      messageType: 'vcard-consultation',
      timestamp: new Date().toISOString(),
      messageLength: sanitizedMessage.length,
      responseLength: generatedText.length
    });

    return generatedText;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    
    // Enhanced fallback responses with more context
    const contextualResponses = [
      profile?.full_name 
        ? `Je peux vous aider à optimiser votre profil professionnel ${profile.full_name}. Voici les aspects prioritaires à améliorer:\n\n` +
          `${!profile.bio ? '- Développer une bio professionnelle qui met en valeur votre expertise\n' : ''}` +
          `${!profile.skills?.length ? '- Ajouter vos compétences clés et technologies maîtrisées\n' : ''}` +
          `${!profile.phone ? '- Compléter vos coordonnées professionnelles\n' : ''}` +
          `${!profile.certifications?.length ? '- Valoriser vos certifications et formations\n' : ''}`
        : "Je peux vous accompagner dans la création de votre profil professionnel. Par où souhaitez-vous commencer ?",
      
      profile?.role
        ? `En tant que ${profile.role}, je peux vous proposer des améliorations ciblées pour votre secteur d'activité.`
        : "Commençons par définir votre rôle professionnel pour personnaliser votre profil.",
      
      "Je peux analyser votre profil et suggérer des améliorations stratégiques.",
      "Souhaitez-vous que nous examinions ensemble votre profil pour le rendre plus attractif ?",
      "Je peux vous aider à mettre en valeur votre parcours et vos compétences de manière optimale.",
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  }
}