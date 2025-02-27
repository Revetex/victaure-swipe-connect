
import { useEffect, useState } from "react";
import { MarketplaceList } from "./marketplace/MarketplaceList";
import type { MarketplaceFilters } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomMarketplaceListProps {
  type: "all" | "vente" | "location" | "service";
  searchQuery: string;
  filters: MarketplaceFilters;
  page: number;
  onPageChange: (page: number) => void;
}

export function CustomMarketplaceList({ 
  type, 
  searchQuery, 
  filters,
  page,
  onPageChange 
}: CustomMarketplaceListProps) {
  const [isDataReady, setIsDataReady] = useState(false);

  // Cette fonction prétraite les données et assure que les tables requises existent
  useEffect(() => {
    const prepareData = async () => {
      try {
        // Vérifier si certaines tables existent pour éviter les erreurs
        console.log("Préparation des données du marketplace...");

        // On vérifie directement si on peut accéder aux données
        const { data: testData, error: testError } = await supabase
          .from('marketplace_listings')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error("Erreur lors de l'accès aux données du marketplace:", testError);
        } else {
          console.log("Accès aux données du marketplace réussi");
        }

        setIsDataReady(true);
      } catch (error) {
        console.error("Erreur lors de la préparation des données:", error);
        // En cas d'erreur, on indique quand même que les données sont prêtes
        // pour laisser le composant original gérer ses propres erreurs
        setIsDataReady(true);
      }
    };

    prepareData();
  }, []);

  // Hook personnalisé pour traiter les vues d'annonces
  useEffect(() => {
    const handleViewListing = (event: CustomEvent) => {
      try {
        if (event.detail && event.detail.listingId) {
          // Incrémenter le compteur de vues directement
          supabase
            .from('marketplace_listings')
            .update({ 
              views_count: (listing => (listing.views_count || 0) + 1) 
            })
            .eq('id', event.detail.listingId)
            .then(({ error }) => {
              if (error) {
                console.error('Erreur lors de l\'incrémentation des vues:', error);
              }
            });
        }
      } catch (error) {
        console.error('Erreur lors du traitement des vues:', error);
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('marketplace-view-listing' as any, handleViewListing as EventListener);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('marketplace-view-listing' as any, handleViewListing as EventListener);
    };
  }, []);

  // Si les données ne sont pas prêtes, afficher un état de chargement
  if (!isDataReady) {
    return <div className="py-12 text-center">Chargement des annonces...</div>;
  }

  // Sinon, rendre le composant original
  return (
    <MarketplaceList
      type={type}
      searchQuery={searchQuery}
      filters={filters}
      page={page}
      onPageChange={onPageChange}
    />
  );
}
