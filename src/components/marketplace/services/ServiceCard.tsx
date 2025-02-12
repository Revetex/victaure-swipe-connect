
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Gavel, ImagePlus } from "lucide-react";
import { MarketplaceService } from "@/types/marketplace/types";
import { BidDialog } from "./BidDialog";
import { useState } from "react";

interface ServiceCardProps {
  service: MarketplaceService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [showBidDialog, setShowBidDialog] = useState(false);

  return (
    <Card className="overflow-hidden">
      {service.images && service.images[0] ? (
        <div className="aspect-video relative">
          <img
            src={service.images[0]}
            alt={service.title}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold truncate">{service.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            {service.current_price || service.price} $
          </p>
          {service.type === 'auction' && service.auction_end_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(service.auction_end_date).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
        {service.type === 'auction' && service.bids && (
          <p className="text-sm text-muted-foreground">
            {service.bids[0]?.count} enchère(s)
          </p>
        )}
        {service.type === 'auction' && (
          <Button 
            className="w-full mt-2" 
            variant="secondary"
            onClick={() => setShowBidDialog(true)}
          >
            <Gavel className="h-4 w-4 mr-2" />
            Enchérir
          </Button>
        )}
      </div>

      <BidDialog
        open={showBidDialog}
        onOpenChange={setShowBidDialog}
        service={service}
        onSuccess={() => {
          // Le dialogue se fermera automatiquement
          // La mise à jour des enchères se fera via la souscription en temps réel
        }}
      />
    </Card>
  );
}
