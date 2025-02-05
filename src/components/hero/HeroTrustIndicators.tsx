import { motion } from "framer-motion";
import { Shield, Star, Users } from "lucide-react";

export function HeroTrustIndicators() {
  const features = [
    { icon: Shield, text: "Protection des données" },
    { icon: Star, text: "Service de qualité" },
    { icon: Users, text: "Communauté active" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="flex items-center justify-center gap-3 text-blue-100/80"
        >
          <feature.icon className="h-5 w-5" />
          <span>{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}