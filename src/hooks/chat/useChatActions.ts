import { v4 as uuidv4 } from 'uuid';
import { Message } from "@/types/chat/messageTypes";
import { generateAIResponse, saveMessage, deleteAllMessages } from "@/services/ai/service";
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
        id: uuidv4(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      await saveMessage(userMessage);
      setMessages([...messages, userMessage]);
      setInputMessage("");

      const thinkingMessage: Message = {
        id: uuidv4(),
        content: "",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage, thinkingMessage]);
      setIsThinking(true);

      try {
        const aiResponse = await generateAIResponse(message);
        const assistantMessage: Message = {
          id: uuidv4(),
          content: aiResponse,
          sender: "assistant",
          timestamp: new Date(),
        };

        await saveMessage(assistantMessage);
        setMessages([...messages, userMessage, assistantMessage]);
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast.error("Erreur lors de la génération de la réponse");
        setMessages([...messages, userMessage]);
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
      await deleteAllMessages();
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
        for (const message of deletedMessages) {
          await saveMessage(message);
        }
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