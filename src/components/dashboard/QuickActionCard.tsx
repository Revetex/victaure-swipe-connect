import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
}

export function QuickActionCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  gradient 
}: QuickActionCardProps) {
  return (
    <Card className="border-none overflow-hidden">
      <motion.div 
        className={`relative h-full bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-transform duration-300`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className={`${bgColor} p-2 rounded-lg`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 backdrop-blur-[2px] pointer-events-none"
        />
      </motion.div>
    </Card>
  );
}