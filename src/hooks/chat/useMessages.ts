import { useState, useEffect } from "react";
import { Message } from "@/types/chat/messageTypes";
import { loadMessages } from "@/services/aiChatService";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Initializing chat...");
        const savedMessages = await loadMessages();
        setMessages(savedMessages);
        console.log("Chat initialized with messages:", savedMessages);
      } catch (error) {
        console.error("Error initializing chat:", error);
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