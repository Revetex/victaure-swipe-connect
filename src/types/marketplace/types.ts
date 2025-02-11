
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
