
// Fichier centralisé pour tous les adaptateurs que nous avons créés
// Cela permet de remplacer les imports problématiques facilement

// Adaptateurs Marketplace
export { useGigsAdapter } from '@/hooks/useGigsAdapter';
export { useListingSearchAdapter } from '@/components/marketplace/hooks/useListingSearchAdapter';
export { ContractFormAdaptor as ContractForm } from '@/components/marketplace/adaptors/ContractFormAdaptor';
export { 
  checkIsFavorited, 
  getFavorites, 
  toggleFavorite, 
  adaptHandleFavoriteToggle 
} from '@/utils/marketplaceAdapters';

// Adaptateurs Messages
export { ConversationHeaderAdapter as ConversationHeader } from '@/components/messages/conversation/ConversationHeaderAdapter';
export { useMessagesAdapter as useMessages } from '@/components/messages/conversation/hooks/useMessagesAdapter';
export { CustomConversationListAdapter as CustomConversationList } from '@/components/messages/CustomConversationListAdapter';

// Utilitaires de conversion
export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1' || value === 'yes' || value === 'online';
  }
  return !!value;
}

// Fonction sécurisée pour vérifier les propriétés d'un objet
export function safeStringLowerCase(value: any): string {
  if (typeof value === 'string') return value.toLowerCase();
  return String(value || '').toLowerCase();
}

// Fonction pour adapter les props de ConversationHeader
export function createHeaderProps(receiver: any): any {
  return {
    name: receiver?.full_name || receiver?.name || 'Contact',
    avatar: receiver?.avatar_url || receiver?.avatar || null,
    isOnline: ensureBoolean(receiver?.online_status || receiver?.isOnline),
    receiver: receiver,
    onBack: () => window.history.back()
  };
}

// Adaptateur pour créer des objets Message complets
export function createMessage(data: any): any {
  return {
    id: data.id || `temp-${Date.now()}`,
    content: data.content || '',
    sender_id: data.sender_id || (data.sender?.id || ''),
    receiver_id: data.receiver_id || '',
    created_at: data.created_at || new Date().toISOString(),
    read: Boolean(data.read),
    status: data.status || 'sent',
    sender: data.sender,
    metadata: data.metadata || {}
  };
}
