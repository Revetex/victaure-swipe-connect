
export interface MarketplaceService {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  category: string;
  tags?: string[];
}
