
export interface MarketplaceFavorite {
  id: string;
  item_id: string;
  user_id: string;
  viewer_id?: string;
  listing_id?: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type: 'vente' | 'location' | 'service';
  status: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  images: string[];
  seller?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    rating: number;
  };
  location?: string;
  category?: string;
  views_count?: number;
  favorites_count?: number;
  featured?: boolean;
  sale_type?: string;
}

// Add alias type for backward compatibility
export type ExtendedMarketplaceListing = MarketplaceListing;

export interface ContractFormValues {
  title: string;
  description?: string;
  location?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: Date;
  currency?: string;
  requirements?: string[];
}

// Adding marketplace filters interface
export interface MarketplaceFilters {
  priceRange: [number, number];
  categories?: string[];
  sortBy: 'price' | 'date' | 'rating' | 'views';
  sortOrder: 'asc' | 'desc';
  location?: string;
}

// Adding listing type
export type ListingType = 'vente' | 'location' | 'service';

// Adding marketplace contract interface
export interface MarketplaceContract {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string | Date;
  status: string;
  location?: string;
  currency: string;
  category?: string;
  requirements: string[];
  documents?: string[];
  created_at: string;
  updated_at?: string;
  creator_id: string;
  creator?: {
    full_name: string | null;
    avatar_url: string | null;
    id?: string;
  };
}

// Adding marketplace service interface
export interface MarketplaceService {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  provider_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
  provider?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    rating: number;
  };
  // Database compatibility fields
  owner_id?: string;
  category_id?: string;
  current_price?: number;
  auction_end_date?: string;
}

// Type aliases for compatibility with existing code
export type MarketplaceStats = any;
export type MarketplaceFavoriteInput = {
  user_id: string;
  item_id: string;
  listing_id?: string;
  viewer_id?: string;
}

export type MarketplaceFavoriteExtended = MarketplaceFavorite;
export type MarketplaceOffer = any;
export type Gig = any;

// Simple contract form schema for validation
export const contractFormSchema = {
  title: { required: 'Title is required' },
  description: { required: 'Description is required' },
  budget_min: { required: 'Minimum budget is required' },
  budget_max: { required: 'Maximum budget is required' }
};
