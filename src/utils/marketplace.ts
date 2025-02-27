
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
    title: data.title,
    description: data.description || '',
    price: data.price,
    currency: data.currency,
    type: data.type,
    status: data.status,
    seller_id: data.seller_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    images: data.images || [],
    seller: data.seller ? {
      id: data.seller.id,
      full_name: data.seller.full_name || '',
      avatar_url: data.seller.avatar_url || null,
      rating: data.seller.rating
    } : undefined,
    location: data.location,
    category: data.category,
    views_count: data.views_count,
    favorites_count: data.favorites_count,
    featured: data.featured,
    sale_type: data.sale_type
  };
};
