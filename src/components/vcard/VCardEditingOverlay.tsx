import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardEditingOverlayProps {
  isEditing: boolean;
  children: React.ReactNode;
}

export function VCardEditingOverlay({ isEditing, children }: VCardEditingOverlayProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isEditing ? 1 : 0,
        x: isEditing ? 0 : 400,
        pointerEvents: isEditing ? "auto" : "none",
      }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={cn(
        "fixed right-0 top-0 z-50 h-screen w-[400px] max-w-[100vw]",
        "bg-background/95 shadow-2xl backdrop-blur-sm border-l",
        "overflow-y-auto pb-32 transition-all duration-300"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto p-4 space-y-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}