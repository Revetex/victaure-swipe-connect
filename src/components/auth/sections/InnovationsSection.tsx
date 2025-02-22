
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ShoppingBag, Gavel, Zap } from "lucide-react";

const innovations = [{
  icon: ShieldCheck,
  title: "Résiliation sans engagement",
  description: "Liberté totale dans votre utilisation du service"
}, {
  icon: CreditCard,
  title: "Paiement sécurisé direct",
  description: "Transactions protégées et instantanées"
}, {
  icon: ShoppingBag,
  title: "Marketplace intégrée",
  description: "Achetez et vendez en toute simplicité"
}, {
  icon: Gavel,
  title: "Contrats aux enchères",
  description: "Système d'enchères innovant pour les contrats"
}];

export function InnovationsSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-pattern animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="relative bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 p-6 rounded-xl border border-[#64B5D9]/30 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-[#64B5D9]" />
          <h3 className="text-[#F2EBE4] font-semibold">Nouvelles Fonctionnalités</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {innovations.map((innovation, index) => (
            <motion.div
              key={innovation.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-[#64B5D9]/10 group-hover:bg-[#64B5D9]/20 transition-colors">
                <innovation.icon className="w-5 h-5 text-[#64B5D9]" />
              </div>
              <div>
                <h4 className="text-[#F2EBE4] text-sm font-medium mb-1">{innovation.title}</h4>
                <p className="text-[#F2EBE4]/70 text-xs leading-relaxed">{innovation.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
