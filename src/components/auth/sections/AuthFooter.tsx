
import { Check, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuthFooter() {
  return (
    <div className="space-y-8 p-4 text-[#F1F0FB] bg-[#1B2A4A]">
      <div className="space-y-4">
        <h2 className="text-2xl font-tiempos font-bold text-center tracking-tight">
          Tarification transparente
        </h2>
        <p className="text-sm text-center text-[#F1F0FB]/80">
          Choisissez le plan qui correspond à vos besoins
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Plan Starter */}
        <div className="relative rounded-2xl border-2 border-[#64B5D9]/30 p-6 backdrop-blur-sm">
          <div className="space-y-2">
            <h3 className="font-tiempos text-xl font-semibold">Plan Starter</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#64B5D9]">299</span>
              <span className="text-lg font-medium">CAD</span>
              <span className="text-sm text-[#F1F0FB]/60">/mois</span>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#64B5D9]" />
              <span>8 offres d'emploi actives</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#64B5D9]" />
              <span>Gestion des candidatures</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#64B5D9]" />
              <span>30 jours d'affichage</span>
            </li>
          </ul>

          <Button className="mt-6 w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
            Commencer
          </Button>
        </div>

        {/* Plan Pro */}
        <div className="relative rounded-2xl border-2 border-[#64B5D9] p-6 backdrop-blur-sm shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#64B5D9] px-3 py-1 rounded-full text-xs font-medium">
            RECOMMANDÉ
          </div>

          <div className="space-y-2">
            <h3 className="font-tiempos text-xl font-semibold">Plan Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#64B5D9]">799</span>
              <span className="text-lg font-medium">CAD</span>
              <span className="text-sm text-[#F1F0FB]/60">/mois</span>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#64B5D9]" />
              <span>Offres illimitées</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#64B5D9]" />
              <span>500 CV dans la base</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#64B5D9]" />
              <span>45 jours d'affichage</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#64B5D9]" />
              <span>-10% sur commissions</span>
            </li>
          </ul>

          <Button className="mt-6 w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
            Choisir Pro
          </Button>
        </div>

        {/* Plan Enterprise */}
        <div className="relative rounded-2xl border-2 border-[#64B5D9]/30 p-6 backdrop-blur-sm">
          <div className="space-y-2">
            <h3 className="font-tiempos text-xl font-semibold">Enterprise</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#64B5D9]">2499</span>
              <span className="text-lg font-medium">CAD</span>
              <span className="text-sm text-[#F1F0FB]/60">/mois</span>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              <span>CV illimités</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              <span>Visibilité maximale</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              <span>Account manager dédié</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#64B5D9]" />
              <span>-20% sur commissions</span>
            </li>
          </ul>

          <Button className="mt-6 w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white">
            Contacter commercial
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-[#64B5D9] hover:text-[#64B5D9]/80">
              Voir tous les détails de la tarification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Grille tarifaire complète</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[600px]">
              <PricingGrid />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
