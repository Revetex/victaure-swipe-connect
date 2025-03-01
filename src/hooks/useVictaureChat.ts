
import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/messages';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Constants
const INITIAL_CONTEXT = `Vous êtes Victaure AI, un assistant intelligent qui aide les utilisateurs à trouver des solutions à leurs problèmes.
Vous êtes concis, utile et essayez toujours de fournir des réponses pertinentes basées sur des faits.`;

const MAX_FREE_QUESTIONS = 3; // Maximum number of questions for non-logged in users
const BOT_ID = 'victaure-ai';
const BOT_NAME = 'Victaure AI';
const BOT_AVATAR = '/user-icon.svg';

export function useVictaureChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuestions, setUserQuestions] = useState(0);
  const { user } = useAuth();

  // Calculate questions left for non-logged in users
  const questionsLeft = user ? null : MAX_FREE_QUESTIONS - userQuestions;

  // Helper function to create message objects
  const createMessage = useCallback((
    content: string, 
    isUserMessage: boolean
  ): Message => {
    const senderId = isUserMessage ? (user?.id || 'guest') : BOT_ID;
    const receiverId = isUserMessage ? BOT_ID : (user?.id || 'guest');
    
    return {
      id: `${isUserMessage ? 'user' : 'bot'}-${Date.now()}`,
      content,
      sender_id: senderId,
      receiver_id: receiverId,
      created_at: new Date().toISOString(),
      read: true,
      sender: {
        id: senderId,
        full_name: isUserMessage 
          ? (user?.email || 'Vous') 
          : BOT_NAME,
        avatar_url: isUserMessage ? null : BOT_AVATAR,
      }
    };
  }, [user]);

  // Load initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = createMessage(
        "Bonjour, je suis Victaure, votre assistant IA. Comment puis-je vous aider aujourd'hui?",
        false
      );
      setMessages([welcomeMessage]);
    }
  }, [messages.length, createMessage]);

  // Determine if user has reached free usage limit
  const hasReachedFreeLimit = useCallback(() => {
    return !user && userQuestions >= MAX_FREE_QUESTIONS;
  }, [user, userQuestions]);

  // Generate AI response based on keywords and context
  const generateResponse = useCallback(async (message: string, history: Message[]): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    
    if (lowerMessage.includes('merci')) {
      return 'Je vous en prie. N\'hésitez pas si vous avez d\'autres questions.';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('aide')) {
      return 'Je peux vous aider avec des informations sur Victaure, la recherche d\'emploi, la création de profil, et plus encore. Que souhaitez-vous savoir ?';
    }
    
    if (lowerMessage.includes('emploi') || lowerMessage.includes('job') || lowerMessage.includes('travail')) {
      return 'Victaure propose une plateforme de recherche d\'emploi avancée. Vous pouvez parcourir les offres, postuler directement et même recevoir des recommandations personnalisées.';
    }
    
    if (lowerMessage.includes('profil') || lowerMessage.includes('cv')) {
      return 'Votre profil Victaure est votre carte de visite numérique. Complétez vos informations, compétences et expériences pour augmenter votre visibilité auprès des recruteurs.';
    }
    
    return 'Je comprends votre question. Pour obtenir des informations plus précises, pourriez-vous me donner plus de détails sur ce que vous recherchez ?';
  }, []);

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Check free usage limits
      if (hasReachedFreeLimit()) {
        toast.error("Vous avez atteint la limite de questions gratuites. Veuillez vous connecter pour continuer.");
        return;
      }
      
      // Add user message to chat
      const userMessage = createMessage(content, true);
      setMessages(prev => [...prev, userMessage]);
      
      // Track usage for non-logged users
      if (!user) {
        setUserQuestions(prev => prev + 1);
      }
      
      // Log interaction in database for logged users
      if (user) {
        await supabase.from('ai_interactions').insert({
          user_id: user.id,
          interaction_type: 'chat',
          context: JSON.stringify({ 
            message: content,
            timestamp: new Date().toISOString() 
          })
        });
      }
      
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate and add AI response
      const aiResponse = await generateResponse(content, messages);
      const botMessage = createMessage(aiResponse, false);
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Erreur lors de la génération de la réponse');
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, userQuestions, createMessage, hasReachedFreeLimit, generateResponse]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    setUserQuestions(0);
    toast.success("Historique effacé");
  }, []);

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat, 
    questionsLeft 
  };
}
