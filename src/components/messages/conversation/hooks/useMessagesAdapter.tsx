import { useMessages } from "./useMessages";
import { Receiver } from "@/types/messages";

/**
 * Adaptateur pour le hook useMessages
 * Permet de l'utiliser avec d'autres interfaces
 */
export function useMessagesAdapter(receiver: Receiver | null) {
  const messagesHook = useMessages(receiver);

  return {
    ...messagesHook,
    // Ajouter ici des transformations ou adaptations si nécessaire
  };
}
