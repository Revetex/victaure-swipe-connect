
export type ListingType = 'vente' | 'location' | 'service';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'expired' | 'deleted';
export type ListingCondition = 'new' | 'like_new' | 'good' | 'used' | 'refurbished';
export type SaleType = 'immediate' | 'auction' | 'negotiable';

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: ListingType;
  status: ListingStatus | string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  location?: string;
  condition?: ListingCondition;
  category?: string;
  views_count?: number;
  favorites_count?: number;
  featured?: boolean;
  sale_type?: SaleType;
  auction_end_date?: string;
  minimum_bid?: number;
  latitude?: number;
  longitude?: number;
  searchable_text?: any;
  seller?: {
    full_name: string | null;
    avatar_url: string | null;
    rating?: number;
  };
}

export interface MarketplaceFilters {
  categories?: string[];
  priceRange?: [number, number];
  condition?: ListingCondition[];
  location?: string;
  radius?: number;
  sortBy: 'date' | 'price' | 'rating' | 'views';
  sortOrder: 'asc' | 'desc';
  featured?: boolean;
  saleType?: SaleType[];
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  type: string;
  parent_id?: string;
  icon?: string;
}

export interface MarketplaceFavorite {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
}

export interface MarketplaceQuestion {
  id: string;
  listing_id: string;
  user_id: string;
  question: string;
  answer?: string;
  is_public: boolean;
  created_at: string;
  answered_at?: string;
}

export interface MarketplaceRating {
  id: string;
  seller_id: string;
  buyer_id: string;
  listing_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
