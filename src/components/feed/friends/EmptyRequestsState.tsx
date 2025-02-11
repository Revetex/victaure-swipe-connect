
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyRequestsState() {
  return (
    <motion.div 
      className="text-center py-6 space-y-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <UserCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        Aucune demande en attente
      </p>
    </motion.div>
  );
}
