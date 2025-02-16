
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useServicesData } from "@/hooks/useServicesData";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function ServicesList() {
  const { services, isLoading, createBid } = useServicesData();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Aucun service disponible pour le moment.
      </div>
    );
  }

  const handleBid = async (serviceId: string) => {
    if (!bidAmount || isNaN(parseFloat(bidAmount))) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    try {
      setIsPlacingBid(true);
      await createBid.mutateAsync({
        service_id: serviceId,
        amount: parseFloat(bidAmount),
      });
      setBidAmount("");
      setSelectedService(null);
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setIsPlacingBid(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="p-4 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {service.description}
              </p>
            </div>
            <Badge variant={service.type === 'auction' ? 'secondary' : 'default'}>
              {service.type === 'auction' ? 'Enchère' : 'Prix fixe'}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={service.provider?.avatar_url || ''} />
              <AvatarFallback>{service.provider?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{service.provider?.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(service.created_at), {
                  addSuffix: true,
                  locale: fr
                })}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">
              {service.type === 'auction'
                ? `Enchère actuelle: ${service.current_price || service.price} ${service.currency}`
                : `${service.price} ${service.currency}`}
            </span>
          </div>

          {service.type === 'auction' && service.auction_end_date && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Fin dans {formatDistanceToNow(new Date(service.auction_end_date), { locale: fr })}
              </span>
            </div>
          )}

          <Button 
            className="mt-4 w-full" 
            onClick={() => setSelectedService(service)}
            variant={service.type === 'auction' ? 'secondary' : 'default'}
          >
            {service.type === 'auction' ? 'Placer une enchère' : 'Voir les détails'}
          </Button>
        </Card>
      ))}

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedService?.type === 'auction' ? 'Placer une enchère' : 'Détails du service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <h4 className="font-medium">{selectedService?.title}</h4>
            <p className="text-sm text-muted-foreground">{selectedService?.description}</p>

            {selectedService?.type === 'auction' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Montant de l'enchère ({selectedService?.currency})
                  </label>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={selectedService?.current_price || selectedService?.price}
                    step="0.01"
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleBid(selectedService.id)}
                  disabled={isPlacingBid || !bidAmount || parseFloat(bidAmount) <= (selectedService.current_price || selectedService.price)}
                >
                  {isPlacingBid ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placement de l'enchère...
                    </>
                  ) : (
                    'Confirmer l\'enchère'
                  )}
                </Button>
              </div>
            )}

            {selectedService?.bids && selectedService.bids.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Historique des enchères</h5>
                <div className="space-y-2">
                  {selectedService.bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={bid.bidder?.avatar_url || ''} />
                          <AvatarFallback>{bid.bidder?.full_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span>{bid.bidder?.full_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{bid.amount} {selectedService.currency}</span>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(bid.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
