import { create } from 'zustand';
import { Receiver } from '@/types/messages';

interface ReceiverState {
  showConversation: boolean;
  receiver: Receiver | null;
  setShowConversation: (show: boolean) => void;
  setReceiver: (receiver: Receiver | null) => void;
}

export const useReceiver = create<ReceiverState>((set) => ({
  showConversation: false,
  receiver: null,
  setShowConversation: (show) => set({ showConversation: show }),
  setReceiver: (receiver) => set({ receiver }),
}));