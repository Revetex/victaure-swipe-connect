
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MarketplaceService } from '@/types/marketplace';

export function useServicesData() {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('marketplace_services')
          .select(`
            *,
            provider:profiles(id, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Properly map the database fields to MarketplaceService type
          const mappedServices = data.map(item => {
            // Create a valid provider object with id and rating
            const provider = item.provider ? {
              id: item.provider_id || '',
              full_name: item.provider.full_name || 'Unknown',
              avatar_url: item.provider.avatar_url || null,
              rating: 5 // Default rating if not provided
            } : undefined;
            
            // Map database fields to interface
            return {
              id: item.id,
              title: item.title,
              description: item.description || '',
              price: item.price || item.current_price || 0,
              currency: item.currency || 'CAD',
              provider_id: item.provider_id,
              created_at: item.created_at,
              updated_at: item.updated_at || item.created_at,
              owner_id: item.provider_id, // Map provider_id to owner_id for compatibility
              category: item.category_id, // Map category_id to category for compatibility
              category_id: item.category_id,
              current_price: item.current_price,
              auction_end_date: item.auction_end_date,
              images: item.images || [],
              status: item.status,
              type: item.type,
              provider
            } as MarketplaceService;
          });
          
          setServices(mappedServices);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
        toast.error('Error loading services');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  return { services, loading, error };
}
