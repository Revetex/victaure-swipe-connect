
import type { Database } from "@/integrations/supabase/types";

// Types de base depuis la base de données Supabase
type DbMarketplaceJob = Database['public']['Tables']['marketplace_jobs']['Row'];
type DbJobCategory = Database['public']['Tables']['marketplace_job_categories']['Row'];
type DbMarketplaceCategory = Database['public']['Tables']['marketplace_categories']['Row'];

// Type étendu pour les emplois avec les relations complètes
export type MarketplaceJob = DbMarketplaceJob & {
  employer?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email?: string;
  } | null;
  category?: JobCategory | null;
};

// Type pour les catégories d'emploi avec méthodes additionnelles
export type JobCategory = DbJobCategory & {
  icon?: string;
  subcategories?: JobCategory[];
};

// Type pour les catégories du marketplace avec validation
export type MarketplaceCategory = DbMarketplaceCategory & {
  parent_id?: string | null;
  order?: number;
  icon?: string | null;
};

// Type pour les éléments du marketplace avec statut
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  status: string;  // Changed from union type to string to match DB
  seller_id: string;
  category_id: string | null;
  created_at: string;
  updated_at?: string;
  condition?: string;
  seller?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  category?: MarketplaceCategory | null;
}

// Type pour les services avec gestion des enchères
export interface MarketplaceService {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  current_price: number | null;
  images: string[] | null;
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  type: 'fixed_price' | 'auction';
  provider_id: string;
  category_id: string | null;
  created_at: string;
  updated_at?: string;
  auction_end_date: string | null;
  provider?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    rating?: number;
  };
  category?: MarketplaceCategory | null;
  bids?: { 
    count: number;
    highest?: number;
    last_bid_at?: string;
  }[];
}
