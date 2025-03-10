
// Import statements
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceService } from '@/types/marketplace';
import { toast } from 'sonner';

export function useServicesData() {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('marketplace_services')
          .select(`
            *,
            provider:profiles(id, full_name, avatar_url, rating)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Safely convert to MarketplaceService type
        const formattedServices = data?.map(service => {
          // Ensure provider object has all required fields
          const provider = service.provider ? {
            id: service.provider.id || service.provider_id || '',
            full_name: service.provider.full_name || 'Unknown',
            avatar_url: service.provider.avatar_url,
            rating: Number(service.provider.rating || 0)
          } : undefined;

          return {
            id: service.id,
            title: service.title,
            description: service.description || '',
            price: Number(service.price || service.current_price || 0),
            currency: service.currency || 'CAD',
            provider_id: service.provider_id,
            category: service.category,
            created_at: service.created_at,
            updated_at: service.updated_at,
            provider,
            // Include compatibility fields
            owner_id: service.owner_id,
            category_id: service.category_id,
            current_price: Number(service.current_price || 0),
            auction_end_date: service.auction_end_date,
            images: service.images || [],
            status: service.status || 'active',
            type: service.type || 'service'
          } as MarketplaceService;
        }) || [];

        setServices(formattedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast.error('Erreur lors du chargement des services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
  };
}
