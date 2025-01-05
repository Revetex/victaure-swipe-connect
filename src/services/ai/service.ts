import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";
import { UserProfile } from "@/types/profile";

async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'HUGGING_FACE_API_KEY' }
    });

    if (error) throw error;
    return data?.secret || '';
  } catch (error) {
    console.error('Erreur dans getHuggingFaceApiKey:', error);
    throw error;
  }
}

async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
}

function formatSystemPrompt(profile: UserProfile | null): string {
  if (!profile) return SYSTEM_PROMPT;
  
  return SYSTEM_PROMPT
    .replace('{role}', profile.role || 'non spécifié')
    .replace('{skills}', profile.skills?.join(', ') || 'non spécifiées')
    .replace('{city}', profile.city || 'non spécifiée')
    .replace('{state}', profile.state || 'non spécifié')
    .replace('{country}', profile.country || 'non spécifié');
}

export async function generateAIResponse(message: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HUGGING_FACE_CONFIG.timeout);

  try {
    const apiKey = await getHuggingFaceApiKey();
    const profile = await getUserProfile();
    const systemPrompt = formatSystemPrompt(profile);
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_CONFIG.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: HUGGING_FACE_CONFIG.maxTokens,
            temperature: HUGGING_FACE_CONFIG.temperature,
            top_p: HUGGING_FACE_CONFIG.top_p,
            do_sample: true,
            return_full_text: false,
            wait_for_model: true
          }
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 503) {
        throw new Error('Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.');
      }
      throw new Error(errorData.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    if (!data || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }
    
    return data[0].generated_text.trim();
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse IA:', error);
    if (error.name === 'AbortError') {
      throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
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