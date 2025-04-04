
import { create } from 'zustand';
import type { Receiver } from '@/types/messages';

interface ReceiverState {
  receiver: Receiver | null;
  showConversation: boolean;
  selectedConversationId: string | null;
  setReceiver: (receiver: Receiver | null) => void;
  setShowConversation: (show: boolean) => void;
  setSelectedConversationId: (id: string | null) => void;
}

export const useReceiver = create<ReceiverState>((set) => ({
  receiver: null,
  showConversation: false,
  selectedConversationId: null,
  setReceiver: (receiver) => {
    console.log('Setting receiver:', receiver);
    set({ receiver });
  },
  setShowConversation: (show) => {
    console.log('Setting showConversation:', show);
    set({ showConversation: show });
  },
  setSelectedConversationId: (id) => {
    console.log('Setting selectedConversationId:', id);
    set({ selectedConversationId: id });
  },
}));
