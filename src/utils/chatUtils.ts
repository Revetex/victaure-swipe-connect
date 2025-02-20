
import { Message } from '@/types/messages';

export const formatMessageTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString('fr-FR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);
};

export const isMessageRead = (message: Message): boolean => {
  return message.read || message.sender_id === 'assistant';
};

export const shouldShowTimestamp = (
  currentMessage: Message,
  previousMessage?: Message
): boolean => {
  if (!previousMessage) return true;

  const currentTime = new Date(currentMessage.created_at).getTime();
  const previousTime = new Date(previousMessage.created_at).getTime();
  
  // Afficher le timestamp si plus de 5 minutes se sont écoulées
  return currentTime - previousTime > 5 * 60 * 1000;
};
