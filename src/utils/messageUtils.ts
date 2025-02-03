import { Message as ChatMessage } from "@/types/chat/messageTypes";
import { Message, Receiver } from "@/types/messages";

export const formatChatMessages = (messages: ChatMessage[]): Message[] => {
  if (!Array.isArray(messages)) return [];
  
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content || "",
    sender_id: msg.sender_id,
    receiver_id: msg.receiver_id,
    read: msg.read,
    created_at: msg.created_at,
    timestamp: msg.timestamp,
    thinking: msg.thinking,
    sender: typeof msg.sender === 'string' ? {
      id: 'assistant',
      full_name: 'M. Victaure',
      avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
      online_status: true,
      last_seen: new Date().toISOString()
    } : msg.sender
  }));
};

export const filterMessages = (messages: Message[], receiver: Receiver | null): Message[] => {
  if (!Array.isArray(messages) || !receiver) return [];
  
  if (receiver.id === 'assistant') {
    return messages;
  }

  return messages.filter(message => 
    message && (message.sender_id === receiver.id || message.receiver_id === receiver.id)
  );
};