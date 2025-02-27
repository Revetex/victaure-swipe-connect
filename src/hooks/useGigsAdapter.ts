
import { useGigs as useOriginalGigs } from './useGigs';
import { Gig } from '@/types/marketplace';

/**
 * Adaptateur pour useGigs qui renvoie loading au lieu de isLoading
 */
export function useGigsAdapter() {
  const { gigs, loading, error } = useOriginalGigs();
  
  // Cette fonction renvoie loading au lieu de isLoading pour être compatible
  // avec le code qui attend isLoading
  return {
    gigs,
    isLoading: loading, // Convertit loading en isLoading
    error
  };
}

// Exportons aussi une version qui renvoie directement la bonne propriété
export { useOriginalGigs as useGigs };
