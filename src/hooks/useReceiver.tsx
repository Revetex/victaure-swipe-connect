
import { useState, useContext, createContext, ReactNode } from 'react';
import { Receiver } from '@/types/messages';

interface ReceiverContextType {
  receiver: Receiver | null;
  setReceiver: (receiver: Receiver | null) => void;
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
}

const ReceiverContext = createContext<ReceiverContextType>({
  receiver: null,
  setReceiver: () => {},
  showConversation: false,
  setShowConversation: () => {},
});

export function ReceiverProvider({ children }: { children: ReactNode }) {
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  // Lorsqu'un destinataire est défini, montrer automatiquement la conversation
  const handleSetReceiver = (newReceiver: Receiver | null) => {
    setReceiver(newReceiver);
    if (newReceiver) {
      setShowConversation(true);
    }
  };

  return (
    <ReceiverContext.Provider
      value={{
        receiver,
        setReceiver: handleSetReceiver,
        showConversation,
        setShowConversation,
      }}
    >
      {children}
    </ReceiverContext.Provider>
  );
}

export function useReceiver() {
  return useContext(ReceiverContext);
}
