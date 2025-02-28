
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
        // Simple check if we can access the listings table
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Erreur lors de l'accès aux données du marketplace:", error);
          toast.error("Erreur lors du chargement des données du marketplace");
        } else {
          console.log("Accès aux données du marketplace réussi");
          setIsDataReady(true);
        }
      } catch (error) {
        console.error("Erreur lors de la préparation des données:", error);
        // En cas d'erreur, on indique quand même que les données sont prêtes
        // pour laisser le composant original gérer ses propres erreurs
        setIsDataReady(true);
      }
    };

    prepareData();
  }, []);

  // Hook personnalisé pour traiter les vues de marketplaceList
  useEffect(() => {
    const handleViewListing = (event: CustomEvent) => {
      try {
        if (event.detail && event.detail.listingId) {
          const listingId = event.detail.listingId;
          
          // Notification de visualisation (implémentation simplifiée)
          const viewEvent = new CustomEvent('marketplace-item-viewed', {
            detail: { listingId, timestamp: new Date().toISOString() }
          });
          window.dispatchEvent(viewEvent);
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
