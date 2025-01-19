import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { toast } from "sonner";
import { SYSTEM_PROMPT, FALLBACK_MESSAGE } from './prompts';

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Generating AI response...');

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { 
        message,
        userId: user.id,
        context: {
          previousMessages: await loadMessages(),
          emotionalContext: analyzeEmotionalContext(message),
          systemPrompt: SYSTEM_PROMPT
        }
      }
    });

    if (error) throw error;
    if (!data?.response) {
      console.warn('Invalid response format, using fallback');
      return FALLBACK_MESSAGE;
    }
    
    console.log('AI response generated:', data.response);
    return data.response;

  } catch (error) {
    console.error('Error generating AI response:', error);
    toast.error("Une erreur est survenue lors de la génération de la réponse");
    return FALLBACK_MESSAGE;
  }
}

function analyzeEmotionalContext(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Analyse plus détaillée des émotions
  if (lowerMessage.includes('merci') || lowerMessage.includes('super') || lowerMessage.includes('génial')) {
    return 'positive';
  }
  if (lowerMessage.includes('difficile') || lowerMessage.includes('problème') || lowerMessage.includes('aide')) {
    return 'concerned';
  }
  if (lowerMessage.includes('frustré') || lowerMessage.includes('fâché') || lowerMessage.includes('pas content')) {
    return 'frustrated';
  }
  if (lowerMessage.includes('confus') || lowerMessage.includes('comprends pas') || lowerMessage.includes('perdu')) {
    return 'confused';
  }
  if (lowerMessage.includes('urgent') || lowerMessage.includes('vite') || lowerMessage.includes('pressé')) {
    return 'urgent';
  }
  
  return 'neutral';
}

export async function saveMessage(message: Message): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
    console.error('Error saving message:', error);
    toast.error("Une erreur est survenue lors de la sauvegarde du message");
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
    console.error('Error loading messages:', error);
    toast.error("Une erreur est survenue lors du chargement des messages");
    throw error;
  }
}

export async function deleteAllMessages(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting messages:', error);
    toast.error("Une erreur est survenue lors de la suppression des messages");
    throw error;
  }
}

export async function provideFeedback(messageId: string, score: number): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('ai_learning_data')
      .update({ feedback_score: score })
      .eq('id', messageId)
      .eq('user_id', user.id);

    if (error) throw error;
    toast.success("Merci pour votre feedback!");
  } catch (error) {
    console.error('Error providing feedback:', error);
    toast.error("Une erreur est survenue lors de l'envoi du feedback");
    throw error;
  }
}
