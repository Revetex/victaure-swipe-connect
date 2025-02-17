
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceService } from '@/types/marketplace';

export function useServicesData() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          provider:provider_id(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(service => ({
        ...service,
        owner_id: service.provider_id,
        category: service.category_id,
      })) as MarketplaceService[];
    }
  });

  return {
    services,
    isLoading
  };
}
