import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";

async function getHuggingFaceApiKey(): Promise<string> {
  try {
    console.log('Récupération de la clé API Hugging Face...');
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'HUGGING_FACE_API_KEY' }
    });

    if (error) {
      console.error('Erreur lors de la récupération de la clé API:', error);
      throw new Error('Erreur lors de la récupération de la clé API');
    }

    const apiKey = data?.secret;
    if (!apiKey) {
      console.error('Clé API non trouvée');
      throw new Error('Clé API non trouvée');
    }

    console.log('Clé API récupérée avec succès');
    return apiKey;
  } catch (error) {
    console.error('Erreur dans getHuggingFaceApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(message: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, HUGGING_FACE_CONFIG.timeout);

  try {
    console.log('Génération de la réponse IA...');
    const apiKey = await getHuggingFaceApiKey();
    
    console.log('Envoi de la requête à l\'API Hugging Face...');
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_CONFIG.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
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
      console.error('Erreur API Hugging Face:', errorData);
      
      if (response.status === 503) {
        throw new Error('Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.');
      }
      throw new Error(errorData.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    console.log('Réponse reçue de l\'API:', data);
    
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
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        user_id: user.id,
        content: message.content,
        sender: message.sender,
        created_at: message.timestamp.toISOString()
      });

    if (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message:', error);
    toast.error('Erreur lors de la sauvegarde du message');
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors du chargement des messages:', error);
      throw error;
    }

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
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur lors de la suppression des messages:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des messages:', error);
    toast.error('Erreur lors de la suppression des messages');
    throw error;
  }
}