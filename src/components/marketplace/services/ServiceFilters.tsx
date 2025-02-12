
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplaceCategory } from "@/types/marketplace/types";
import { Slider } from "@/components/ui/slider";

interface ServiceFiltersProps {
  categories: MarketplaceCategory[];
  filters: {
    search: string;
    category: string;
    type: string;
    minPrice: number;
    maxPrice: number;
  };
  onFilterChange: (key: string, value: any) => void;
}

export function ServiceFilters({ categories, filters, onFilterChange }: ServiceFiltersProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher un service..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="fixed_price">Prix fixe</SelectItem>
            <SelectItem value="auction">Enchère</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Prix</Label>
        <div className="space-y-4">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={0}
            max={10000}
            step={100}
            onValueChange={(value) => {
              onFilterChange("minPrice", value[0]);
              onFilterChange("maxPrice", value[1]);
            }}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.minPrice} $</span>
            <span>{filters.maxPrice} $</span>
          </div>
        </div>
      </div>
    </div>
  );
}
