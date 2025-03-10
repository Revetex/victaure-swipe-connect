
import { useState, useEffect } from "react";
import { MarketplaceService } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useServicesData() {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("marketplace_services")
          .select(`
            *,
            provider:provider_id(
              id,
              full_name,
              avatar_url,
              rating
            )
          `)
          .eq("status", "active");

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match our MarketplaceService interface
          const transformedServices: MarketplaceService[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || "",
            price: item.price || 0,
            currency: item.currency || "CAD",
            provider_id: item.provider_id,
            category: item.category_id || "", // Map category_id to category for compatibility
            created_at: item.created_at || "",
            updated_at: item.updated_at || "",
            provider: item.provider ? {
              id: item.provider.id,
              full_name: item.provider.full_name || "",
              avatar_url: item.provider.avatar_url,
              rating: item.provider.rating || 0
            } : undefined,
            owner_id: item.provider_id, // Map provider_id to owner_id for compatibility 
            category_id: item.category_id,
            current_price: item.current_price,
            auction_end_date: item.auction_end_date,
            images: item.images,
            status: item.status,
            type: item.type
          }));

          setServices(transformedServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [user?.id]);

  return { services, isLoading, error };
}
