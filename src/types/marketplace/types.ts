
import type { Database } from "@/integrations/supabase/types";

// Définition des types de base
type Tables = Database['public']['Tables'];

// Type pour les éléments du marketplace
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  status: string;
  seller_id: string;
  created_at: string;
  seller?: {
    full_name: string;
    avatar_url: string | null;
  };
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
  created_at: string;
  auction_end_date: string | null;
  provider?: {
    full_name: string;
    avatar_url: string | null;
  };
  bids?: { count: number }[];
}

// Type pour les emplois
export interface MarketplaceJob {
  id: string;
  title: string;
  description: string | null;
  company_name: string | null;
  company_logo: string | null;
  location: string;
  remote_type: 'on-site' | 'hybrid' | 'remote';
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: 'hourly' | 'monthly' | 'yearly';
  contract_type: string;
  experience_level: string;
  status: string;
  category_id: string | null;
  category_name?: string;
  created_at: string;
  employer_id: string;
  employer?: {
    full_name: string;
    avatar_url: string | null;
  };
}

// Type pour les catégories d'emploi
export interface JobCategory {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  created_at: string;
}

