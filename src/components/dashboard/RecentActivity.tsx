import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Briefcase, Bell } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
interface Activity {
  id: string;
  type: 'message' | 'match' | 'notification';
  title: string;
  description: string;
  created_at: string;
}
interface MessageSender {
  full_name: string;
}
interface JobMatch {
  professional: {
    full_name: string;
  };
  job: {
    title: string;
  };
}
const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    x: -20
  },
  show: {
    opacity: 1,
    x: 0
  }
};
export function RecentActivity() {
  const {
    data: activities,
    isLoading
  } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch recent messages
      const {
        data: messages
      } = await supabase.from('messages').select(`
          id,
          content,
          created_at,
          sender:profiles!messages_sender_id_fkey(full_name)
        `).eq('receiver_id', user.id).order('created_at', {
        ascending: false
      }).limit(5);

      // Fetch recent matches
      const {
        data: matches
      } = await supabase.from('matches').select(`
          id,
          created_at,
          job:jobs(title),
          professional:profiles!matches_professional_id_fkey(full_name)
        `).eq('employer_id', user.id).order('created_at', {
        ascending: false
      }).limit(5);

      // Fetch recent notifications
      const {
        data: notifications
      } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(5);

      // Combine and format activities
      const formattedActivities: Activity[] = [...(messages?.map(msg => ({
        id: msg.id,
        type: 'message' as const,
        title: 'Nouveau message',
        description: `${(msg.sender as MessageSender).full_name} vous a envoyé un message`,
        created_at: msg.created_at
      })) || []), ...(matches?.map(match => ({
        id: match.id,
        type: 'match' as const,
        title: 'Nouveau match',
        description: `${(match as unknown as JobMatch).professional.full_name} a postulé pour "${(match as unknown as JobMatch).job.title}"`,
        created_at: match.created_at
      })) || []), ...(notifications?.map(notif => ({
        id: notif.id,
        type: 'notification' as const,
        title: notif.title,
        description: notif.message,
        created_at: notif.created_at
      })) || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      return formattedActivities;
    }
  });
  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
        <h3 className="text-lg font-semibold">Activité récente</h3>
        {[...Array(5)].map((_, i) => <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>)}
      </div>;
  }
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'match':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'notification':
        return <Bell className="h-5 w-5 text-yellow-500" />;
    }
  };
  return <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h3>
      
    </div>;
}