import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VCardBadgeProps {
  text: string;
  isEditing?: boolean;
  onRemove?: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function VCardBadge({ 
  text, 
  isEditing, 
  onRemove,
  variant = "default" 
}: VCardBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "px-2 py-1 text-xs font-medium",
        isEditing && "pr-6 relative group"
      )}
    >
      {text}
      {isEditing && (
        <button
          onClick={onRemove}
          className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}