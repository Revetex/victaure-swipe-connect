import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeEmptyStateProps {
  onRefresh: () => void;
}

export function SwipeEmptyState({ onRefresh }: SwipeEmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-full bg-muted p-4">
        <RefreshCw className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Aucune offre disponible</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Il n'y a plus d'offres correspondant à vos critères pour le moment.
        Réessayez plus tard ou modifiez vos filtres.
      </p>
      <Button 
        variant="outline"
        onClick={onRefresh}
        className="mt-4"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Actualiser
      </Button>
    </motion.div>
  );
}