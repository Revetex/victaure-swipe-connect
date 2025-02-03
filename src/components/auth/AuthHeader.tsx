import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export const AuthHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center space-y-2 text-center"
    >
      <Logo size="lg" className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur Victaure</h1>
      <p className="text-sm text-muted-foreground">
        Connectez-vous ou créez un compte pour continuer
      </p>
    </motion.div>
  );
};