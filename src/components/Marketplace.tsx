
import { useState } from "react";
import { MarketplaceForm } from "./marketplace/MarketplaceForm";
import { MarketplaceList } from "./marketplace/MarketplaceList";
import { PaymentMethodForm } from "./marketplace/PaymentMethodForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function Marketplace() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <div className="space-x-4">
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Ajouter une méthode de paiement
              </Button>
            </DialogTrigger>
            <DialogContent>
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
