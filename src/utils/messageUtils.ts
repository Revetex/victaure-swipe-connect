import { Message as ChatMessage } from "@/types/chat/messageTypes";
import { Message, Receiver } from "@/types/messages";

export const formatChatMessages = (messages: ChatMessage[]): Message[] => {
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender_id: msg.sender_id || '',
    receiver_id: msg.receiver_id || '',
    read: msg.read || false,
    created_at: msg.created_at || new Date().toISOString(),
    thinking: msg.thinking,
    timestamp: msg.timestamp?.toString(),
    sender: msg.sender
  }));
};

export const filterMessages = (messages: Message[], receiver: Receiver | null): Message[] => {
  if (!receiver) return [];
  
  if (receiver.id === 'assistant') {
    return messages;
  }

  return messages.filter(message => 
    message.sender_id === receiver.id || message.receiver_id === receiver.id
  );
};