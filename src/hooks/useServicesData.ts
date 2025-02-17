
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceService } from "@/types/marketplace";

export function useServicesData() {
  return useQuery({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      return data as MarketplaceService[];
    }
  });
}
