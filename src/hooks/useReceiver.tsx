
import { useState, useContext, createContext, ReactNode } from 'react';
import { Receiver } from '@/types/messages';
import { convertToBoolean } from '@/utils/marketplace';

interface ReceiverContextType {
  receiver: Receiver | null;
  setReceiver: (receiver: Receiver | null) => void;
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  resetState: () => void;
  startNewConversation: (newReceiver: Receiver) => void;
}

const ReceiverContext = createContext<ReceiverContextType>({
  receiver: null,
  setReceiver: () => {},
  showConversation: false,
  setShowConversation: () => {},
  selectedConversationId: null,
  setSelectedConversationId: () => {},
  resetState: () => {},
  startNewConversation: () => {}
});

export function ReceiverProvider({ children }: { children: ReactNode }) {
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Fonction pour réinitialiser tous les états
  const resetState = () => {
    setReceiver(null);
    setShowConversation(false);
    setSelectedConversationId(null);
  };

  // Fonction pour initialiser une nouvelle conversation
  const startNewConversation = (newReceiver: Receiver) => {
    // Assurer que online_status est un boolean
    const receiverWithBooleanStatus: Receiver = {
      ...newReceiver,
      online_status: typeof newReceiver.online_status === 'string' 
        ? newReceiver.online_status === 'online' || newReceiver.online_status === 'true'
        : !!newReceiver.online_status
    };
    
    setReceiver(receiverWithBooleanStatus);
    setShowConversation(true);
    setSelectedConversationId(null); // Réinitialise l'ID car c'est une nouvelle conversation
  };

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
        selectedConversationId,
        setSelectedConversationId,
        resetState,
        startNewConversation
      }}
    >
      {children}
    </ReceiverContext.Provider>
  );
}

export function useReceiver() {
  return useContext(ReceiverContext);
}
