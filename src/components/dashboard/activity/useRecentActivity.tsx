import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "./types";

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch recent messages
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:profiles!messages_sender_id_fkey (
            id,
            full_name
          )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent matches
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          job:jobs (
            id,
            title
          ),
          professional:profiles!matches_professional_id_fkey (
            id,
            full_name
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent notifications
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Transform and combine activities
      const formattedActivities: Activity[] = [
        ...(messages?.map((msg: any) => ({
          id: msg.id,
          type: 'message' as const,
          title: 'Nouveau message',
          description: `${msg.sender?.full_name || 'Utilisateur'} vous a envoyé un message`,
          created_at: msg.created_at
        })) || []),
        ...(matches?.map((match: any) => ({
          id: match.id,
          type: 'match' as const,
          title: 'Nouveau match',
          description: `${match.professional?.full_name || 'Un professionnel'} a postulé pour "${match.job?.title || 'une offre'}"`,
          created_at: match.created_at
        })) || []),
        ...(notifications?.map(notif => ({
          id: notif.id,
          type: 'notification' as const,
          title: notif.title,
          description: notif.message,
          created_at: notif.created_at
        })) || [])
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10);

      return formattedActivities;
    }
  });
}