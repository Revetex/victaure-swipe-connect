import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { buildSystemPrompt } from "./ai/promptBuilder";
import { getFallbackResponse } from "./ai/fallbackResponses";

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

    // Sanitize input and build prompt
    const sanitizedMessage = sanitizeInput(message);
    const systemPrompt = buildSystemPrompt(profile, sanitizedMessage);

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
    return getFallbackResponse(profile);
  }
}