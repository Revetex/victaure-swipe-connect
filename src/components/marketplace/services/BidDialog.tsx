
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MarketplaceService } from "@/types/marketplace/types";

interface BidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: MarketplaceService;
  onSuccess?: () => void;
}

export function BidDialog({ open, onOpenChange, service, onSuccess }: BidDialogProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const minBidAmount = service.current_price 
    ? service.current_price + 1
    : service.price || 0;

  const handleSubmit = async () => {
    if (!user) return;
    
    const bidAmount = parseFloat(amount);
    if (bidAmount < minBidAmount) {
      toast.error(`L'enchère minimum est de ${minBidAmount} $`);
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('service_bids')
        .insert({
          service_id: service.id,
          bidder_id: user.id,
          amount: bidAmount
        });

      if (error) throw error;

      // Update service current price
      const { error: updateError } = await supabase
        .from('marketplace_services')
        .update({ current_price: bidAmount })
        .eq('id', service.id);

      if (updateError) throw updateError;

      toast.success("Enchère placée avec succès");
      onOpenChange(false);
      onSuccess?.();
      setAmount("");
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error("Erreur lors du placement de l'enchère");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-sm",
        isMobile && "w-[calc(100%-2rem)] top-[50%]"
      )}>
        <DialogHeader>
          <DialogTitle>Placer une enchère</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Service</Label>
            <p className="text-sm text-muted-foreground">{service.title}</p>
          </div>

          <div className="space-y-2">
            <Label>Prix actuel</Label>
            <p className="text-lg font-bold">{service.current_price || service.price} $</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Votre enchère</Label>
            <Input
              id="amount"
              type="number"
              min={minBidAmount}
              step="0.01"
              placeholder={`Minimum ${minBidAmount} $`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isLoading || !amount || parseFloat(amount) < minBidAmount}
          >
            {isLoading ? "Placement de l'enchère..." : "Placer l'enchère"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
