
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceFilters as MarketplaceFiltersType } from "@/types/marketplace";
import { MarketplaceSearch } from "./marketplace/MarketplaceSearch";
import { MarketplaceActions } from "./marketplace/MarketplaceActions";
import { MarketplaceTabs } from "./marketplace/MarketplaceTabs";

export function Marketplace() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFiltersType>({
    priceRange: [0, 10000],
    categories: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) return;
    
    setIsSearching(true);
    try {
      // Simplification de la recherche sans appeler de fonction RPC
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('count')
        .textSearch('searchable_text', value)
        .limit(1);

      if (error) throw error;

      toast.info(`Recherche effectuée pour "${value}"`);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-auto min-h-0 px-4 pt-6"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <MarketplaceSearch 
            value={searchQuery}
            isSearching={isSearching}
            onChange={handleSearch}
          />
          
          <MarketplaceActions 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <MarketplaceTabs 
          searchQuery={searchQuery}
          filters={filters}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </motion.div>
  );
}
