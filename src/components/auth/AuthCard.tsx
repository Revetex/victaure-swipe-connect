import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

export const AuthCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card w-full space-y-6 rounded-lg border bg-card/30 p-6 shadow-sm backdrop-blur-sm"
    >
      <BiometricAuth />
      <AuthForm />
    </motion.div>
  );
};