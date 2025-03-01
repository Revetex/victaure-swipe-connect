
import { MarketplaceFavorite, MarketplaceListing } from "@/types/marketplace";

/**
 * Adapts different favorite data structures to a consistent MarketplaceFavorite format
 * @param data The raw favorite data from API or database
 * @returns A formatted MarketplaceFavorite object
 */
export const adaptFavoriteData = (data: any): MarketplaceFavorite => {
  if (!data) {
    throw new Error('Cannot adapt null or undefined favorite data');
  }
  
  // Ensure we have a consistent structure regardless of the source
  return {
    id: data.id || '',
    item_id: data.item_id || data.listing_id || '', 
    user_id: data.user_id || data.viewer_id || '',
    viewer_id: data.viewer_id || data.user_id || '',
    listing_id: data.listing_id || data.item_id || ''
  };
};

/**
 * Transforms raw listing data into a structured MarketplaceListing object
 * @param data The raw listing data from API or database
 * @returns A formatted MarketplaceListing object
 */
export const adaptListingData = (data: any): MarketplaceListing => {
  if (!data) {
    throw new Error('Cannot adapt null or undefined listing data');
  }

  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    price: typeof data.price === 'number' ? data.price : 0,
    currency: data.currency || 'CAD',
    type: data.type || 'vente',
    status: data.status || 'active',
    seller_id: data.seller_id || '',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    images: Array.isArray(data.images) ? data.images : [],
    seller: data.seller ? {
      id: data.seller.id || '',
      full_name: data.seller.full_name || '',
      avatar_url: data.seller.avatar_url || null,
      rating: typeof data.seller.rating === 'number' ? data.seller.rating : 0
    } : undefined,
    location: data.location || '',
    category: data.category || '',
    views_count: typeof data.views_count === 'number' ? data.views_count : 0,
    favorites_count: typeof data.favorites_count === 'number' ? data.favorites_count : 0,
    featured: Boolean(data.featured),
    sale_type: data.sale_type || ''
  };
};

/**
 * Ensures a value is properly converted to boolean type
 * @param value Any value to convert to boolean
 * @returns Boolean representation of the input value
 */
export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

/**
 * Formats a price for display with currency
 * @param price The price number
 * @param currency The currency code
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(price);
}

/**
 * Converts a Date object to an ISO string for database operations
 * @param date Date object or string
 * @returns ISO string representation of the date
 */
export function ensureDateString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
}

/**
 * Safely converts various data types to a boolean value
 * For database compatibility with string booleans
 * @param value Value to convert to boolean
 * @returns Boolean representation
 */
export function convertToBoolean(value: string | boolean | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  
  return false;
}
