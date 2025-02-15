
import { Message as ChatMessage } from "@/types/chat/messageTypes";
import { Message, MessageSender, Receiver } from "@/types/messages";

const defaultSender: MessageSender = {
  id: 'assistant',
  full_name: 'M. Victaure',
  avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
  online_status: true,
  last_seen: new Date().toISOString()
};

const defaultReceiver: Receiver = {
  id: 'user',
  full_name: 'Utilisateur',
  avatar_url: null,
  online_status: true,
  last_seen: new Date().toISOString()
};

export const formatChatMessages = (messages: ChatMessage[]): Message[] => {
  if (!Array.isArray(messages)) return [];
  
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content || "",
    sender_id: msg.sender_id,
    receiver_id: msg.receiver_id,
    read: msg.read || false,
    created_at: msg.created_at,
    updated_at: msg.updated_at || msg.created_at,
    timestamp: msg.created_at,
    thinking: msg.thinking || false,
    sender: typeof msg.sender === 'string' ? defaultSender : msg.sender,
    receiver: msg.receiver || defaultReceiver,
    message_type: 'user',
    status: 'sent',
    metadata: {},
    reaction: null,
    is_assistant: false
  }));
};
