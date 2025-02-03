import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export const AuthHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center space-y-4 text-center"
    >
      <Logo size="lg" className="mb-2" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground/90">
          Votre Carrière, Notre Mission
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Découvrez des opportunités uniques et connectez-vous avec des professionnels qui partagent vos ambitions
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full max-w-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            ✓
          </div>
          <span className="text-muted-foreground">Matching intelligent</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            ✓
          </div>
          <span className="text-muted-foreground">Profil professionnel avancé</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            ✓
          </div>
          <span className="text-muted-foreground">Opportunités exclusives</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            ✓
          </div>
          <span className="text-muted-foreground">Réseau professionnel ciblé</span>
        </div>
      </div>
    </motion.div>
  );
};