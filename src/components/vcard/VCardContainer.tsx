import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function VCardContainer({ children, className }: VCardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br",
        "before:from-purple-500/10 before:via-blue-500/5 before:to-purple-600/10",
        "before:animate-gradient-shift",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #9b87f5 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #1EA5E9 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, #9b87f5 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, #1EA5E9 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, #9b87f5 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      {children}
    </motion.div>
  );
}