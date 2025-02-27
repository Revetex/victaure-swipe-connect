
export * from '@/hooks/useGigsAdapter';
export * from '@/components/marketplace/hooks/useFavorites';
export * from '@/components/messages/conversation/hooks/useConversationAdapter';
export * from '@/utils/typeConversions';

// Types étendus
export type { 
  ExtendedMarketplaceListing,
  MarketplaceFavoriteInput,
  MarketplaceFavoriteExtended
} from '@/types/marketplace';

// Fonctions utilitaires pour la compatibilité
export const createCompatProps = {
  conversation: (data: any) => ({
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  }),
  message: (data: any) => ({
    id: data.id || `temp-${Date.now()}`,
    content: data.content || '',
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    created_at: data.created_at || new Date().toISOString(),
    read: false,
    status: 'sent',
    message_type: 'text',
    ...data
  })
};

// Adaptateurs de conversion pour les différents formats
export const adapters = {
  favorite: (data: any) => ({
    id: data.id,
    item_id: data.item_id || data.listing_id,
    user_id: data.user_id || data.viewer_id,
    listing_id: data.listing_id || data.item_id,
    viewer_id: data.viewer_id || data.user_id
  }),
  listing: (data: any) => ({
    ...data,
    location: data.location || '',
    category: data.category || '',
    views_count: data.views_count || 0,
    favorites_count: data.favorites_count || 0,
    featured: !!data.featured,
    sale_type: data.sale_type || ''
  })
};
