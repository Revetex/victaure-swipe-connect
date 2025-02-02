import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { toast } from "sonner";

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { 
        message, 
        userId: user.id,
        context: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language
        }
      }
    });

    if (error) throw error;
    return data.response;

  } catch (error) {
    console.error('Error generating AI response:', error);
    toast.error("Une erreur est survenue lors de la génération de la réponse");
    throw error;
  }
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
        created_at: message.timestamp.toISOString(),
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        read: message.read
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
      sender_id: msg.sender_id || user.id,
      receiver_id: msg.receiver_id || 'assistant',
      read: msg.read || false
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
    
    toast.success("Merci pour votre retour !");
  } catch (error) {
    console.error('Error providing feedback:', error);
    toast.error("Une erreur est survenue lors de l'envoi du retour");
    throw error;
  }
}