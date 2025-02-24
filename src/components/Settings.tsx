
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
import { motion } from "framer-motion";

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

const Settings = () => {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-center text-muted-foreground mb-4">
          Le système de paiement n'a pas pu être initialisé.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <div className="min-h-screen bg-[#F2EBE4] dark:bg-[#1A1F2C] overflow-auto">
        <div className="h-full max-w-4xl mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {settingsSections.map(({ id, Component }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <div className="bg-[#F2EBE4]/50 dark:bg-[#1A1F2C]/50 backdrop-blur-sm rounded-lg shadow-sm border border-[#F2EBE4]/20 dark:border-[#1A1F2C]/20">
                  <Component />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Elements>
  );
}

export default Settings;
