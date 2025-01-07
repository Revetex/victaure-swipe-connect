import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  gradient 
}: StatsCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full border-none overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className={`${bgColor} p-2 rounded-lg backdrop-blur-sm transition-colors duration-300`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}