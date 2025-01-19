import { useState, useEffect } from "react";
import { Message } from "@/types/chat/messageTypes";
import { loadMessages } from "@/services/ai/service";
import { toast } from "sonner";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const savedMessages = await loadMessages();
        if (savedMessages) {
          setMessages(savedMessages);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Erreur lors du chargement des messages");
      }
    };
    initializeChat();
  }, []);

  return {
    messages,
    setMessages,
    deletedMessages,
    setDeletedMessages
  };
}