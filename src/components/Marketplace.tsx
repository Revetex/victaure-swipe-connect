import { useState } from "react";
import { MarketplaceForm } from "./marketplace/MarketplaceForm";
import { MarketplaceList } from "./marketplace/MarketplaceList";
import { MarketplaceFilters } from "./marketplace/MarketplaceFilters";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calculator, Search, PlusCircle, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import type { MarketplaceFilters as MarketplaceFiltersType } from "@/types/marketplace";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const isMobile = useIsMobile();

  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('marketplace-search', {
        body: { query: value }
      });

      if (error) throw error;

      if (data.suggestedKeywords) {
        toast.info(`Suggestions de recherche: ${data.suggestedKeywords}`);
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="container mx-auto px-4 py-4 sm:py-8 mt-16"
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearching ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
            <Input 
              placeholder="Rechercher dans le marketplace..." 
              value={searchQuery} 
              onChange={e => handleSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" size={isMobile ? "sm" : "default"}>
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogTitle>Filtres de recherche</DialogTitle>
              <MarketplaceFilters filters={filters} onFiltersChange={setFilters} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2" size={isMobile ? "sm" : "default"}>
                <PlusCircle className="h-4 w-4" />
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogTitle>Nouvelle annonce</DialogTitle>
              <MarketplaceForm />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="sale">Vente</TabsTrigger>
            <TabsTrigger value="rent">Location</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MarketplaceList 
              type="all" 
              searchQuery={searchQuery} 
              filters={filters} 
              page={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </TabsContent>
          <TabsContent value="sale">
            <MarketplaceList 
              type="vente" 
              searchQuery={searchQuery} 
              filters={filters} 
              page={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </TabsContent>
          <TabsContent value="rent">
            <MarketplaceList 
              type="location" 
              searchQuery={searchQuery} 
              filters={filters} 
              page={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </TabsContent>
          <TabsContent value="services">
            <MarketplaceList 
              type="service" 
              searchQuery={searchQuery} 
              filters={filters} 
              page={currentPage} 
              onPageChange={setCurrentPage} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
