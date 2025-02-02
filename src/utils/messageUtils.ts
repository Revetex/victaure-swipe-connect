import { Message } from "@/types/messages";
import { Message as ChatMessage } from "@/types/chat/messageTypes";

export const formatChatMessages = (chatMessages: ChatMessage[]): Message[] => {
  return chatMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender_id: msg.sender === 'user' ? 'user' : 'assistant',
    receiver_id: msg.sender === 'user' ? 'assistant' : 'user',
    read: true,
    created_at: msg.created_at || new Date().toISOString(),
    thinking: msg.thinking,
    timestamp: msg.timestamp?.toISOString(),
    sender: msg.sender === 'user' ? undefined : {
      id: 'assistant',
      full_name: 'M. Victaure',
      avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png'
    }
  }));
};

export const filterMessages = (messages: Message[], selectedReceiver: { id: string } | null) => {
  if (!selectedReceiver) return [];
  
  return messages.filter(msg => 
    (msg.sender_id === selectedReceiver.id && msg.receiver_id === 'user') ||
    (msg.sender_id === 'user' && msg.receiver_id === selectedReceiver.id)
  );
};