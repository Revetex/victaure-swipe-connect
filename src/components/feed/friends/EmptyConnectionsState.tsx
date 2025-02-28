
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyConnectionsState() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 px-6 bg-zinc-900/30 rounded-lg border border-zinc-800/50 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-primary/70" />
      </div>
      
      <h3 className="text-lg font-medium text-white mb-2">
        Vous n'avez pas encore de connexions
      </h3>
      
      <p className="text-sm text-white/60 mb-6 max-w-md">
        Connectez-vous avec d'autres professionnels pour agrandir votre réseau et découvrir de nouvelles opportunités
      </p>
      
      <Button 
        onClick={() => navigate('/search')} 
        className="bg-primary hover:bg-primary/90 text-white"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Trouver des connexions
      </Button>
    </motion.div>
  );
}
