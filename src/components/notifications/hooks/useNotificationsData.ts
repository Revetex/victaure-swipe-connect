
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';
import React from 'react';

export const useNotificationsData = () => {
  const queryClient = useQueryClient();

  // Query for fetching notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    }
  });

  // Subscribe to realtime changes
  const setupSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Setup subscription on mount
  React.useEffect(() => {
    const unsubscribe = setupSubscription();
    return () => {
      unsubscribe.then(cleanup => cleanup?.());
    };
  }, []);

  // Delete notification mutation
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => 
        old?.filter(n => n.id !== id) ?? []
      );
      toast.success("Notification supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  // Mark all as read mutation
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) =>
        old?.map(n => ({ ...n, read: true })) ?? []
      );
      toast.success("Toutes les notifications ont été marquées comme lues");
    },
    onError: () => {
      toast.error("Une erreur est survenue");
    }
  });

  // Delete all notifications mutation
  const { mutate: deleteAllNotifications } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], []);
      toast.success("Toutes les notifications ont été supprimées");
    },
    onError: () => {
      toast.error("Une erreur est survenue");
    }
  });

  return {
    notifications,
    isLoading,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications
  };
};
