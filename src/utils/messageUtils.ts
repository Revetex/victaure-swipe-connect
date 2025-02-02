import { Message as ChatMessage } from "@/types/chat/messageTypes";
import { Message, Receiver } from "@/types/messages";

export const formatChatMessages = (messages: ChatMessage[]): Message[] => {
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender_id: msg.sender === 'user' ? msg.sender_id || 'user' : 'assistant',
    receiver_id: msg.sender === 'user' ? 'assistant' : msg.sender_id || 'user',
    read: false,
    created_at: msg.created_at || new Date().toISOString(),
    thinking: msg.thinking,
    timestamp: msg.timestamp?.toString(),
    sender: msg.sender === 'user' ? undefined : {
      id: 'assistant',
      full_name: 'M. Victaure',
      avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png'
    }
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