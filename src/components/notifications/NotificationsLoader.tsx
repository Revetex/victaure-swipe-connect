
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function NotificationsLoader() {
  return (
    <div className="flex items-center justify-center h-64" role="status" aria-label="Chargement">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>
    </div>
  );
}
