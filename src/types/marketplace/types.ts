
import type { Database } from "@/integrations/supabase/types";

// Déclaration pour étendre les types de Supabase
declare module '@/integrations/supabase/types' {
  export interface Database {
    public: {
      Tables: {
        marketplace_jobs: {
          Row: MarketplaceJob;
          Insert: Omit<MarketplaceJob, 'id' | 'created_at' | 'updated_at' | 'employer' | 'category'>;
          Update: Partial<Omit<MarketplaceJob, 'id' | 'created_at' | 'updated_at' | 'employer' | 'category'>>;
        };
        marketplace_job_categories: {
          Row: JobCategory;
          Insert: Omit<JobCategory, 'id' | 'created_at'>;
          Update: Partial<Omit<JobCategory, 'id' | 'created_at'>>;
        };
      };
    };
  }
}

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
  employer_id: string;
  created_at: string;
  updated_at: string;
  employer?: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  category?: JobCategory | null;
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
