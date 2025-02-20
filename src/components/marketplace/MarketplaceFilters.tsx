
import { motion } from "framer-motion";
import { MapPin, ArrowUpDown, DollarSign, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { MarketplaceFilters } from "@/types/marketplace";

interface MarketplaceFiltersProps {
  filters: MarketplaceFilters;
  onFiltersChange: (filters: MarketplaceFilters) => void;
  onReset: () => void;
}

export function MarketplaceFilters({
  filters,
  onFiltersChange,
  onReset
}: MarketplaceFiltersProps) {
  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 space-y-4"
    >
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select 
            value={filters.location} 
            onValueChange={(value) => onFiltersChange({ ...filters, location: value })}
          >
            <SelectTrigger className="w-[200px]">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les localisations</SelectItem>
              <SelectItem value="montreal">Montréal</SelectItem>
              <SelectItem value="quebec">Québec</SelectItem>
              <SelectItem value="toronto">Toronto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select 
            value={filters.condition} 
            onValueChange={(value) => onFiltersChange({ ...filters, condition: value })}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="État" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les états</SelectItem>
              <SelectItem value="new">Neuf</SelectItem>
              <SelectItem value="like-new">Comme neuf</SelectItem>
              <SelectItem value="good">Bon état</SelectItem>
              <SelectItem value="fair">État correct</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select
            value={String(filters.rating)}
            onValueChange={(value) => onFiltersChange({ ...filters, rating: Number(value) })}
          >
            <SelectTrigger className="w-[200px]">
              <Star className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Note minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les notes</SelectItem>
              <SelectItem value="4">4 étoiles et plus</SelectItem>
              <SelectItem value="3">3 étoiles et plus</SelectItem>
              <SelectItem value="2">2 étoiles et plus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [MarketplaceFilters['sortBy'], MarketplaceFilters['sortOrder']];
              onFiltersChange({ ...filters, sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="w-[200px]">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Plus récents</SelectItem>
              <SelectItem value="date-asc">Plus anciens</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="rating-desc">Meilleures notes</SelectItem>
              <SelectItem value="views-desc">Plus populaires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Fourchette de prix
          </label>
          <span className="text-sm text-muted-foreground">
            {filters.priceRange[0].toLocaleString()}$ - {filters.priceRange[1].toLocaleString()}$
          </span>
        </div>
        <Slider
          min={0}
          max={10000}
          step={100}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={handlePriceRangeChange}
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onReset}
          className="text-sm"
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </motion.div>
  );
}
