
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ShoppingBag, Gavel, Zap } from "lucide-react";

const innovations = [
  {
    icon: ShieldCheck,
    title: "Résiliation sans engagement",
    description: "Liberté totale dans votre utilisation du service"
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé direct",
    description: "Transactions protégées et instantanées"
  },
  {
    icon: ShoppingBag,
    title: "Marketplace intégrée",
    description: "Achetez et vendez en toute simplicité"
  },
  {
    icon: Gavel,
    title: "Contrats aux enchères",
    description: "Système d'enchères innovant pour les contrats"
  }
];

export function InnovationsSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 p-4 rounded-xl border border-[#64B5D9]/30 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-[#64B5D9]" />
        <h3 className="text-white font-semibold">Nouvelles Fonctionnalités</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {innovations.map((innovation, index) => (
          <motion.div
            key={innovation.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <innovation.icon className="w-5 h-5 text-[#64B5D9] mt-1" />
            <div>
              <h4 className="text-white text-sm font-medium">{innovation.title}</h4>
              <p className="text-[#F2EBE4]/60 text-xs">{innovation.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
