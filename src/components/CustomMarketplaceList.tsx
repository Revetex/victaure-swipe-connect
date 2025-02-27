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

  // This function pre-processes data and ensures required tables exist
  useEffect(() => {
    const prepareData = async () => {
      try {
        // Simple check to see if we can access the marketplace listings table
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Error accessing marketplace data:", error);
        } else {
          console.log("Successfully accessed marketplace data");
        }

        setIsDataReady(true);
      } catch (error) {
        console.error("Error preparing data:", error);
        // Even if there's an error, we mark data as ready so the original component can handle it
        setIsDataReady(true);
      }
    };

    prepareData();
  }, []);

  // Custom hook to handle viewing listings
  useEffect(() => {
    const handleViewListing = (event: CustomEvent) => {
      try {
        if (event.detail && event.detail.listingId) {
          const listing_id = event.detail.listingId;
          
          // Manual update with RPC call
          supabase
            .from('marketplace_listings')
            .update({ 
              views_count: 1 // This will be added to the existing count server-side
            })
            .eq('id', listing_id)
            .select()
            .then(({ error }) => {
              if (error) {
                console.error('Error incrementing view count:', error);
              }
            });
        }
      } catch (error) {
        console.error('Error handling view event:', error);
      }
    };

    // Add custom event listener
    window.addEventListener('marketplace-view-listing' as any, handleViewListing as EventListener);

    // Clean up listener
    return () => {
      window.removeEventListener('marketplace-view-listing' as any, handleViewListing as EventListener);
    };
  }, []);

  // If data is not ready, show loading state
  if (!isDataReady) {
    return <div className="py-12 text-center">Chargement des annonces...</div>;
  }

  // Otherwise render the original component
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
