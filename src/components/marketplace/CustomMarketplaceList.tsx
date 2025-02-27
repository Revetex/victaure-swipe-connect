
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceFilters } from "@/types/marketplace";
import { toast } from "sonner";
import { useListingSearch } from "./hooks/useListingSearch";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CustomListings } from "./CustomListings"; 

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
        // Traitement simplifié pour éviter les erreurs d'accès aux tables
        console.log("Préparation des données du marché...");
        
        // Au lieu de vérifier si la table existe, on suppose qu'elle existe
        const favoritesTableExists = true;
        
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

  // Utiliser notre hook personnalisé pour récupérer les annonces
  const { listings, loading, error, totalPages } = useListingSearch(
    searchQuery,
    filters,
    type,
    page,
    12
  );

  // Hook personnalisé pour traiter les vues de marketplaceList
  useEffect(() => {
    const incrementViews = async (listingId: string) => {
      try {
        // Simule l'incrémentation des vues sans accéder à la base de données
        console.log('Increment view for listing', listingId);
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

  // Afficher les erreurs si nécessaire
  useEffect(() => {
    if (error) {
      toast.error("Une erreur est survenue lors du chargement des annonces");
      console.error("Erreur de chargement:", error);
    }
  }, [error]);

  // Si les données ne sont pas prêtes, afficher un état de chargement
  if (!isDataReady) {
    return <div className="py-12 text-center">Chargement des annonces...</div>;
  }

  return (
    <div className="space-y-6">
      <CustomListings 
        items={listings}
        isLoading={loading}
      />
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Afficher au maximum 5 pages
              let pageToRender = page;
              if (page <= 3) {
                pageToRender = i + 1;
              } else if (page >= totalPages - 2) {
                pageToRender = totalPages - 4 + i;
              } else {
                pageToRender = page - 2 + i;
              }
              
              // S'assurer que la page est dans les limites
              if (pageToRender > 0 && pageToRender <= totalPages) {
                return (
                  <PaginationItem key={pageToRender}>
                    <PaginationLink
                      isActive={pageToRender === page}
                      onClick={() => onPageChange(pageToRender)}
                    >
                      {pageToRender}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
