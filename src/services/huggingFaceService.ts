import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { buildSystemPrompt } from "./ai/promptBuilder";

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

    // Get API key from Supabase with detailed error logging
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError) {
      console.error('Error fetching API key:', secretError);
      throw new Error(`Erreur lors de la récupération de la clé API: ${secretError.message}`);
    }

    // Check if we have a valid secret
    if (!secretData?.[0]?.secret || secretData[0].secret.trim() === '') {
      console.error('No API key found');
      throw new Error('Clé API HuggingFace non configurée');
    }

    // Sanitize input and build prompt
    const sanitizedMessage = sanitizeInput(message);
    const systemPrompt = buildSystemPrompt(profile, sanitizedMessage);

    console.log('Making request to HuggingFace API...');

    // Enhanced API call with better error handling
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': `Bearer ${secretData[0].secret}`,
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
      const errorData = await response.json().catch(() => null);
      console.error('HuggingFace API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Clé API HuggingFace invalide');
      }
      
      throw new Error(`Erreur API HuggingFace: ${response.statusText || 'Erreur inconnue'}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data);
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

    // Log successful interaction
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
    // Instead of using pre-recorded messages, generate a simple error response
    return "Je suis désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre demande différemment ?";
  }
}