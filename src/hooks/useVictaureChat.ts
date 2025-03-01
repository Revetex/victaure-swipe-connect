
import { useState, useCallback, useEffect } from 'react';
import { Message, Receiver } from '@/types/messages';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const INITIAL_CONTEXT = `Vous êtes Victaure AI, un assistant intelligent qui aide les utilisateurs à trouver des solutions à leurs problèmes.
Vous êtes concis, utile et essayez toujours de fournir des réponses pertinentes basées sur des faits.`;

export function useVictaureChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const botId = 'victaure-ai';

  useEffect(() => {
    const loadInitialMessage = async () => {
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          content: "Bonjour, je suis Victaure, votre assistant IA. Comment puis-je vous aider aujourd'hui?",
          sender_id: botId,
          receiver_id: user?.id || 'guest',
          created_at: new Date().toISOString(),
          read: true,
          sender: {
            id: botId,
            full_name: 'Victaure AI',
            avatar_url: '/user-icon.svg',
            // Don't include role since it's not part of Receiver
          }
        };
        setMessages([welcomeMessage]);
      }
    };

    loadInitialMessage();
  }, [messages.length, user?.id]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        sender_id: user?.id || 'guest',
        receiver_id: botId,
        created_at: new Date().toISOString(),
        read: true,
        sender: {
          id: user?.id || 'guest',
          full_name: user?.email || 'Vous',
          avatar_url: null,
          // Don't include role since it's not part of Receiver
        }
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Save interaction to database if user is logged in
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
      
      // Give AI time to "think"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate AI response
      const aiResponse = await generateResponse(content, messages);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: aiResponse,
        sender_id: botId,
        receiver_id: user?.id || 'guest',
        created_at: new Date().toISOString(),
        read: true,
        sender: {
          id: botId,
          full_name: 'Victaure AI',
          avatar_url: '/user-icon.svg',
          // Don't include role since it's not part of Receiver
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Erreur lors de la génération de la réponse');
    } finally {
      setIsLoading(false);
    }
  }, [messages, user]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
}

// Simple response generation based on patterns
async function generateResponse(message: string, history: Message[]): Promise<string> {
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
}
