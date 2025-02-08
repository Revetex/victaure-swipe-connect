
import { create } from 'zustand';
import { Message } from '@/types/messages';
import { createStore } from 'zustand/vanilla';

interface MessagesState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
}

const store = createStore<MessagesState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (updatedMessage) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === updatedMessage.id ? updatedMessage : msg
    )
  })),
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId)
  })),
}));

export const useMessagesStore = create<MessagesState>()((...args) => ({
  ...store((...args))
}));
