import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  viewportHeight: number;
  isMobile: boolean;
}

export function DashboardContainer({
  children,
  isEditing,
  viewportHeight,
  isMobile
}: DashboardContainerProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {isEditing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-center text-sm font-medium text-muted-foreground py-2">
                Mode édition
              </h1>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn("container mx-auto px-0 sm:px-4", isEditing && "pt-10")}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}