
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

export const PricingGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Plan Starter */}
      <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
            <span className="text-lg font-bold">STARTER</span>
            <Badge variant="secondary" className="bg-[#64B5D9]/20">299 CAD/mois</Badge>
          </CardTitle>
          <p className="text-sm text-white/60">Idéal pour les petites entreprises</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "8 offres d'emploi actives",
            "Gestion des candidatures",
            "30 jours d'affichage",
            "Commission standard"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/80">
              <Check className="h-4 w-4 text-[#64B5D9]" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plan Pro - Featured */}
      <Card className="relative border-2 border-[#64B5D9] shadow-lg bg-black/40 transform hover:scale-[1.02] transition-all duration-300">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#64B5D9] text-white px-4">POPULAIRE</Badge>
        </div>
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
            <span className="text-lg font-bold">PRO</span>
            <Badge variant="secondary" className="bg-[#64B5D9]/20">799 CAD/mois</Badge>
          </CardTitle>
          <p className="text-sm text-white/60">Pour les entreprises en croissance</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Offres illimitées",
            "500 CV dans la base",
            "45 jours d'affichage",
            "-10% sur commissions"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/80">
              <Check className="h-4 w-4 text-[#64B5D9]" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plan Enterprise */}
      <Card className="relative border-2 border-[#64B5D9]/30 hover:border-[#64B5D9]/50 transition-all duration-300 bg-black/40">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
            <span className="text-lg font-bold">ENTERPRISE</span>
            <Badge variant="secondary" className="bg-[#64B5D9]/20">2499 CAD/mois</Badge>
          </CardTitle>
          <p className="text-sm text-white/60">Solution complète</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "CV illimités",
            "Visibilité maximale",
            "Account manager dédié",
            "-20% sur commissions"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/80">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
