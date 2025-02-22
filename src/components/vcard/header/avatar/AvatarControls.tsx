
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-2 mt-4 w-full justify-center sm:justify-start">
      <label className="relative flex-1 sm:flex-initial">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onUpload}
          accept="image/jpeg,image/png,image/webp"
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="outline"
          size={isMobile ? "default" : "sm"}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="ml-2">{hasAvatar ? 'Modifier' : 'Ajouter'}</span>
        </Button>
      </label>
      
      {hasAvatar && (
        <Button
          type="button"
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={onDelete}
          disabled={isLoading}
          className="flex-1 sm:flex-initial text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-2">Supprimer</span>
        </Button>
      )}
    </div>
  );
}
