
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: 'vente' | 'location' | 'service';
  status: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  images: string[];
  seller?: {
    full_name: string | null;
    avatar_url: string | null;
    rating?: number;
  };
}

export interface MarketplaceOffer {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  bidder?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}
