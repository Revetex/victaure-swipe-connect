import { v4 as uuidv4 } from 'uuid';
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
      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);
      await saveMessage(userMessage);
      setInputMessage("");

      // Add thinking message
      const thinkingMessage: Message = {
        id: uuidv4(),
        content: "",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, thinkingMessage]);
      setIsThinking(true);

      try {
        // Generate AI response
        const aiResponse = await generateAIResponse(message, profile);

        // Replace thinking message with actual response
        const assistantMessage: Message = {
          id: uuidv4(),
          content: aiResponse,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev.filter(m => !m.thinking), assistantMessage]);
        await saveMessage(assistantMessage);
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast.error("Erreur lors de la génération de la réponse");
        setMessages(prev => prev.filter(m => !m.thinking));
      } finally {
        setIsThinking(false);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const clearChat = async () => {
    try {
      setDeletedMessages(messages);
      setMessages([]);
      toast.success("Conversation effacée");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  const restoreChat = async () => {
    try {
      if (deletedMessages.length > 0) {
        setMessages(deletedMessages);
        setDeletedMessages([]);
        toast.success("Conversation restaurée");
      }
    } catch (error) {
      console.error("Error restoring chat:", error);
      toast.error("Erreur lors de la restauration de la conversation");
    }
  };

  return {
    handleSendMessage,
    clearChat,
    restoreChat
  };
}