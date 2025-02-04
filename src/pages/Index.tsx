import { HeroSection } from "@/components/landing/HeroSection";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Target, 
  Shield, 
  Search, 
  TrendingUp,
  Briefcase,
  CheckCircle2
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="relative z-10">
        <HeroSection />
        
        {/* Stats Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50K+", label: "Offres d'emploi" },
                { value: "10K+", label: "Entreprises" },
                { value: "95%", label: "Taux de satisfaction" },
                { value: "24/7", label: "Support client" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                >
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4 font-playfair"
              >
                Pourquoi choisir Victaure ?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground max-w-2xl mx-auto font-montserrat"
              >
                La plateforme qui révolutionne la recherche d'emploi et de services professionnels au Québec
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Recherche intelligente",
                  description: "Trouvez les meilleures opportunités grâce à notre algorithme de matching avancé"
                },
                {
                  icon: Shield,
                  title: "Sécurité garantie",
                  description: "Vos données sont protégées avec les plus hauts standards de sécurité"
                },
                {
                  icon: TrendingUp,
                  title: "Carrière évolutive",
                  description: "Développez votre carrière avec des opportunités ciblées et pertinentes"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300 border border-border/50"
                >
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 font-playfair">{feature.title}</h3>
                  <p className="text-muted-foreground font-montserrat">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4 font-playfair"
              >
                Les avantages Victaure
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Building2,
                  title: "Entreprises vérifiées",
                  description: "Toutes nos entreprises partenaires sont soigneusement sélectionnées"
                },
                {
                  icon: Users,
                  title: "Communauté active",
                  description: "Rejoignez une communauté de professionnels dynamiques"
                },
                {
                  icon: Target,
                  title: "Opportunités ciblées",
                  description: "Des offres personnalisées selon votre profil et vos objectifs"
                },
                {
                  icon: Briefcase,
                  title: "Gestion simplifiée",
                  description: "Une interface intuitive pour gérer vos candidatures"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300 border border-border/50"
                >
                  <benefit.icon className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-playfair">{benefit.title}</h3>
                    <p className="text-muted-foreground font-montserrat">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-4 font-playfair"
                >
                  Ils nous font confiance
                </motion.h2>
              </div>
              
              <div className="space-y-6">
                {[
                  "Processus de recrutement simplifié et efficace",
                  "Support réactif et professionnel",
                  "Matching précis entre candidats et emplois",
                  "Protection des données garantie"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg font-montserrat">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="relative">
          <div className="absolute inset-0 bg-[#9b87f5]/5 dark:bg-[#D6BCFA]/5 transform -skew-y-3" />
          <div className="relative overflow-hidden">
            <div className="container mx-auto px-4 py-16 sm:py-24">
              <DownloadApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}