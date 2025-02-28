
import { MarketplaceFavorite, MarketplaceListing } from "@/types/marketplace";

// Fonction d'adaptation pour gérer les différentes structures de favoris
export const adaptFavoriteData = (data: any): MarketplaceFavorite => {
  return {
    id: data.id,
    item_id: data.item_id || data.listing_id, // Support des deux formats
    user_id: data.user_id || data.viewer_id // Support des deux formats
  };
};

// Fonction d'adaptation pour gérer les différentes structures de listings
export const adaptListingData = (data: any): MarketplaceListing => {
  return {
    id: data.id,
    title: data.title || '',
    description: data.description || '',
    price: data.price || 0,
    currency: data.currency || 'CAD',
    type: data.type || 'vente',
    status: data.status || 'active',
    seller_id: data.seller_id || '',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    images: data.images || [],
    seller: data.seller ? {
      id: data.seller.id || '',
      full_name: data.seller.full_name || '',
      avatar_url: data.seller.avatar_url || null,
      rating: data.seller.rating || 0
    } : undefined,
    location: data.location || '',
    category: data.category || '',
    views_count: data.views_count || 0,
    favorites_count: data.favorites_count || 0,
    featured: Boolean(data.featured),
    sale_type: data.sale_type || ''
  };
};

// Fonction d'adaptation pour les valeurs booléennes
export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1' || value === 'yes' || value === 'on';
  }
  if (typeof value === 'number') return value !== 0;
  return !!value;
}
