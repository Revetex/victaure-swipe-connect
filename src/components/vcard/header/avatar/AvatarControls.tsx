
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";

interface AvatarControlsProps {
  hasAvatar: boolean;
  isLoading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
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
      <label className="relative">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onUpload}
          accept="image/jpeg,image/png,image/webp"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="ml-2">Modifier</span>
        </Button>
      </label>
      
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
