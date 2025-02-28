import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "education" | "experience";
}
export function VCardSection({
  title,
  icon,
  children,
  variant = "default"
}: VCardSectionProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  return <motion.div initial="hidden" animate="visible" variants={variants} className={cn("w-full rounded-xl overflow-hidden", "bg-gradient-to-br from-white/5 to-white/10 dark:from-black/20 dark:to-black/30", "border border-purple-500/10 dark:border-white/10", "shadow-lg shadow-purple-500/5", "backdrop-blur-md")}>
      <div className="">
        {icon && <motion.span initial={{
        scale: 0.8,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="text-purple-500 dark:text-purple-400">
            {icon}
          </motion.span>}
        <motion.h2 initial={{
        x: -20,
        opacity: 0
      }} animate={{
        x: 0,
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-200">
          {title}
        </motion.h2>
      </div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.4
    }} className={cn("w-full p-6", "bg-gradient-to-b from-transparent to-purple-50/5")}>
        {children}
      </motion.div>
    </motion.div>;
}