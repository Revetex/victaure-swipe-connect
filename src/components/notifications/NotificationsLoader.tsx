
import { motion } from "framer-motion";

export function NotificationsLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-8 w-8 border-b-2 border-primary"
      />
    </div>
  );
}
