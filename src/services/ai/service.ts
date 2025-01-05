import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";

async function getHuggingFaceApiKey(): Promise<string> {
  try {
    console.log('Fetching Hugging Face API key...');
    const { data, error } = await supabase
      .rpc('get_secret', {
        secret_name: 'HUGGING_FACE_API_KEY'
      });

    if (error) {
      console.error('Failed to retrieve API key:', error);
      throw new Error('Erreur lors de la récupération de la clé API');
    }

    if (!data || data.length === 0) {
      console.error('No data returned from get_secret');
      throw new Error('Aucune donnée reçue du serveur');
    }

    const apiKey = data[0]?.secret;
    if (!apiKey || apiKey.trim() === '') {
      console.error('API key is empty or invalid');
      throw new Error('Clé API non trouvée ou invalide');
    }

    console.log('API key retrieved successfully');
    return apiKey;
  } catch (error) {
    console.error('Error in getHuggingFaceApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(message: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, HUGGING_FACE_CONFIG.timeout);

  try {
    console.log('Starting AI response generation...');
    const apiKey = await getHuggingFaceApiKey();
    
    console.log('Sending request to Hugging Face API...');
    
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
      console.error('Hugging Face API error:', errorData);
      
      if (response.status === 503) {
        throw new Error('Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.');
      }
      throw new Error(errorData.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    console.log('Received response from API:', data);
    
    if (!data || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }
    
    return data[0].generated_text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error.name === 'AbortError') {
      throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveMessage(message: Message): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
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
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading messages:', error);
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
}

export async function deleteAllMessages(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('ai_chat_messages')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
}
