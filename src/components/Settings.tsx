
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { PaymentSection } from "./settings/PaymentSection";
import { ScrollArea } from "./ui/scroll-area";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
  amount: 0, // Initialize with 0, will be updated when making a payment
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
  { id: 'payments', Component: PaymentSection },
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
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
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto px-4 py-6 mt-16 space-y-6"
        >
          {settingsSections.map(({ id, Component }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Component />
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </Elements>
  );
}
