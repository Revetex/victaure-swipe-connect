
import { useState, useEffect } from "react";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { ScrollArea } from "./ui/scroll-area";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
  amount: 1000,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0F172A',
    },
  },
};

const settingsSections = [
  { id: 'appearance', Component: AppearanceSection },
  { id: 'notifications', Component: NotificationsSection },
  { id: 'privacy', Component: PrivacySection },
  { id: 'security', Component: SecuritySection },
  { id: 'blocked', Component: BlockedUsersSection },
  { id: 'logout', Component: LogoutSection }
];

export function Settings() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStripe()
      .then(stripe => {
        if (stripe) setStripePromise(Promise.resolve(stripe));
        else throw new Error('Failed to initialize Stripe');
      })
      .catch(error => {
        console.error('Stripe initialization error:', error);
        toast.error("Erreur lors de l'initialisation du système de paiement");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>;
  }

  if (!stripePromise) {
    return <div className="flex flex-col items-center justify-center h-screen p-4">
      <p className="text-center text-muted-foreground mb-4">
        Le système de paiement n'a pas pu être initialisé.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Réessayer
      </button>
    </div>;
  }

  return (
    <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <div className="min-h-screen w-full overflow-x-hidden">
        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
          <div className="max-w-full px-4 py-6 mx-auto md:max-w-2xl">
            <div className="space-y-4">
              {settingsSections.map(({ id, Component }) => (
                <div key={id} className="w-full overflow-x-hidden">
                  <Component />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Elements>
  );
}
