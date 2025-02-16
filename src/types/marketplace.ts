
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

export interface Gig {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  location: string | null;
  duration: string | null;
  required_skills: string[];
  status: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface GigBid {
  id: string;
  gig_id: string;
  bidder_id: string;
  amount: number;
  proposal: string | null;
  status: string;
  created_at: string;
  bidder?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface MarketplaceService {
  id: string;
  title: string;
  description: string;
  price: number;
  current_price: number;
  images: string[];
  status: string;
  type: string;
  provider_id: string;
  category_id: string;
  auction_end_date: string;
  created_at: string;
  updated_at: string;
  currency: string;
  provider?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  bids?: ServiceBid[];
}

export interface ServiceBid {
  id: string;
  service_id: string;
  bidder_id: string;
  amount: number;
  status: string;
  created_at: string;
  bidder?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}
