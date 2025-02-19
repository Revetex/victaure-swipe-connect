
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  SortAsc, 
  SortDesc, 
  ListFilter,
  MapPin,
  Star,
  Ban
} from "lucide-react";
import type { MarketplaceFilters as Filters } from "@/types/marketplace";

interface FiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  maxPrice: number;
}

export function MarketplaceFilters({ filters, onFiltersChange, maxPrice }: FiltersProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label>Fourchette de prix</Label>
        <Slider
          defaultValue={[0, maxPrice]}
          max={maxPrice}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, priceRange: value as [number, number] })
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{filters.priceRange[0]}$</span>
          <span>{filters.priceRange[1]}$</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Localisation</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Entrez une ville"
            value={filters.location || ''}
            onChange={(e) => 
              onFiltersChange({ ...filters, location: e.target.value })
            }
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onFiltersChange({ ...filters, location: undefined })}
          >
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Note minimum</Label>
        <Select
          value={filters.rating?.toString() || ''}
          onValueChange={(value) => 
            onFiltersChange({ ...filters, rating: value ? parseInt(value) : undefined })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les notes</SelectItem>
            {[4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating}+ <Star className="inline-block h-4 w-4 ml-1" />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Trier par</Label>
        <div className="flex gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value: MarketplaceFilters['sortBy']) => 
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="rating">Note</SelectItem>
              <SelectItem value="views">Vues</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => 
              onFiltersChange({ 
                ...filters, 
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })
            }
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onFiltersChange({
          priceRange: [0, maxPrice],
          categories: [],
          sortBy: 'date',
          sortOrder: 'desc'
        })}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
