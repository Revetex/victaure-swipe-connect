
import { create } from 'zustand';
import type { Receiver } from '@/types/messages';

interface ReceiverState {
  receiver: Receiver | null;
  showConversation: boolean;
  setReceiver: (receiver: Receiver | null) => void;
  setShowConversation: (show: boolean) => void;
}

export const useReceiver = create<ReceiverState>((set) => ({
  receiver: null,
  showConversation: false,
  setReceiver: (receiver) => set({ receiver }),
  setShowConversation: (show) => set({ showConversation: show }),
}));
