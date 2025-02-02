import { ReactNode } from "react";
import { motion } from "framer-motion";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function VCardSection({ title, icon, children, className = "" }: VCardSectionProps) {
  const isExperience = title.toLowerCase().includes('expérience');
  const isEducation = title.toLowerCase().includes('formation') || title.toLowerCase().includes('éducation');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
    >
      <div className={`flex items-center gap-2 pb-2 border-b ${
        isExperience 
          ? 'border-purple-300 dark:border-purple-800/30' 
          : isEducation 
            ? 'border-indigo-300 dark:border-indigo-800/30'
            : 'border-primary/20'
      }`}>
        <div className={
          isExperience 
            ? 'text-purple-600 dark:text-purple-400'
            : isEducation
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-primary'
        }>
          {icon}
        </div>
        <h3 className={`text-lg font-semibold ${
          isExperience 
            ? 'text-purple-900 dark:text-purple-100'
            : isEducation
              ? 'text-indigo-900 dark:text-indigo-100'
              : 'text-primary'
        }`}>
          {title}
        </h3>
      </div>
      <div className={`pt-2 ${
        isExperience 
          ? 'text-purple-800 dark:text-purple-200'
          : isEducation
            ? 'text-indigo-800 dark:text-indigo-200'
            : 'text-primary/90'
      }`}>
        {children}
      </div>
    </motion.div>
  );
}