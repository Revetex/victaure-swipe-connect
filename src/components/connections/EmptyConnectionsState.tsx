
import { Users2 } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyConnectionsStateProps {
  showPendingRequests?: boolean;
}

export function EmptyConnectionsState({ showPendingRequests }: EmptyConnectionsStateProps) {
  return (
    <motion.div 
      className="text-center py-8 space-y-4 bg-muted/20 rounded-xl shadow-sm backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
    >
      <Users2 className="h-12 w-12 mx-auto text-muted-foreground/40" />
      <div className="space-y-2">
        <p className="text-sm font-medium bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70 bg-clip-text text-transparent">
          {showPendingRequests 
            ? "Aucune demande en attente" 
            : "Aucune connexion"
          }
        </p>
        {!showPendingRequests && (
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
            Commencez à ajouter des contacts pour développer votre réseau
          </p>
        )}
      </div>
    </motion.div>
  );
}
