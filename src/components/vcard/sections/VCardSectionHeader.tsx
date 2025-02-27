
import React from "react";
import { cn } from "@/lib/utils";

export interface VCardSectionHeaderProps {
  title: string;
  subtitle?: string;
  isEditing?: boolean;
  className?: string;
}

export function VCardSectionHeader({
  title,
  subtitle,
  isEditing,
  className
}: VCardSectionHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className={cn(
        "text-lg font-semibold",
        isEditing && "text-primary"
      )}>
        {title}
      </h3>
      
      {subtitle && (
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
