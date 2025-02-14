
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSubscription } from '@/types/business';

export function useBusinessSubscription() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['businessSubscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_subscriptions')
        .select('*, subscription_products(*)')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as BusinessSubscription;
    }
  });

  return {
    subscription,
    isLoading
  };
}
