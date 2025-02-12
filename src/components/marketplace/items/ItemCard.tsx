
import { MarketplaceItem } from "@/types/marketplace/types";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

interface ItemCardProps {
  item: MarketplaceItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card key={item.id} className="overflow-hidden flex flex-col">
      {item.images && item.images[0] ? (
        <div className="aspect-video relative">
          <img
            src={item.images[0]}
            alt={item.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h3 className="font-semibold truncate">{item.title}</h3>
        <p className="text-lg font-bold text-primary">
          {item.price.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {item.description}
        </p>
        {item.seller && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              Vendeur: {item.seller.full_name}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
