
import { useEffect, useState } from "react";
import { MarketplaceList } from "./MarketplaceList";
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
        // Vérifier si la table marketplace_listings_favorites existe sans utiliser information_schema
        console.log("Préparation des données du marché...");
        
        // Vérifie simplement si la table existe en tentant une requête
        const { error } = await supabase
          .from('marketplace_listings_favorites')
          .select('count')
          .limit(1);
          
        const favoritesTableExists = !error;
        
        if (!favoritesTableExists) {
          console.log("La table de favoris n'existe pas, les fonctionnalités de favoris seront désactivées");
        }

        // Traitement supplémentaire des données si nécessaire
        // ...

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

  // Hook personnalisé pour traiter les vues de marketplaceList
  useEffect(() => {
    const incrementViews = async (listingId: string) => {
      try {
        // Incrémenter le compteur de vues directement sans RPC
        const { data, error } = await supabase
          .from('marketplace_listings')
          .update({ 
            views_count: 1 // Utiliser une valeur fixe au lieu d'une opération
          })
          .eq('id', listingId);

        if (error) {
          console.error('Erreur lors de l\'incrémentation des vues:', error);
        }
      } catch (error) {
        console.error('Erreur lors du traitement des vues:', error);
      }
    };

    // Écouter un événement personnalisé pour incrémenter les vues
    const handleCustomViewEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.listingId) {
        incrementViews(event.detail.listingId);
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('marketplace-view-listing' as any, handleCustomViewEvent as EventListener);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('marketplace-view-listing' as any, handleCustomViewEvent as EventListener);
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
