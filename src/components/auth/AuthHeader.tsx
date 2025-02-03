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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Votre Carrière, Notre Mission
        </h1>
        <p className="text-base text-muted-foreground max-w-md">
          Découvrez des opportunités uniques et connectez-vous avec des professionnels qui partagent vos ambitions
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full max-w-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            ✓
          </div>
          <span>Matching intelligent</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            ✓
          </div>
          <span>Profil professionnel avancé</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            ✓
          </div>
          <span>Opportunités exclusives</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
            ✓
          </div>
          <span>Réseau professionnel ciblé</span>
        </div>
      </div>
    </motion.div>
  );
};