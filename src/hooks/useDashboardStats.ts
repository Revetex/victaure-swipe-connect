import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardStats } from "@/types/dashboard";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [jobsResponse, messagesResponse] = await Promise.all([
        supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('employer_id', user.id)
          .eq('status', 'open'),
        supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('receiver_id', user.id)
          .eq('read', false),
      ]);

      const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .eq('employer_id', user.id)
        .eq('status', 'accepted');

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending')
        .in('match_id', matches?.map(match => match.id) || []);

      const pendingAmount = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        activeJobs: jobsResponse.count || 0,
        unreadMessages: messagesResponse.count || 0,
        pendingPayments: `CAD ${pendingAmount.toLocaleString()}`,
        nextJob: 'Dans 2 jours'
      };
    }
  });
}