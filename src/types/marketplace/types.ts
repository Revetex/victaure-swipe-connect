
import type { Database } from "@/integrations/supabase/types";

// Types de base depuis la base de données
type DbMarketplaceJob = Database['public']['Tables']['marketplace_jobs']['Row'];
type DbJobCategory = Database['public']['Tables']['marketplace_job_categories']['Row'];

// Type étendu pour les emplois avec les relations
export type MarketplaceJob = DbMarketplaceJob & {
  employer?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  category?: JobCategory | null;
};

// Type pour les catégories d'emploi
export type JobCategory = DbJobCategory;

// Type pour les catégories du marketplace
export interface MarketplaceCategory {
  id: string;
  name: string;
  type: string;
  created_at: string;
}

// Type pour les éléments du marketplace
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  status: string;
  seller_id: string;
  category_id: string | null;
  created_at: string;
  seller?: {
    full_name: string;
    avatar_url: string | null;
  };
  category?: MarketplaceCategory | null;
}

// Type pour les services
export interface MarketplaceService {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  current_price: number | null;
  images: string[] | null;
  status: string;
  type: 'fixed_price' | 'auction';
  provider_id: string;
  category_id: string | null;
  created_at: string;
  auction_end_date: string | null;
  provider?: {
    full_name: string;
    avatar_url: string | null;
  };
  category?: MarketplaceCategory | null;
  bids?: { count: number }[];
}
