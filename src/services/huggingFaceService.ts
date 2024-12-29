<lov-code>
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { buildSystemPrompt } from "./ai/promptBuilder";
import { getFallbackResponse } from "./ai/fallbackResponses";

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    if (!message?.trim()) {
      throw new Error('Message invalide');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    if (!checkRateLimit(user.id)) {
      throw new Error('Limite de requêtes atteinte. Veuillez réessayer dans une minute.');
    }

    const sanitizedMessage = sanitizeInput(message);
    const systemPrompt = buildSystemPrompt(profile, sanitizedMessage);

    console.log('Generating AI response with context:', {
      profile: profile?.id,
      messageLength: sanitizedMessage.length,
      hasSkills: profile?.skills?.length > 0,
      hasCertifications: profile?.certifications?.length > 0,
      hasBio: !!profile?.bio,
      role: profile?.role,
      location: profile?.city ? `${profile.city}, ${profile.country}` : profile?.country
    });

    // Get the API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (secretError || !secretData?.secret) {
      console.error('Error fetching API key:', secretError);
      throw new Error('Configuration API manquante');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': `Bearer ${secretData.secret}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.8,
          top_p: 0.95,
          repetition_penalty: 1.15,
          top_k: 50,
          do_sample: true,
          return_full_text: false,
          stop: ["</s>", "