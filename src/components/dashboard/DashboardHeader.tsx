import { motion } from "framer-motion";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{description}</p>
    </motion.div>
  );
}