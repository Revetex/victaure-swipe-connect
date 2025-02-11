
import type { Database } from "@/integrations/supabase/types";

// Types de base depuis la base de données Supabase
export type DbMarketplaceItem = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  status: string;
  seller_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  condition: string | null;
  views_count: number | null;
  favorites_count: number | null;
  location: any | null;
  metadata: any | null;
  searchable_text?: any;
};

export type DbMarketplaceCategory = {
  id: string;
  name: string;
  type: string;
  created_at: string;
};

// Type pour les catégories du marketplace avec validation
export type MarketplaceCategory = DbMarketplaceCategory & {
  parent_id?: string | null;
  order?: number;
  icon?: string | null;
};

// Type pour les articles avec les relations complètes
export type MarketplaceItem = DbMarketplaceItem & {
  seller?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email?: string;
  } | null;
  category?: MarketplaceCategory | null;
};

// Type pour les catégories d'emploi
export type JobCategory = {
  id: string;
  name: string;
  parent_id: string | null;
  icon: string | null;
  description: string | null;
  created_at: string;
  subcategories?: JobCategory[];
};

// Type pour les emplois du marketplace
export type MarketplaceJob = {
  id: string;
  title: string;
  description: string | null;
  company_name: string | null;
  company_logo: string | null;
  location: string;
  remote_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: string;
  contract_type: string;
  experience_level: string;
  status: string;
  category_id: string | null;
  employer_id: string;
  created_at: string;
  updated_at: string;
  employer?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email?: string;
  } | null;
  category?: JobCategory | null;
};

export type MarketplaceService = {
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
  updated_at: string;
  auction_end_date: string | null;
  provider?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    rating?: number;
  } | null;
  category?: MarketplaceCategory | null;
  bids?: {
    count: number;
    highest?: number;
    last_bid_at?: string;
  }[];
};
