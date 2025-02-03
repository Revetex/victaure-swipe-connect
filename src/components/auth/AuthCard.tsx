import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

export const AuthCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card relative overflow-hidden w-full space-y-6 rounded-xl border bg-card/30 p-6 shadow-sm backdrop-blur-sm"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <BiometricAuth />
        <AuthForm />
      </div>
    </motion.div>
  );
};