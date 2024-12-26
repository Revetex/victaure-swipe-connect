import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface VCardBadgeProps {
  text: string;
  onRemove?: () => void;
  isEditing?: boolean;
}

export function VCardBadge({ text, onRemove, isEditing }: VCardBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className="flex items-center gap-1 bg-muted text-muted-foreground hover:bg-muted/80"
    >
      {text}
      {isEditing && onRemove && (
        <X
          className="h-3 w-3 cursor-pointer hover:text-destructive"
          onClick={onRemove}
        />
      )}
    </Badge>
  );
}