
import { useState, useEffect } from "react";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { Elements } from "@stripe/react-stripe-js";
import { initializeStripe } from "@/hooks/useStripePayment";
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const stripeElementsOptions: StripeElementsOptions = {
  mode: 'payment',
  currency: 'cad',
  amount: 1000,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1B2A4A',
    },
  },
};

const settingsSections = [
  { 
    id: 'appearance', 
    title: 'Apparence',
    Component: AppearanceSection 
  },
  { 
    id: 'notifications', 
    title: 'Notifications',
    Component: NotificationsSection 
  },
  { 
    id: 'privacy', 
    title: 'Confidentialité',
    Component: PrivacySection 
  },
  { 
    id: 'security', 
    title: 'Sécurité',
    Component: SecuritySection 
  },
  { 
    id: 'blocked', 
    title: 'Utilisateurs bloqués',
    Component: BlockedUsersSection 
  },
  { 
    id: 'logout', 
    title: 'Déconnexion',
    Component: LogoutSection 
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Settings = () => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(settingsSections[0].id);

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
      <div className="flex items-center justify-center min-h-screen bg-[#F2EBE4] dark:bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A] dark:border-[#F2EBE4]" />
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F2EBE4] dark:bg-[#1A1F2C]">
        <p className="text-center text-muted-foreground mb-4">
          Le système de paiement n'a pas pu être initialisé.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1B2A4A] text-[#F2EBE4] rounded-md hover:bg-[#1B2A4A]/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={stripeElementsOptions}>
      <div className="min-h-screen bg-[#F2EBE4] dark:bg-[#1A1F2C]">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8"
          >
            {/* Navigation des sections */}
            <Card className="h-fit p-4 bg-[#F2EBE4]/50 dark:bg-[#1A1F2C]/50 backdrop-blur-sm border-[#F2EBE4]/20 dark:border-[#1A1F2C]/20">
              <nav className="space-y-2">
                {settingsSections.map(({ id, title }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg transition-colors",
                      "hover:bg-[#1B2A4A]/10 dark:hover:bg-[#F2EBE4]/10",
                      activeSection === id 
                        ? "bg-[#1B2A4A]/15 dark:bg-[#F2EBE4]/15 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {title}
                  </button>
                ))}
              </nav>
            </Card>

            {/* Contenu de la section active */}
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <motion.div 
                variants={itemVariants}
                className="space-y-6"
              >
                {settingsSections.map(({ id, Component }) => (
                  <div
                    key={id}
                    className={cn(
                      "transition-all duration-300",
                      activeSection === id ? "block" : "hidden"
                    )}
                  >
                    <Card className="p-6 bg-[#F2EBE4]/50 dark:bg-[#1A1F2C]/50 backdrop-blur-sm border-[#F2EBE4]/20 dark:border-[#1A1F2C]/20">
                      <Component />
                    </Card>
                  </div>
                ))}
              </motion.div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </Elements>
  );
}

export default Settings;
