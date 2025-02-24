
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ 
  title, 
  description, 
  children, 
  className 
}: SettingsSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-6", className)}
    >
      <Card className={cn(
        "bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20",
        "backdrop-blur-sm border rounded-xl shadow-lg"
      )}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
