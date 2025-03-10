
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
    return value.toLowerCase() === 'true' || 
           value.toLowerCase() === 'online' || 
           value.toLowerCase() === 'yes' || 
           value.toLowerCase() === '1';
  }
  if (typeof value === 'number') return value > 0;
  return !!value;
}

/**
 * Safe string lowercase conversion with type checking
 */
export function safeToLowerCase(value: any): string {
  if (typeof value === 'string') return value.toLowerCase();
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
}

/**
 * Safely converts a value to a number with fallback
 */
export function safeToNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  return fallback;
}

/**
 * Safely ensure a value is one of the allowed string literals
 */
export function ensureStringLiteral<T extends string>(
  value: any, 
  allowedValues: readonly T[], 
  defaultValue: T
): T {
  if (typeof value === 'string' && allowedValues.includes(value as T)) {
    return value as T;
  }
  return defaultValue;
}

/**
 * Safely formats a date to ISO string or converts it to string
 */
export function formatDateToSafeString(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return String(value);
}

/**
 * Type-safe way to add friends/connections to a Receiver object
 */
export function addFriendsToReceiver(receiver: any, friends: any[]): any {
  if (!receiver) return receiver;
  
  // Create a new object with the friends property
  return {
    ...receiver,
    friends: Array.isArray(friends) ? friends : []
  };
}
