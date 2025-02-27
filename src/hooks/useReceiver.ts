
import { useState } from 'react';

// Définition complète de l'interface Receiver pour éviter les dépendances externes
export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string | null;
  online_status?: 'online' | 'offline';
  last_seen?: string | null;
  latitude?: number;
  longitude?: number;
  // Champs additionnels pour améliorer la fonctionnalité
  bio?: string | null;
  phone?: string | null;
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
}

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
    setReceiver(newReceiver);
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
