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
        backgroundColor: isEditing ? "rgba(255, 255, 255, 0.98)" : "transparent",
        backdropFilter: isEditing ? "blur(8px)" : "none",
      }}
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300",
        "overflow-y-auto pb-32",
        isEditing ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isEditing ? 1 : 0,
          y: isEditing ? 0 : 20
        }}
        className="container mx-auto p-4 space-y-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}