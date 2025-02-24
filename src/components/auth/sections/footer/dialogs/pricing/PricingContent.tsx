
import { Check, Star, Shield } from "lucide-react";
import { PricingTier } from "./PricingTier";

export function PricingContent() {
  return (
    <div className="grid gap-8">
      <PricingTier
        title="STARTER"
        monthlyPrice={299}
        quarterlyPrice={284}
        yearlyPrice={249}
        features={[
          "8 offres actives",
          "30 jours d'affichage",
          "Base de 100 CV",
          "1 admin + 2 utilisateurs"
        ]}
        tools={[
          "Publication d'offres",
          "Gestion candidatures",
          "5 templates",
          "Tableau de bord"
        ]}
        support={[
          "Réponse en moins de 24h",
          "Documentation",
          "Tutoriels vidéo",
          "Chat 9h-17h"
        ]}
        icon={Check}
      />
      <PricingTier
        title="PRO"
        monthlyPrice={799}
        quarterlyPrice={759}
        yearlyPrice={666}
        features={[
          "Offres illimitées",
          "45 jours d'affichage",
          "Base de 500 CV",
          "3 admin + 5 utilisateurs",
          "-10% commissions"
        ]}
        tools={[
          "Tests de compétences",
          "Filtres avancés",
          "20 templates",
          "Analytics",
          "API basique"
        ]}
        support={[
          "Réponse en moins de 4h",
          "Formation en ligne",
          "Chat 24/5",
          "Webinaires mensuels"
        ]}
        icon={Star}
        recommended
      />
      <PricingTier
        title="ENTERPRISE"
        monthlyPrice={2499}
        quarterlyPrice={2374}
        yearlyPrice={2082}
        features={[
          "Offres illimitées",
          "CV illimités",
          "60 jours d'affichage",
          "Utilisateurs illimités",
          "-20% commissions"
        ]}
        tools={[
          "API complète",
          "Intégration SIRH",
          "Analyses prédictives",
          "Multi-sites/langues",
          "Templates illimités"
        ]}
        support={[
          "Account manager",
          "Support 24/7",
          "Formation sur site",
          "Audits trimestriels"
        ]}
        icon={Shield}
      />
    </div>
  );
}
