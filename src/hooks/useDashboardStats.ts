import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardStats } from "@/types/dashboard";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Store responses in variables to avoid reading the stream multiple times
      const jobsResponse = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('employer_id', user.id)
        .eq('status', 'open');

      const messagesResponse = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('receiver_id', user.id)
        .eq('read', false);

      const matchesResponse = await supabase
        .from('matches')
        .select('id')
        .eq('employer_id', user.id)
        .eq('status', 'accepted')
        .maybeSingle();

      let pendingAmount = 0;
      if (matchesResponse.data?.id) {
        const paymentsResponse = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'pending')
          .eq('match_id', matchesResponse.data.id)
          .maybeSingle();
          
        pendingAmount = paymentsResponse.data?.amount || 0;
      }

      return {
        activeJobs: jobsResponse.count || 0,
        unreadMessages: messagesResponse.count || 0,
        pendingPayments: `CAD ${pendingAmount.toLocaleString()}`,
        nextJob: 'Dans 2 jours'
      };
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}