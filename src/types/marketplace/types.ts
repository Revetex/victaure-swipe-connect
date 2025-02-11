
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

// Type pour les catégories
export interface MarketplaceCategory {
  id: string;
  name: string;
  type: string;
  created_at: string;
}
