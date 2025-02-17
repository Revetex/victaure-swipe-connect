
import { HeroSection } from "@/components/landing/HeroSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MarketplacePreview } from "@/components/marketplace/MarketplacePreview";
import { JobsPreview } from "@/components/jobs/JobsPreview";
import { toast } from "sonner";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthRequired = () => {
    toast.info("Connectez-vous pour accéder à toutes les fonctionnalités", {
      action: {
        label: "Se connecter",
        onClick: () => navigate("/auth")
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-purple-900/5 to-background">
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-4 md:pt-8"
        >
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
            <Features />
            
            {/* Aperçu du Marketplace */}
            <section className="py-16 bg-purple-50/5">
              <div className="container">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Découvrez notre Marketplace
                </h2>
                <MarketplacePreview onAuthRequired={handleAuthRequired} />
              </div>
            </section>

            {/* Aperçu des Offres d'Emploi */}
            <section className="py-16">
              <div className="container">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Offres d'emploi récentes
                </h2>
                <JobsPreview onAuthRequired={handleAuthRequired} />
              </div>
            </section>
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
