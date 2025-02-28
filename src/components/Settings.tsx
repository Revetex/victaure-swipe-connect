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
import { Card } from "./ui/card";
const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
  amount: 1000,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#9b87f5'
    }
  }
};
const settingsSections = [{
  id: 'appearance',
  Component: AppearanceSection
}, {
  id: 'notifications',
  Component: NotificationsSection
}, {
  id: 'privacy',
  Component: PrivacySection
}, {
  id: 'security',
  Component: SecuritySection
}, {
  id: 'blocked',
  Component: BlockedUsersSection
}, {
  id: 'logout',
  Component: LogoutSection
}];
const Settings = () => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initializeStripe().then(stripe => {
      if (stripe) setStripePromise(Promise.resolve(stripe));else throw new Error('Failed to initialize Stripe');
    }).catch(error => {
      console.error('Stripe initialization error:', error);
      toast.error("Erreur lors de l'initialisation du système de paiement");
    }).finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>;
  }
  if (!stripePromise) {
    return <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-center text-muted-foreground mb-4">
          Le système de paiement n'a pas pu être initialisé.
        </p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Réessayer
        </button>
      </div>;
  }
  return <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <ScrollArea className="h-[calc(100vh-5rem)] w-full">
        <div className="max-w-4xl mx-auto bg-transparent py-0 px-0">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="space-y-6">
            {settingsSections.map(({
            id,
            Component
          }, index) => <motion.div key={id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }}>
                <Card className="border border-border/50 dark:border-[#64B5D9]/10 p-6 shadow-lg py-0 px-0 rounded bg-transparent">
                  <Component />
                </Card>
              </motion.div>)}
          </motion.div>
        </div>
      </ScrollArea>
    </Elements>;
};
export default Settings;