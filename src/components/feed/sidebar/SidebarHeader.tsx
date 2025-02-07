
import { motion } from "framer-motion";

export function SidebarHeader() {
  return (
    <motion.div 
      className="relative py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-center font-medium text-sm">
        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent px-4 py-2 rounded-full border border-border/50 shadow-sm">
          Menu
        </span>
      </h2>
    </motion.div>
  );
}
