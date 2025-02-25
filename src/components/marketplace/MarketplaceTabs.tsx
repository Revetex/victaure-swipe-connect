
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MarketplaceList } from "./MarketplaceList";
import { MarketplaceContracts } from "./MarketplaceContracts";
import type { MarketplaceFilters } from "@/types/marketplace";

interface MarketplaceTabsProps {
  searchQuery: string;
  filters: MarketplaceFilters;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function MarketplaceTabs({ 
  searchQuery, 
  filters, 
  currentPage, 
  onPageChange 
}: MarketplaceTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5 sm:w-auto sm:inline-flex">
        <TabsTrigger value="all">Tout</TabsTrigger>
        <TabsTrigger value="sale">Vente</TabsTrigger>
        <TabsTrigger value="rent">Location</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="contracts">Contrats</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <MarketplaceList 
          type="all" 
          searchQuery={searchQuery} 
          filters={filters} 
          page={currentPage} 
          onPageChange={onPageChange} 
        />
      </TabsContent>
      <TabsContent value="sale">
        <MarketplaceList 
          type="vente" 
          searchQuery={searchQuery} 
          filters={filters} 
          page={currentPage} 
          onPageChange={onPageChange} 
        />
      </TabsContent>
      <TabsContent value="rent">
        <MarketplaceList 
          type="location" 
          searchQuery={searchQuery} 
          filters={filters} 
          page={currentPage} 
          onPageChange={onPageChange} 
        />
      </TabsContent>
      <TabsContent value="services">
        <MarketplaceList 
          type="service" 
          searchQuery={searchQuery} 
          filters={filters} 
          page={currentPage} 
          onPageChange={onPageChange} 
        />
      </TabsContent>
      <TabsContent value="contracts">
        <MarketplaceContracts />
      </TabsContent>
    </Tabs>
  );
}
