import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT, RETRY_CONFIG } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";
import { delay, calculateBackoff } from "./utils/retryUtils";
import { getHuggingFaceApiKey, callHuggingFaceAPI } from "./utils/apiUtils";
import { getUserProfile } from "./utils/profileUtils";
import { handleWelcomeMessage, handleFallbackMessage, formatUserProfile, validateProfileUpdate } from "./messageHandlers";
import { supabase } from "@/integrations/supabase/client";

export async function generateAIResponse(message: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HUGGING_FACE_CONFIG.timeout);

  try {
    const apiKey = await getHuggingFaceApiKey();
    const profile = await getUserProfile();
    const formattedProfile = formatUserProfile(profile);
    
    const systemPrompt = SYSTEM_PROMPT
      .replace('{role}', formattedProfile.role)
      .replace('{skills}', formattedProfile.skills)
      .replace('{city}', formattedProfile.city)
      .replace('{state}', formattedProfile.state)
      .replace('{country}', formattedProfile.country);

    let lastError = null;
    
    for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
      try {
        console.log(`Tentative ${attempt + 1}/${RETRY_CONFIG.maxRetries} de génération de réponse...`);
        
        const response = await callHuggingFaceAPI(
          apiKey,
          message,
          systemPrompt,
          HUGGING_FACE_CONFIG,
          controller
        );

        console.log('Réponse reçue avec succès');
        return response;

      } catch (error) {
        lastError = error;
        console.error(`Échec de la tentative ${attempt + 1}:`, error);
        
        if (error.name === 'AbortError') {
          throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
        }

        if (error.response?.status === 503) {
          console.log(`Le modèle est en cours de chargement (tentative ${attempt + 1})...`);
          const retryDelay = calculateBackoff(attempt, RETRY_CONFIG);
          console.log(`Attente de ${retryDelay/1000} secondes avant la prochaine tentative...`);
          await delay(retryDelay);
          continue;
        }
        
        if (attempt === RETRY_CONFIG.maxRetries - 1) {
          throw error;
        }
        
        const retryDelay = calculateBackoff(attempt, RETRY_CONFIG);
        await delay(retryDelay);
      }
    }

    throw lastError || new Error('Échec après plusieurs tentatives');
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse IA:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
    }
    
    if (error.message.includes('Service Unavailable')) {
      throw new Error('Le modèle est en cours de chargement. Veuillez patienter quelques secondes et réessayer.');
    }
    
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveMessage(message: Message): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        user_id: user.id,
        content: message.content,
        sender: message.sender,
        created_at: message.timestamp.toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message:', error);
    toast.error('Erreur lors de la sauvegarde du message');
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.created_at),
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      user_id: msg.user_id
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    toast.error('Erreur lors du chargement des messages');
    throw error;
  }
}

export async function deleteAllMessages(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression des messages:', error);
    toast.error('Erreur lors de la suppression des messages');
    throw error;
  }
}
