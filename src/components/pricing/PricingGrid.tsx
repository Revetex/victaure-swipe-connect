
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

export const PricingGrid = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Plan Starter */}
        <Card className="relative border-2 hover:border-[#64B5D9]/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>STARTER</span>
              <Badge variant="secondary">299 CAD/mois</Badge>
            </CardTitle>
            <CardDescription>Idéal pour les petites entreprises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>8 offres d'emploi actives</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Gestion des candidatures</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>30 jours d'affichage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Commission standard sur les contrats</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Pro */}
        <Card className="relative border-2 border-[#64B5D9] shadow-lg hover:border-[#64B5D9] transition-all duration-300">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Badge className="bg-[#64B5D9]">POPULAIRE</Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>PRO</span>
              <Badge variant="secondary">799 CAD/mois</Badge>
            </CardTitle>
            <CardDescription>Pour les entreprises en croissance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Offres illimitées</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>500 CV dans la base de données</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>45 jours d'affichage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>-10% sur les commissions de contrats</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Enterprise */}
        <Card className="relative border-2 hover:border-[#64B5D9]/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>ENTERPRISE</span>
              <Badge variant="secondary">2499 CAD/mois</Badge>
            </CardTitle>
            <CardDescription>Solution complète</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>CV illimités</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Visibilité maximale</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Account manager</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>-20% sur les commissions de contrats</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Commissions */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Commissions sur Contrats</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prix Fixe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{"< 1 000 CAD"}</span>
                  <span>5%</span>
                </div>
                <div className="flex justify-between">
                  <span>1 000-5 000 CAD</span>
                  <span>4%</span>
                </div>
                <div className="flex justify-between">
                  <span>{"> 5 000 CAD"}</span>
                  <span>3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enchères</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base</span>
                  <span>6%</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum</span>
                  <span>8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Promotions et Services */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Réduction Annuelle</h4>
              <p>2 MOIS GRATUITS sur tout abonnement annuel</p>
            </div>
            <div>
              <h4 className="font-semibold">Startups</h4>
              <p>-20% sur tous les abonnements</p>
              <p className="text-sm text-muted-foreground">Éligibilité : entreprises {"< 2"} ans</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services Additionnels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Mise en Avant</h4>
              <div className="space-y-1">
                <p>Standard : GRATUIT</p>
                <p>Premium (7 jours) : 29 CAD</p>
                <p>Urgent (14 jours) : 59 CAD</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Formation</h4>
              <div className="space-y-1">
                <p>En ligne (2h) : 299 CAD</p>
                <p>Sur site : 599 CAD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
