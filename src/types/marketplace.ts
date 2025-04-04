
import { z } from "zod";

export const contractFormSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  budget_min: z.number().nullable(),
  budget_max: z.number().nullable(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  currency: z.string().default("CAD"),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;

export type ListingType = 'vente' | 'location' | 'service';

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: ListingType;
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

export interface MarketplaceFilters {
  priceRange: [number, number];
  categories: string[];
  location?: string;
  condition?: string;
  rating?: number;
  sortBy: 'price' | 'date' | 'rating' | 'views';
  sortOrder: 'asc' | 'desc';
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  averagePrice: number;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
  listingsByType: {
    vente: number;
    location: number;
    service: number;
  };
  recentActivity: Array<{
    type: 'view' | 'offer' | 'sale';
    listingId: string;
    timestamp: string;
  }>;
}

export interface MarketplaceContract {
  id: string;
  title: string;
  description: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  status: string;
  location: string | null;
  currency: string;
  category: string | null;
  requirements: string[] | null;
  documents: string[] | null;
  created_at: string;
  updated_at: string | null;
  creator_id: string;
  creator?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}
