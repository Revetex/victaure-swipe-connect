import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";

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
  const [mounted, setMounted] = useState(false);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setMounted(true);
        const stripe = await initializeStripe();
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
        setStripePromise(Promise.resolve(stripe));
      } catch (error) {
        console.error('Stripe initialization error:', error);
        toast.error("Erreur lors de l'initialisation du système de paiement");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 p-4">
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
      <ScrollArea className="min-h-[calc(100vh-4rem)] pt-16 w-full max-w-full overflow-x-hidden">
        <div className="px-4 py-6 pb-20 w-full">
          <div className="max-w-lg mx-auto space-y-6">
            {settingsSections.map(({ id, Component }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full"
              >
                <Component />
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Elements>
  );
}
