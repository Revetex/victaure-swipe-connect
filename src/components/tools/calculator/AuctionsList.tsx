
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "./types";
import type { FilterOrder } from "./types";

interface AuctionsListProps {
  activeAuctions: any[];
  categoryFilter: string;
  priceFilter: FilterOrder;
  onCategoryFilterChange: (value: string) => void;
  onPriceFilterChange: (value: FilterOrder) => void;
}

export function AuctionsList({
  activeAuctions,
  categoryFilter,
  priceFilter,
  onCategoryFilterChange,
  onPriceFilterChange
}: AuctionsListProps) {
  const handlePriceFilterChange = (value: string) => {
    onPriceFilterChange({
      field: 'price',
      direction: value as 'asc' | 'desc'
    });
  };

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Enchères en cours</h3>
          <p className="text-sm text-muted-foreground">
            {activeAuctions.length} enchères actives
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={priceFilter.direction} 
            onValueChange={handlePriceFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par prix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Prix croissant</SelectItem>
              <SelectItem value="desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {activeAuctions.map((auction) => (
          <Card key={auction.id} className="p-4 hover:bg-accent/5 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h4 className="font-medium text-lg">{auction.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {auction.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Prix actuel:
                    </span>
                    <span className="text-primary font-bold">
                      {auction.current_price || auction.price} CAD
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {auction.bids?.length || 0} enchères
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm text-muted-foreground">
                  Fin: {new Date(auction.auction_end_date).toLocaleDateString()}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Enchérir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
