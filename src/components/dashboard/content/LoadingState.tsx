
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-full bg-primary/10"
      >
        <Loader className="w-12 h-12 text-primary" />
      </motion.div>
    </div>
  );
}
