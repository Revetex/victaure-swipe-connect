
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
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="rounded-full bg-violet-600/20 p-6 mb-4"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <RefreshCw className="w-8 h-8 text-violet-400" />
      </motion.div>

      <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-500">
        Aucune offre disponible
      </h3>
      
      <p className="text-gray-400 max-w-md font-inter">
        Il n'y a plus d'offres correspondant à vos critères pour le moment.
        Réessayez plus tard ou modifiez vos filtres.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="outline"
          onClick={onRefresh}
          className="mt-6 bg-violet-600 hover:bg-violet-700 text-white border-none font-semibold px-6 py-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </motion.div>
    </motion.div>
  );
}
