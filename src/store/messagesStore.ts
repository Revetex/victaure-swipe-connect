
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messages';

interface MessagesState {
  conversations: { [key: string]: Message[] };
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  loadConversation: (conversationId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: {},
  activeConversationId: null,

  setActiveConversation: (id: string) => {
    set({ activeConversationId: id });
    if (!get().conversations[id]) {
      get().loadConversation(id);
    }
  },

  addMessage: (conversationId: string, message: Message) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [conversationId]: [
          ...(state.conversations[conversationId] || []),
          message,
        ],
      },
    }));
  },

  loadConversation: async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set((state) => ({
        conversations: {
          ...state.conversations,
          [conversationId]: data || [],
        },
      }));
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  },
}));
