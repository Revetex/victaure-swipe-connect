
import { Search, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";

export function HeroFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {[
        {
          icon: Search,
          text: "IA Prédictive Avancée"
        },
        {
          icon: Briefcase,
          text: "Services Intelligents"
        },
        {
          icon: Users,
          text: "Communauté Active"
        }
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="flex items-center gap-3 justify-center"
        >
          <feature.icon className="h-6 w-6 text-[#8B5CF6]" />
          <span className="text-muted-foreground">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
