
import { useConversations } from "./useConversations";
import { useState, useCallback } from "react";
import { Conversation } from "../types/conversation.types";
import { toast } from "sonner";

/**
 * Adaptateur pour le hook useConversations
 * Permet de gérer les différences d'interface
 */
export function useConversationAdapter() {
  const { conversations, isLoading, error, searchQuery, setSearchQuery } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectConversation = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const archiveConversation = useCallback((id: string) => {
    toast.info(`Archivage de la conversation ${id} à venir`);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    toast.info(`Suppression de la conversation ${id} à venir`);
  }, []);

  return {
    conversations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedId,
    selectConversation,
    archiveConversation,
    deleteConversation
  };
}
