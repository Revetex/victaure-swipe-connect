
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

const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
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

  useEffect(() => {
    setMounted(true);
    const initStripe = async () => {
      const stripe = await initializeStripe();
      setStripePromise(stripe);
    };
    initStripe();
  }, []);

  if (!mounted) return null;

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
