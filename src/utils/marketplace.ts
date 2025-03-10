
import { ExtendedMarketplaceListing, MarketplaceListing } from "@/types/marketplace";

/**
 * Adapts a listing response from Supabase to match the MarketplaceListing type
 */
export function adaptListingData(listing: any): MarketplaceListing {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description || '',
    price: Number(listing.price),
    currency: listing.currency || 'CAD',
    type: listing.type,
    status: listing.status || 'active',
    seller_id: listing.seller_id,
    created_at: listing.created_at,
    updated_at: listing.updated_at || listing.created_at,
    images: listing.images || [],
    seller: listing.seller ? {
      id: listing.seller.id,
      full_name: listing.seller.full_name || 'Unknown',
      avatar_url: listing.seller.avatar_url,
      rating: Number(listing.seller.rating || 0)
    } : undefined,
    location: listing.location,
    category: listing.category,
    views_count: Number(listing.views_count || 0),
    favorites_count: Number(listing.favorites_count || 0),
    featured: Boolean(listing.featured),
    sale_type: listing.sale_type
  };
}

/**
 * Converts any type of boolean representation to a proper boolean
 */
export function convertToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'online';
  }
  if (typeof value === 'number') return value > 0;
  return !!value;
}
