
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceService } from "@/types/marketplace";

export function MarketplaceList() {
  const [items, setItems] = useState<MarketplaceService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          provider:provider_id(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.type === 'location' ? 'Location' : 
                 item.type === 'service' ? 'Service' : 'Vente'}
              </p>
            </div>
            <p className="text-lg font-bold">
              {item.price} {item.currency}
            </p>
          </div>

          <p className="text-sm">{item.description}</p>

          {item.provider && (
            <div className="flex items-center space-x-2">
              {item.provider.avatar_url && (
                <img
                  src={item.provider.avatar_url}
                  alt={item.provider.full_name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm">{item.provider.full_name}</span>
            </div>
          )}

          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Contacter
            </Button>
            {item.type === 'service' && (
              <Button size="sm">
                Faire une offre
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
