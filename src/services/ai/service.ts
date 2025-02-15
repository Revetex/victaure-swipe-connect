
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { PROACTIVE_QUESTIONS, LEARNING_PROMPTS, CUSTOM_ADVICE } from './prompts';

export const saveMessage = async (message: Message) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        sender_id: user.id,
        receiver_id: user.id,
        content: message.content,
        is_assistant: message.sender_id === 'assistant',
        created_at: message.created_at,
        updated_at: message.updated_at
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const deleteAllMessages = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('receiver_id', user.id)
      .eq('is_assistant', true);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
};

export const loadMessages = async (): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .eq('is_assistant', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.is_assistant ? 'assistant' : 'user',
      timestamp: msg.created_at,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender_id: msg.is_assistant ? 'assistant' : user.id,
      receiver_id: user.id,
      read: msg.read
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
};

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get user profile to personalize responses
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get previous conversation context
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('content, is_assistant')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Prepare context for AI
    const context = {
      userProfile: profile,
      recentMessages: recentMessages || [],
      proactiveQuestions: PROACTIVE_QUESTIONS,
      learningPrompts: LEARNING_PROMPTS,
      customAdvice: CUSTOM_ADVICE
    };

    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        context,
        userId: user.id
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();

    // Update user profile with any new information learned
    if (data.learnedInfo) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data.learnedInfo)
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating profile with learned info:", updateError);
      }
    }

    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

// Nouvelle fonction pour obtenir une question proactive
export const getProactiveQuestion = (profile: any): string => {
  // Identifier les informations manquantes dans le profil
  const missingInfo = [];
  
  if (!profile.skills || profile.skills.length === 0) {
    missingInfo.push('skills');
  }
  if (!profile.preferred_locations) {
    missingInfo.push('location');
  }
  if (!profile.career_objectives) {
    missingInfo.push('objectives');
  }
  if (!profile.salary_expectations) {
    missingInfo.push('salary');
  }

  // Sélectionner une question pertinente basée sur les informations manquantes
  if (missingInfo.length > 0) {
    const topic = missingInfo[Math.floor(Math.random() * missingInfo.length)];
    const relevantQuestions = PROACTIVE_QUESTIONS.filter(q => 
      q.toLowerCase().includes(topic)
    );
    return relevantQuestions[0] || PROACTIVE_QUESTIONS[0];
  }

  // Si toutes les informations de base sont présentes, poser une question de suivi
  return PROACTIVE_QUESTIONS[Math.floor(Math.random() * PROACTIVE_QUESTIONS.length)];
};
