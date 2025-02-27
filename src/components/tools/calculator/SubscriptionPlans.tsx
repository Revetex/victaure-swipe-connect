
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";

export function SubscriptionPlans() {
  return (
    <section className="w-full bg-gradient-to-br from-background/50 via-card/20 to-background/80 backdrop-blur-sm py-16 border-t border-primary/10">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Nos Forfaits
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins et commencez à développer votre entreprise dès aujourd'hui
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Forfait Starter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="relative h-full border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">STARTER</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">299 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mb-6">Idéal pour les petites entreprises</p>
                <ul className="space-y-4 mb-8">
                  {[
                    "8 offres d'emploi actives",
                    "Gestion des candidatures",
                    "30 jours d'affichage",
                    "Commission standard"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <Check className="h-5 w-5 text-[#64B5D9]" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-white border border-[#64B5D9]/50"
                  variant="outline"
                >
                  Commencer
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Forfait Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="relative h-full border-2 border-[#64B5D9] shadow-lg bg-black/40 transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#64B5D9] text-white px-4 py-1">POPULAIRE</Badge>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">PRO</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">799 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mb-6">Pour les entreprises en croissance</p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Offres illimitées",
                    "500 CV dans la base",
                    "45 jours d'affichage",
                    "-10% sur commissions"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <Check className="h-5 w-5 text-[#64B5D9]" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
                  Commencer
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Forfait Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative h-full border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">ENTERPRISE</h3>
                  <Badge variant="secondary" className="bg-[#64B5D9]/20">2499 CAD/mois</Badge>
                </div>
                <p className="text-sm text-white/60 mb-6">Solution complète</p>
                <ul className="space-y-4 mb-8">
                  {[
                    "CV illimités",
                    "Visibilité maximale",
                    "Account manager dédié",
                    "-20% sur commissions"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 text-white border border-[#64B5D9]/50"
                  variant="outline"
                >
                  Nous contacter
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
