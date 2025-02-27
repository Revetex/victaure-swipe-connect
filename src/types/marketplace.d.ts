
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images?: string[];
  seller_id: string;
  seller?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    rating?: number;
  };
  status: string;
  type: 'vente' | 'location' | 'service';
  created_at: string;
  updated_at: string;
  location?: string;
  category?: string;
  views_count?: number;
  favorites_count?: number;
  featured?: boolean;
  sale_type?: string;
}

export interface MarketplaceFavorite {
  id?: string;
  item_id: string;
  user_id: string;
  created_at?: string;
}

export interface MarketplaceFilters {
  priceRange?: [number, number];
  categories?: string[];
  location?: string;
  sortBy?: 'date' | 'price' | 'rating' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface MarketplaceStats {
  total_listings: number;
  active_listings: number;
  total_sales: number;
  average_price: number;
  popular_categories: Array<{
    category: string;
    count: number;
  }>;
  recent_activity: {
    id: string;
    type: string;
    timestamp: string;
    details: any;
  }[];
  totalViews?: number;
  listingsByType?: Record<string, number>;
  totalListings: number;
  activeListings: number;
  averagePrice: number;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

export interface MarketplaceContract {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  status: string;
  creator_id: string;
  creator?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  location?: string;
  category?: string;
  requirements?: string[];
  documents?: string[];
  created_at: string;
  updated_at?: string;
  currency?: string;
}

export interface MarketplaceService {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  provider_id: string;
  provider?: {
    full_name: string | null;
    avatar_url: string | null;
    rating?: number;
  };
  category?: string;
  delivery_time?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget?: number;
  price?: number;
  delivery_time?: string;
  duration?: string;
  provider_id?: string;
  creator_id?: string;
  required_skills?: string[];
  status: string;
  created_at: string;
  updated_at?: string;
  location?: string;
  creator?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface GigBid {
  id: string;
  gig_id: string;
  bidder_id: string;
  amount: number;
  delivery_time: string;
  status: string;
  created_at: string;
}

export type MarketplaceOffer = MarketplaceListing;

export type ListingType = 'vente' | 'location' | 'service';

export interface ContractFormValues {
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  category?: string;
  location?: string;
  requirements?: string[];
  currency?: string;
}

// Corrigeons le contractFormSchema pour être compatible avec zod
export const contractFormSchema = {
  title: {
    required: "Le titre est requis",
    minLength: { value: 10, message: "Le titre doit faire au moins 10 caractères" }
  },
  description: {
    required: "La description est requise",
    minLength: { value: 50, message: "La description doit faire au moins 50 caractères" }
  }
};
