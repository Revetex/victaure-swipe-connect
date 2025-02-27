
export interface MarketplaceListing {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];
  seller_id: string;
  seller?: {
    id: string;
    full_name: string | null;
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

export interface MarketplaceStats {
  total_listings: number;
  active_listings: number;
  total_sales: number;
  average_price: number;
  popular_categories: string[];
  recent_activity: {
    id: string;
    type: string;
    timestamp: string;
    details: any;
  }[];
}

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
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: string;
  provider_id: string;
  status: string;
  created_at: string;
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

// Re-export pour la compatibilité
export type MarketplaceOffer = MarketplaceListing;

// Schéma de validation pour le formulaire de contrat
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
