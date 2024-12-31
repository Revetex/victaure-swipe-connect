import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SwipeEmptyStateProps {
  onRefresh: () => void;
}

export function SwipeEmptyState({ onRefresh }: SwipeEmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-4">
        Aucune offre disponible pour le moment
      </h3>
      <p className="text-muted-foreground mb-6">
        Revenez plus tard pour découvrir de nouvelles missions.
      </p>
      <Button
        onClick={onRefresh}
        className="bg-victaure-blue hover:bg-victaure-blue/90 text-white"
      >
        Recommencer
      </Button>
    </motion.div>
  );
}