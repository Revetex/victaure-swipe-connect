
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border border-border/30 p-6",
        "bg-card hover:bg-accent/5 transition-colors",
        "shadow-sm hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-3 text-primary mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          "bg-primary/10 text-primary",
          "ring-1 ring-primary/20"
        )}>
          <Settings2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="space-y-4 pl-[52px]">
        {children}
      </div>
    </motion.div>
  );
}
