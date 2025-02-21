
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { MarketplaceFilters as FiltersType } from "@/types/marketplace";

interface MarketplaceFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export function MarketplaceFilters({ filters, onFiltersChange }: MarketplaceFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Fourchette de prix</Label>
          <Slider
            defaultValue={filters.priceRange}
            max={10000}
            step={100}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-muted-foreground">{filters.priceRange[0]} CAD</span>
            <span className="text-sm text-muted-foreground">{filters.priceRange[1]} CAD</span>
          </div>
        </div>

        <div>
          <Label>Trier par</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value: 'price' | 'date' | 'rating' | 'views') => 
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un tri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="rating">Évaluation</SelectItem>
              <SelectItem value="views">Vues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Ordre</Label>
          <Select 
            value={filters.sortOrder} 
            onValueChange={(value: 'asc' | 'desc') => 
              onFiltersChange({ ...filters, sortOrder: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir l'ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Croissant</SelectItem>
              <SelectItem value="desc">Décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
