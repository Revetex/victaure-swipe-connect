
import { useState } from "react";
import { MarketplaceForm } from "./marketplace/MarketplaceForm";
import { MarketplaceList } from "./marketplace/MarketplaceList";
import { PaymentMethodForm } from "./marketplace/PaymentMethodForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Calculator } from "lucide-react";

export function Marketplace() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <div className="flex gap-4">
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calculator className="h-4 w-4" />
                Mode de paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle className="mb-4">Ajouter un mode de paiement</DialogTitle>
              <PaymentMethodForm />
            </DialogContent>
          </Dialog>

          <Dialog open={showListingForm} onOpenChange={setShowListingForm}>
            <DialogTrigger asChild>
              <Button>
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent>
              <MarketplaceForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <MarketplaceList />
    </div>
  );
}
