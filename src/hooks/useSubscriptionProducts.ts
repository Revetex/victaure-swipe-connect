
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionProduct } from '@/types/business';

export function useSubscriptionProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['subscriptionProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_products')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data as SubscriptionProduct[];
    }
  });

  return {
    products,
    isLoading
  };
}
