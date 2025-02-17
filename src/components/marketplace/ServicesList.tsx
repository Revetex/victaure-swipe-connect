
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketplaceService } from '@/types/marketplace';

export function ServicesList() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketplaceService[];
    }
  });

  const createBidMutation = useMutation({
    mutationFn: async ({ serviceId, amount }: { serviceId: string; amount: number }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('service_bids')
        .insert({
          service_id: serviceId,
          bidder_id: user.user.id,
          amount: amount,
          status: 'pending'
        });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {services.map((service) => (
        <div key={service.id}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <p>Prix: {service.price}</p>
        </div>
      ))}
    </div>
  );
}
