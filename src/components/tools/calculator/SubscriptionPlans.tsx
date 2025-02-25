
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export function SubscriptionPlans() {
  return (
    <section className="w-full bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm py-12 border-t border-primary/10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Nos Forfaits</h2>
          <p className="text-muted-foreground mt-2">Choisissez le forfait qui correspond à vos besoins</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Forfait Starter */}
          <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">STARTER</h3>
                <Badge variant="secondary" className="bg-[#64B5D9]/20">299 CAD/mois</Badge>
              </div>
              <p className="text-sm text-white/60 mt-2">Idéal pour les petites entreprises</p>
              <ul className="mt-6 space-y-3">
                {[
                  "8 offres d'emploi actives",
                  "Gestion des candidatures",
                  "30 jours d'affichage",
                  "Commission standard"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/80">
                    <Check className="h-4 w-4 text-[#64B5D9]" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant="outline">Commencer</Button>
            </div>
          </Card>

          {/* Forfait Pro */}
          <Card className="relative border-2 border-[#64B5D9] shadow-lg bg-black/40 transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#64B5D9] text-white px-4">POPULAIRE</Badge>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">PRO</h3>
                <Badge variant="secondary" className="bg-[#64B5D9]/20">799 CAD/mois</Badge>
              </div>
              <p className="text-sm text-white/60 mt-2">Pour les entreprises en croissance</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Offres illimitées",
                  "500 CV dans la base",
                  "45 jours d'affichage",
                  "-10% sur commissions"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/80">
                    <Check className="h-4 w-4 text-[#64B5D9]" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6">Commencer</Button>
            </div>
          </Card>

          {/* Forfait Enterprise */}
          <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">ENTERPRISE</h3>
                <Badge variant="secondary" className="bg-[#64B5D9]/20">2499 CAD/mois</Badge>
              </div>
              <p className="text-sm text-white/60 mt-2">Solution complète</p>
              <ul className="mt-6 space-y-3">
                {[
                  "CV illimités",
                  "Visibilité maximale",
                  "Account manager dédié",
                  "-20% sur commissions"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white/80">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" variant="outline">Nous contacter</Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
