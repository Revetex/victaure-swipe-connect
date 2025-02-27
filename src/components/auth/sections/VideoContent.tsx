
import { motion } from "framer-motion";
import { AuthVideo } from "@/components/auth/AuthVideo";

export function VideoContent() {
  return (
    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <AuthVideo />
      
      <div className="p-6">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-xl font-semibold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent mb-3"
        >
          Découvrez la puissance de Victaure
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-[#F2EBE4]/80 text-sm leading-relaxed"
        >
          Transformez votre recherche d'emploi avec notre plateforme alimentée par l'IA.
          Accédez à des opportunités sur mesure, des outils de carrière avancés et
          une communauté de professionnels partageant les mêmes valeurs.
        </motion.p>
        
        <FeatureTags />
      </div>
    </div>
  );
}

function FeatureTags() {
  const tags = [
    "Intelligence Artificielle",
    "Matching Avancé",
    "CV Dynamique",
    "Analyse de Carrière",
    "Réseau Pro"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="mt-4 flex flex-wrap gap-2"
    >
      {tags.map((tag) => (
        <span 
          key={tag}
          className="px-3 py-1 bg-[#64B5D9]/10 text-[#64B5D9] text-xs rounded-full
                   border border-[#64B5D9]/20 hover:bg-[#64B5D9]/20 transition-colors
                   cursor-pointer"
        >
          {tag}
        </span>
      ))}
    </motion.div>
  );
}
