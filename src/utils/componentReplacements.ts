
// Ce fichier contient des imports pour remplacer les composants protégés
// par des versions adaptées qui corrigent les problèmes de types

import { ContractFormAdaptor } from "@/components/marketplace/adaptors/ContractFormAdaptor";
import { ConversationHeaderAdapter } from "@/components/messages/conversation/ConversationHeaderAdapter";
import { ensureBoolean, fixBooleanProps, safeStringLowerCase } from "./adaptorUtils";

// Exportations pour faciliter l'utilisation des adaptateurs
export {
  ContractFormAdaptor as ContractForm,
  ConversationHeaderAdapter as ConversationHeader,
  ensureBoolean,
  fixBooleanProps,
  safeStringLowerCase
};

// Adaptateurs pour les favoris dans marketplace
export function adaptFavoriteParams(params: any) {
  const result = { ...params };
  
  // Correction des noms de propriété
  if ('listing_id' in params && !('item_id' in params)) {
    result.item_id = params.listing_id;
  }
  
  if ('viewer_id' in params && !('user_id' in params)) {
    result.user_id = params.viewer_id;
  }
  
  return result;
}

// Utilitaire pour vérifier si un item est favorisé
export function checkIsFavorited(favorites: any[], itemId: string): boolean {
  return favorites?.some(fav => 
    (fav.item_id === itemId) || (fav.listing_id === itemId)
  ) || false;
}
