import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export function AuthHeader() {
  return (
    <motion.div 
      className="text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo size="xl" className="mx-auto" />
      <div className="space-y-2">
        <p className="text-lg text-muted-foreground font-montserrat">
          L'IA qui révolutionne votre recherche d'emploi
        </p>
      </div>
    </motion.div>
  );
}