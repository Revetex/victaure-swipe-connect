
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";

interface AvatarControlsProps {
  hasAvatar: boolean;
  isLoading: boolean;
  onUpload: () => void;
  onDelete: () => void;
}

export function AvatarControls({ 
  hasAvatar, 
  isLoading, 
  onUpload, 
  onDelete 
}: AvatarControlsProps) {
  return (
    <div className="flex gap-2 mt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUpload}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <span className="ml-2">Modifier</span>
      </Button>
      
      {hasAvatar && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-2">Supprimer</span>
        </Button>
      )}
    </div>
  );
}
