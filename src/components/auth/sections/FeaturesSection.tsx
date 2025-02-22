
import { motion } from "framer-motion";
import { Bot, Wrench, Users, Timer } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gratuit pour les chercheurs d'emploi",
    description: "Accédez à toutes les fonctionnalités essentielles sans frais"
  },
  {
    icon: Bot,
    title: "Marketplace IA innovante",
    description: "Des outils d'IA spécialisés pour optimiser votre recherche"
  },
  {
    icon: Wrench,
    title: "Suite d'outils complète",
    description: "CV, lettre de motivation, analyse de marché et plus encore"
  },
  {
    icon: Timer,
    title: "Gestion flexible",
    description: "Gérez vos services sans engagement"
  }
];

export function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-xl p-6 hover:bg-[#D3E4FD]/20 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#64B5D9]/20 group-hover:bg-[#64B5D9]/30 transition-colors">
              <feature.icon className="w-6 h-6 text-[#64B5D9]" />
            </div>
            <div>
              <h3 className="text-[#F2EBE4] font-semibold text-lg mb-2 group-hover:text-[#64B5D9] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#F2EBE4]/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
