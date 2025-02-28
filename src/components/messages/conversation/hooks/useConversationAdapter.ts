
import { useState, useCallback } from "react";
import { Conversation } from "../types/conversation.types";
import { toast } from "sonner";

/**
 * Adaptateur pour le hook useConversations
 * Permet de gérer les différences d'interface
 */
export function useConversationAdapter() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Adaptateur pour compatibilité avec l'ancien format
  const isLoading = loading;
  const error = null;

  const selectConversation = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const archiveConversation = useCallback((id: string) => {
    toast.info(`Archivage de la conversation ${id} à venir`);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    toast.info(`Suppression de la conversation ${id} à venir`);
  }, []);

  // Fonction adaptée pour la compatibilité
  const handleDeleteConversation = async (conversationId: string, conversationPartnerId: string) => {
    deleteConversation(conversationId);
  };

  // Fonction adaptée pour la compatibilité
  const createConversation = async (participantId: string) => {
    toast.info(`Création d'une conversation avec ${participantId} à venir`);
    return null;
  };

  return {
    conversations,
    loading,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedId,
    selectConversation,
    archiveConversation,
    deleteConversation,
    // Compatible avec l'ancien format
    handleDeleteConversation,
    createConversation
  };
}
