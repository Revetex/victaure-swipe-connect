
import { motion } from "framer-motion";
import { AuthVideo } from "@/components/auth/AuthVideo";

export function VideoContent() {
  return (
    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full">
      <AuthVideo />
      
      <div className="p-6 lg:p-8">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent mb-3"
        >
          Découvrez la puissance de Victaure
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-[#F2EBE4]/80 text-sm md:text-base leading-relaxed"
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
      className="mt-6 flex flex-wrap gap-2"
    >
      {tags.map((tag, index) => (
        <motion.span 
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(100, 181, 217, 0.2)" }}
          className="px-3 py-1.5 bg-[#64B5D9]/10 text-[#64B5D9] text-xs font-medium rounded-full
                   border border-[#64B5D9]/20 transition-all duration-200
                   cursor-pointer shadow-sm hover:shadow-[#64B5D9]/10 hover:shadow-md"
        >
          {tag}
        </motion.span>
      ))}
    </motion.div>
  );
}
