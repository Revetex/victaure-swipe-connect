
import { Check } from "lucide-react";

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

export function PricingTier({ 
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
