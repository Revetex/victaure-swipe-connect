
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
    <section className="py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-8 text-[#F2EBE4]"
      >
        <span className="bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent">
          Fonctionnalités
        </span> clés
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:bg-[#D3E4FD]/20 transition-all duration-300 cursor-pointer"
            onClick={() => {
              const chatInput = document.querySelector('[data-chat-input]') as HTMLInputElement;
              if (chatInput) {
                chatInput.value = `Parle-moi de la fonctionnalité "${feature.title}"`;
                chatInput.focus();
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#64B5D9]/20 group-hover:bg-[#64B5D9]/30 transition-colors">
                <feature.icon className="w-6 h-6 text-[#64B5D9]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#F2EBE4] group-hover:text-[#64B5D9] transition-colors mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#F2EBE4]/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
