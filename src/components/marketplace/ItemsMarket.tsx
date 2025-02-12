
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceItem, MarketplaceCategory } from "@/types/marketplace/types";
import { ItemCard } from "./items/ItemCard";
import { ItemFilters } from "./items/ItemFilters";
import { CreateItemDialog } from "./items/CreateItemDialog";

export function ItemsMarket() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    condition: ""
  });

  // Fetch items
  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ['marketplace-items', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles!marketplace_items_seller_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.textSearch('searchable_text', filters.search);
      }
      
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      
      query = query
        .gte('price', filters.minPrice)
        .lte('price', filters.maxPrice);

      const { data, error } = await query;

      if (error) {
        toast.error("Erreur lors du chargement des articles");
        throw error;
      }

      return data as unknown as MarketplaceItem[];
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .eq('type', 'item');

      if (error) {
        toast.error("Erreur lors du chargement des catégories");
        throw error;
      }

      return data as MarketplaceCategory[];
    }
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 px-4 md:px-6 pt-4 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Articles à vendre ou louer</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Publier une annonce
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <ItemFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Items Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg animate-pulse">
                <div className="w-full aspect-video bg-muted rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-1/3 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">
                Aucune annonce pour le moment
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <CreateItemDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categories={categories}
        onSuccess={refetch}
      />
    </div>
  );
}
