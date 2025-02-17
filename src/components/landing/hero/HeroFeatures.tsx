
import { Search, Briefcase, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    text: "IA Prédictive Avancée",
    description: "Anticipez les tendances du marché avec notre intelligence artificielle"
  },
  {
    icon: Briefcase,
    text: "Services Intelligents",
    description: "Optimisez votre recherche d'emploi grâce à nos outils automatisés"
  },
  {
    icon: Users,
    text: "Communauté Active",
    description: "Développez votre réseau professionnel dans un écosystème dynamique"
  }
];

export function HeroFeatures() {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
      role="list"
      aria-label="Fonctionnalités principales"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-purple-200 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
          role="listitem"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-sm group-hover:bg-purple-500/30 transition-colors duration-300" aria-hidden="true" />
            <feature.icon className="relative h-8 w-8 text-purple-500" aria-hidden="true" />
          </div>
          <h3 className="font-medium text-lg text-foreground">{feature.text}</h3>
          <p className="text-sm text-muted-foreground text-center">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
