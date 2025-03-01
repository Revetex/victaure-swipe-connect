
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
