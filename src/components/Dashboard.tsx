import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export function Dashboard() {
  const { profile, isLoading: isProfileLoading } = useProfile();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={profile ? 'dashboard' : 'auth'}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isProfileLoading ? (
          <DashboardAuth />
        ) : !profile ? (
          <VCardCreationForm />
        ) : (
          <DashboardLayout />
        )}
      </motion.div>
    </AnimatePresence>
  );
}