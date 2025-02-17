
import { HeroSection } from "@/components/landing/HeroSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { MarketplacePreview } from "@/components/marketplace/MarketplacePreview";
import { JobsPreview } from "@/components/jobs/JobsPreview";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobBadges } from "@/components/jobs/badges/JobBadges";
import { MapPin, BriefcaseIcon, Coins, Clock, Users } from "lucide-react";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

const StatsSection = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[
      { icon: BriefcaseIcon, label: "Offres actives", value: "1,234+" },
      { icon: Users, label: "Recruteurs", value: "500+" },
      { icon: Coins, label: "Budget moyen", value: "45k $" },
      { icon: Clock, label: "Délai moyen", value: "14 jours" }
    ].map((stat, i) => (
      <Card key={i} className="p-4 text-center">
        <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <h4 className="text-xl font-bold">{stat.value}</h4>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
      </Card>
    ))}
  </div>
);

export default function Index() {
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
            
            {/* Section Marketplace */}
            <section className="py-16 bg-purple-50/5">
              <div className="container">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Découvrez notre Marketplace
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Trouvez des services de qualité proposés par des professionnels vérifiés ou proposez vos propres services.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {["Développement", "Design", "Marketing", "Conseil", "Formation"].map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-sm">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <MarketplacePreview onAuthRequired={handleAuthRequired} />
              </div>
            </section>

            {/* Section Emplois */}
            <section className="py-16">
              <div className="container">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Les meilleures opportunités d'emploi
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Des offres d'emploi soigneusement sélectionnées dans votre domaine, mises à jour quotidiennement.
                  </p>
                </div>
                
                <StatsSection />

                <div className="bg-card rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {["Type de contrat", "Niveau d'expérience", "Localisation"].map((filter) => (
                      <Button 
                        key={filter} 
                        variant="outline" 
                        className="w-full"
                        onClick={handleAuthRequired}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>

                <JobsPreview onAuthRequired={handleAuthRequired} />
                
                <div className="text-center mt-12">
                  <p className="text-muted-foreground mb-4">
                    Recevez les dernières offres directement dans votre boîte mail
                  </p>
                  <Button
                    onClick={handleAuthRequired}
                    variant="outline"
                    className="mx-auto"
                  >
                    Créer une alerte emploi
                  </Button>
                </div>
              </div>
            </section>

          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
