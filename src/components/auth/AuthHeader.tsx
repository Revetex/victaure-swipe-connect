import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const AuthHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center space-y-8"
    >
      <Logo size="lg" className="mb-2" />
      
      <div className="relative space-y-3 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-semibold tracking-tight text-foreground mb-2"
        >
          Victaure
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-medium tracking-tight text-foreground/90"
        >
          Votre Carrière, Notre Mission
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground/80 max-w-md mx-auto"
        >
          Découvrez des opportunités uniques et connectez-vous avec des professionnels qui partagent vos ambitions
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mt-2"
      >
        {[
          "Matching intelligent",
          "Profil professionnel",
          "Opportunités exclusives",
          "Réseau ciblé"
        ].map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-2 group"
          >
            <div className="h-6 w-6 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors duration-200">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-xs text-muted-foreground/70 group-hover:text-foreground/90 transition-colors duration-200">
              {feature}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};