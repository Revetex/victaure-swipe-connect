
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
  sortBy?: 'date' | 'price';
  sortOrder?: 'asc' | 'desc';
}
