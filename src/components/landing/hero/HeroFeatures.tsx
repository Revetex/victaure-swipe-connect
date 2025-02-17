
import { Search, Briefcase, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    text: "IA Prédictive Avancée",
    description: "Anticipez les tendances du marché"
  },
  {
    icon: Briefcase,
    text: "Services Intelligents",
    description: "Optimisez votre recherche d'emploi"
  },
  {
    icon: Users,
    text: "Communauté Active",
    description: "Développez votre réseau professionnel"
  }
];

export function HeroFeatures() {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
      role="list"
      aria-label="Fonctionnalités principales"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-colors"
          role="listitem"
        >
          <feature.icon className="h-8 w-8 text-[#9b87f5]" />
          <h3 className="font-medium text-lg text-foreground">{feature.text}</h3>
          <p className="text-sm text-muted-foreground text-center">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
