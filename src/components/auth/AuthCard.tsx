import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

export const AuthCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card w-full space-y-6 rounded-xl border bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/50 dark:to-gray-900/30 p-6 shadow-lg backdrop-blur-sm"
    >
      <BiometricAuth />
      <AuthForm />
    </motion.div>
  );
};