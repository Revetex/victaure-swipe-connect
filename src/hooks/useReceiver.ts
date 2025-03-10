
import { useState } from 'react';
import { Receiver } from '@/types/messages';

/**
 * Hook personnalisé pour gérer l'état du destinataire dans les conversations
 * Fournit des fonctionnalités pour sélectionner et afficher les conversations
 */
export function useReceiver() {
  // État du destinataire actuel
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  
  // État pour contrôler l'affichage de la conversation
  const [showConversation, setShowConversation] = useState(false);
  
  // ID de la conversation sélectionnée
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

  return {
    // États
    receiver,
    showConversation,
    selectedConversationId,
    
    // Setters
    setReceiver,
    setShowConversation,
    setSelectedConversationId,
    
    // Fonctions utilitaires
    resetState,
    startNewConversation
  };
}

// We need to re-export the Receiver type so components importing from this file can use it
export type { Receiver } from '@/types/messages';
