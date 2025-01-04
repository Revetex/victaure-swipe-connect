import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { generateAIResponse, saveMessage } from "@/services/aiChatService";
import { toast } from "sonner";

export function useChatActions(
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  deletedMessages: Message[],
  setDeletedMessages: (messages: Message[]) => void,
  setInputMessage: (message: string) => void,
  setIsThinking: (isThinking: boolean) => void
) {
  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    try {
      console.log("Sending message:", message);
      
      const newUserMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newUserMessage]);
      
      await saveMessage({
        ...newUserMessage,
        created_at: newUserMessage.timestamp,
      });
      
      setInputMessage("");
      setIsThinking(true);

      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "...",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newUserMessage, thinkingMessage]);

      try {
        console.log("Generating AI response...");
        const response = await generateAIResponse(message, profile);
        
        if (!response) {
          throw new Error("Pas de réponse de l'IA");
        }

        console.log("AI response generated:", response);

        const newAssistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages([...messages, newUserMessage, newAssistantMessage]);

        await saveMessage({
          ...newAssistantMessage,
          created_at: newAssistantMessage.timestamp,
        });

      } catch (error) {
        console.error("Error in AI response generation:", error);
        setMessages([...messages, newUserMessage]);
        
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Une erreur est survenue lors de la génération de la réponse");
        }
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.");
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      setDeletedMessages(messages);
      setMessages([]);

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Erreur dans clearChat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
      throw error;
    }
  };

  const restoreChat = async () => {
    if (deletedMessages.length === 0) {
      toast.error("Aucune conversation à restaurer");
      return;
    }

    try {
      for (const message of deletedMessages) {
        await saveMessage({
          ...message,
          created_at: message.timestamp,
        });
      }
      setMessages(deletedMessages);
      setDeletedMessages([]);
      toast.success("Conversation restaurée avec succès");
    } catch (error) {
      console.error('Erreur dans restoreChat:', error);
      toast.error("Erreur lors de la restauration de la conversation");
      throw error;
    }
  };

  return {
    handleSendMessage,
    clearChat,
    restoreChat
  };
}