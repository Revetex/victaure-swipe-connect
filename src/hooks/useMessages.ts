import { useQuery, useMutation } from '@tanstack/react-query';
import { Message } from '@/types/chat/messageTypes';
import { supabase } from '@/integrations/supabase/client';

export function useMessages() {
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      return data as Message[];
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      return data;
    }
  });

  return { messages, markAsRead };
}