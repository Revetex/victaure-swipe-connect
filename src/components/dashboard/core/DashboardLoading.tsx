import { ReloadIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

const loadingVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export function DashboardLoading() {
  return (
    <motion.div
      variants={loadingVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <ReloadIcon className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Chargement de votre profil...</p>
    </motion.div>
  );
}