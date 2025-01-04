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
        const formattedMessages = savedMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "user" | "assistant",
          timestamp: new Date(msg.created_at || msg.timestamp),
          created_at: msg.created_at
        }));
        setMessages(formattedMessages);
        console.log("Chat initialized with messages:", formattedMessages);
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