
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardBlockProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  textColor: string;
  stats?: string;
  route?: string;
  delay: number;
}

export function DashboardBlock({
  icon: Icon,
  title,
  description,
  color,
  textColor,
  stats,
  route,
  delay
}: DashboardBlockProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "group cursor-pointer relative overflow-hidden",
        "rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
        "border border-gray-200 dark:border-gray-800",
        "hover:shadow-lg transition-all duration-300",
        "transform preserve-3d"
      )}
      onClick={() => route && navigate(route)}
    >
      <div className="p-6 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
          color,
          "transition-transform duration-300 group-hover:scale-110"
        )}>
          <Icon className={cn("w-6 h-6", textColor)} />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {stats && (
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              "text-2xl font-bold",
              textColor
            )}>
              {stats}
            </span>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 pointer-events-none" />
      <div className={cn(
        "absolute bottom-0 right-0 w-32 h-32 -m-8",
        "rounded-full blur-3xl opacity-20",
        color
      )} />
    </motion.div>
  );
}
