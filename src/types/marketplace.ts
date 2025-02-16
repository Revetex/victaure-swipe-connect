
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
