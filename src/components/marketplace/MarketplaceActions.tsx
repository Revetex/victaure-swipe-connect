
import { Filter, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";
import { MarketplaceForm } from "./MarketplaceForm";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MarketplaceFilters as MarketplaceFiltersType } from "@/types/marketplace";

interface MarketplaceActionsProps {
  filters: MarketplaceFiltersType;
  onFiltersChange: (filters: MarketplaceFiltersType) => void;
}

export function MarketplaceActions({ filters, onFiltersChange }: MarketplaceActionsProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2" size={isMobile ? "sm" : "default"}>
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Filtres de recherche</DialogTitle>
          <MarketplaceFilters filters={filters} onFiltersChange={onFiltersChange} />
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
    </>
  );
}
