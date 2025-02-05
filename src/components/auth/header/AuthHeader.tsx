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
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-playfair">
          VICTAURE
        </h1>
        <p className="text-lg text-muted-foreground font-montserrat">
          Technologies.inc
        </p>
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto font-montserrat">
        L'IA qui révolutionne votre recherche d'emploi
      </p>
    </motion.div>
  );
}