import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";

const getHuggingFaceApiKey = async () => {
  console.info('Récupération de la clé API Hugging Face...');
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });
    
    if (error) throw error;
    console.info('Clé API récupérée avec succès');
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la clé API:', error);
    throw error;
  }
};

export const generatePersonalizedAIResponse = async (message: string): Promise<string> => {
  console.info('Génération de la réponse IA...');
  try {
    const apiKey = await getHuggingFaceApiKey();
    console.info('Envoi de la requête à l\'API Hugging Face...');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const result = await response.json();
    return result[0].generated_text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

export const saveMessage = async (message: Message): Promise<void> => {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          content: message.content,
          sender: message.sender,
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const loadMessages = async (): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error('Error loading messages:', error);
    throw error;
  }
};

export const deleteAllMessages = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
};