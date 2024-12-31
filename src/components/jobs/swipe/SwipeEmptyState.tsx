import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function SwipeEmptyState() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <SearchX className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Aucune mission disponible
      </h3>
      <p className="text-muted-foreground max-w-md">
        Il n'y a plus de missions correspondant à vos critères pour le moment. 
        Revenez plus tard ou ajustez vos filtres pour voir plus d'opportunités.
      </p>
    </motion.div>
  );
}