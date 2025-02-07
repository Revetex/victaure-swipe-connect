
import { motion } from "framer-motion";

export function SidebarHeader() {
  return (
    <motion.div 
      className="relative py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
    >
      <h2 className="text-center font-medium text-sm tracking-tight">
        <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent px-4 py-2 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
          Menu
        </span>
      </h2>
    </motion.div>
  );
}
