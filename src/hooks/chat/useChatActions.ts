import { Message } from "@/types/chat/messageTypes";
import { deleteAllMessages, generateAIResponse, saveMessage } from "@/services/ai/service";
import { toast } from "sonner";

export function useChatActions(
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  setIsThinking: (isThinking: boolean) => void,
  setDeletedMessages: (messages: Message[]) => void,
  deletedMessages: Message[]
) {
  const handleSendMessage = async (message: string, profile: any) => {
    if (!message.trim()) return;

    setIsThinking(true);

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
      setInputMessage("");

      try {
        const aiResponse = await generateAIResponse(message, profile);
        await saveMessage(userMessage);
        
        console.log('Réponse de l\'IA générée:', aiResponse);
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: aiResponse,
          sender: "assistant",
          timestamp: new Date(),
        };

        await saveMessage(assistantMessage);
        
        setMessages([...messages, userMessage, assistantMessage]);
      } catch (error) {
        console.error("Erreur lors de la génération de la réponse:", error);
        toast.error("Oups! Y'a eu un pépin avec la réponse. On réessaye?");
        setMessages([...messages, userMessage]);
      } finally {
        setIsThinking(false);
      }
    } catch (error) {
      console.error("Erreur dans handleSendMessage:", error);
      toast.error("Ben voyons donc! Ça n'a pas marché. On réessaye?");
      setIsThinking(false);
    }
  };

  const clearChat = async () => {
    try {
      setDeletedMessages(messages);
      await deleteAllMessages();
      setMessages([]);
      toast.success("La conversation a été effacée, là!");
    } catch (error) {
      console.error("Erreur lors de l'effacement:", error);
      toast.error("Aïe! Ça n'a pas voulu s'effacer. On réessaye?");
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
        toast.success("Parfait! La conversation est revenue!");
      }
    } catch (error) {
      console.error("Erreur lors de la restauration:", error);
      toast.error("Oups! On n'a pas pu ramener la conversation. On réessaye?");
    }
  };

  return {
    handleSendMessage,
    clearChat,
    restoreChat,
  };
}