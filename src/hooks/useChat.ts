import { useState, useEffect } from "react";
import { generateAIResponse, saveMessage, loadMessages } from "@/services/aiChatService";
import { Message, ChatState, ChatActions } from "@/types/chat";
import { toast } from "sonner";

export function useChat(): ChatState & ChatActions {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      const savedMessages = await loadMessages();
      setMessages(savedMessages);
    };
    initializeChat();
  }, []);

  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    try {
      // Sauvegarder le message de l'utilisateur
      const newUserMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newUserMessage]);
      await saveMessage(newUserMessage);
      setInputMessage("");
      setIsThinking(true);

      // Ajouter un message "thinking"
      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "...",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // Générer la réponse de l'IA
      console.log("Génération de la réponse...");
      const response = await generateAIResponse(message, profile);
      
      if (!response) {
        throw new Error("Pas de réponse de l'IA");
      }

      console.log("Réponse générée:", response);

      // Remplacer le message "thinking" par la vraie réponse
      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== thinkingMessage.id);
        return [...filtered, newAssistantMessage];
      });

      // Sauvegarder la réponse
      await saveMessage(newAssistantMessage);

    } catch (error) {
      console.error("Erreur dans handleSendMessage:", error);
      setMessages(prev => prev.filter(msg => !msg.thinking));
      toast.error("Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Erreur de reconnaissance vocale:", event.error);
      setIsListening(false);
      toast.error("Erreur lors de la reconnaissance vocale");
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      setDeletedMessages(messages);

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMessages([]);
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
        await saveMessage(message);
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
    messages,
    inputMessage,
    isListening,
    isThinking,
    setMessages,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
    restoreChat,
    deletedMessages
  };
}