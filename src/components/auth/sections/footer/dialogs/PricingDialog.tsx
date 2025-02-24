
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Star, Shield } from "lucide-react";

interface PricingTierProps {
  title: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  features: string[];
  tools: string[];
  support: string[];
  icon: typeof Check;
  recommended?: boolean;
}

function PricingTier({ 
  title, 
  monthlyPrice, 
  quarterlyPrice, 
  yearlyPrice, 
  features, 
  tools, 
  support, 
  icon: Icon,
  recommended 
}: PricingTierProps) {
  return (
    <div className={`p-8 bg-white/5 rounded-xl border-2 ${recommended ? 'border-[#64B5D9]' : 'border-[#64B5D9]/20'} relative overflow-hidden`}>
      {recommended && (
        <div className="absolute -top-3 right-4 bg-[#64B5D9] text-white px-4 py-1 rounded-full text-sm font-medium">
          RECOMMANDÉ
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h5 className="font-semibold text-xl mb-4 text-[#64B5D9]">Tarification {title}</h5>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`${recommended ? 'text-4xl' : 'text-3xl'} font-bold text-[#64B5D9]`}>{monthlyPrice}</span>
              <span className="text-lg">CAD/mois</span>
            </div>
            <p className="text-sm text-[#F1F0FB]/60">{quarterlyPrice} CAD/mois si trimestriel</p>
            <p className="text-sm text-[#F1F0FB]/60">{yearlyPrice} CAD/mois si annuel</p>
          </div>
        </div>
        <div>
          <h5 className="font-medium mb-4">Fonctionnalités</h5>
          <ul className="space-y-2 text-sm">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#64B5D9]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-4">Outils</h5>
          <ul className="space-y-2 text-sm">
            {tools.map((tool) => (
              <li key={tool} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#64B5D9]" />
                <span>{tool}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-4">Support</h5>
          <ul className="space-y-2 text-sm">
            {support.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#64B5D9]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PricingDialog() {
  return (
    <DialogContent className="md:max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#F1F0FB]/20">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center text-[#F1F0FB] mb-6">Guide Tarifaire Victaure 2025</DialogTitle>
      </DialogHeader>
      <div className="space-y-12 p-6 text-[#F1F0FB]">
        <section className="space-y-8">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl font-semibold text-[#64B5D9]">Plans d'abonnement</h3>
            <p className="text-[#F1F0FB]/80">Choisissez le plan qui correspond à vos besoins</p>
          </div>
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
        </section>
      </div>
    </DialogContent>
  );
}
