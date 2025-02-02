import { Message } from "@/types/chat/messageTypes";
import { deleteAllMessages, generateAIResponse, saveMessage } from "@/services/ai/service";
import { toast } from "sonner";

export function useChatActions(
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  deletedMessages: Message[],
  setDeletedMessages: (messages: Message[]) => void,
  setInputMessage: (message: string) => void,
  setIsThinking: (isThinking: boolean) => void
) {
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage, thinkingMessage]);
      setIsThinking(true);
      setInputMessage("");

      try {
        await saveMessage(userMessage);
        console.log('Generating AI response...');
        const aiResponse = await generateAIResponse(message);
        console.log('AI response generated:', aiResponse);
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: aiResponse,
          sender: "assistant",
          timestamp: new Date(),
        };

        await saveMessage(assistantMessage);
        setMessages([...messages, userMessage, assistantMessage]);
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast.error("Une erreur est survenue lors de la génération de la réponse");
        setMessages([...messages, userMessage]);
      } finally {
        setIsThinking(false);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
      setIsThinking(false);
    }
  };

  const clearChat = async () => {
    try {
      setDeletedMessages(messages);
      await deleteAllMessages();
      setMessages([]);
      toast.success("La conversation a été effacée");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Une erreur est survenue lors de l'effacement de la conversation");
    }
  };

  const restoreChat = async () => {
    try {
      if (deletedMessages.length > 0) {
        for (const message of deletedMessages) {
          await saveMessage(message);
        }
        setMessages(deletedMessages);
        setDeletedMessages([]);
        toast.success("La conversation a été restaurée");
      }
    } catch (error) {
      console.error("Error restoring chat:", error);
      toast.error("Une erreur est survenue lors de la restauration de la conversation");
    }
  };

  return {
    handleSendMessage,
    clearChat,
    restoreChat
  };
}